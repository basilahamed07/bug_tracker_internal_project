import os
import urllib.parse
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_openai import AzureChatOpenAI

# from models import db,Project_name,Testers,Tester_name
# from flask_jwt_extended import jwt_required,get_jwt_identity
# from datetime import date
# from sqlalchemy import create_engine, distinct

from langchain.prompts import ChatPromptTemplate

from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotPromptTemplate,
    MessagesPlaceholder,
    PromptTemplate,
    SystemMessagePromptTemplate,
)



from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_community.vectorstores import FAISS
# from langchain_openai import OpenAIEmbeddings
from langsmith import traceable
from urllib.parse import quote_plus
from dotenv import load_dotenv
# from langchain_core.tools impor/t tool
from langchain.agents import Tool
from sqlalchemy import create_engine
from langchain_huggingface import HuggingFaceEmbeddings




# Initialize Flask App

# Load environment variables
load_dotenv()


required_env_vars = ["LANGCHAIN_API_KEY"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Set up OpenAI API key
# os.environ["OPENAI_API_TYPE"] = os.getenv("AZURE_OPENAI_API_TYPE")
# os.environ["AZURE_OPENAI_ENDPOINT"] = os.getenv("AZURE_OPENAI_ENDPOINT")
# os.environ["OPENAI_API_KEY"] = os.getenv("AZURE_OPENAI_API_KEY")
# os.environ["OPENAI_API_VERSION"] = os.getenv("AZURE_OPENAI_API_VERSION")

os.environ['LANGCHAIN_TRACING_V2']='true'
os.environ['LANGCHAIN_ENDPOINT'] ="https://api.smith.langchain.com"
os.environ['LANGCHAIN_API_KEY'] =os.getenv("LANGCHAIN_API_KEY")
os.environ['LANGCHAIN_PROJECT']="internal_project"
groq_api = os.getenv("groq_api_key")


# Database configuration
# DB_CONFIG = {
#     "host": os.getenv("DB_HOST", "localhost"),
#     "port": os.getenv("DB_PORT", "5432"),  # Default PostgreSQL port
#     "username": os.getenv("DB_USERNAME", "postgres"),
#     "password": os.getenv("DB_PASSWORD", 'Database@123'),
#     "database": os.getenv("DB_NAME", "AES_Mini"),
# }

# # Ensure password and other sensitive info are encoded
# encoded_password = urllib.parse.quote(DB_CONFIG["password"])

# Connection string
# DATABASE_URL = (
#     f"postgresql+psycopg2://{DB_CONFIG['username']}:{encoded_password}"
#     f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
# )


#for here i will create the database connection  by using the create_engine 

# server = os.getenv("SQL_SERVER_HOST")
# database = os.getenv("SQL_SERVER_DB")
# username = os.getenv("SQL_SERVER_USER")
# password = os.getenv("SQL_SERVER_PASSWORD")
# for database url


url = os.getenv("DATABASE_URL")
embadding_api = os.environ["GOOGLE_API_KEY"]



import getpass
import os

if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = getpass("Provide your Google API key here")

# DATABASE_URL = (
#     f"mssql+pyodbc://{username}:{password}@{server}/{database}"
#     f"?driver=ODBC Driver 17 for SQL Server"
# )


DATABASE_URL = (f"{url}")
# Check database connection
try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"Failed to connect to the database: {e}")
# Create an instance of SQLDatabase
# db = SQLDatabase.from_uri(DATABASE_URL)
db = SQLDatabase.from_uri(DATABASE_URL)
# Initialize LangChain LLM
llm = ChatGroq(temperature=0, groq_api_key=groq_api, model_name="llama-3.3-70b-versatile")
# Decide table and column function



def decide_table_column(query):
    """Decide which table and column will answer the query of the user."""
    with open(r"D:\SIX-DATA\internal_project_sajiv\Backend_flask\ai_for_database\table_column_description.txt", 'r') as file:
        file_content = file.read()
    template = f"""
    Based on the given user query: "{query}", return the table names and column names which will fetch the data from the database.
    If multiple tables are required to respond to the user query, select appropriate columns from different tables to form appropriate JOINs.
    Table and column descriptions are given here:
    {file_content}
    """
    prompt_template = ChatPromptTemplate.from_template(template)
    prompt = prompt_template.invoke({"query": query, "file_content": file_content})
    result = llm.invoke(prompt)
    return result.content


# Create a custom tool for deciding table and column
custom_tool = Tool(
    name="decide_table_column",
    func=decide_table_column,
    description="Decides which tables and columns answer the user's query, and determines joins between tables if required.",
)


# Prompt structure for SQL generation
system_prefix = """

You are an AI agent designed to interact with a SQL database to answer questions by querying specific tables and columns based on the provided schema information.
Given an input question, construct a syntactically correct SQL query based on the table and column descriptions. Retrieve the necessary information from the tables to provide an accurate answer. Ensure that the query is contextually relevant to the input question and adheres to the following guidelines:
1. Query Structure:
   - Avoid selecting all columns; only include relevant columns based on the question.
   - Limit results to the necessary records to maintain efficient queries.
   - Ensure that your queries do not contain DML statements (such as `INSERT`, `UPDATE`, `DELETE`, or `DROP`).

2. Error Handling:
   - Double-check the query syntax before execution.
   - If an error occurs during execution, rewrite the query based on error feedback and try again.
3. Question Types:
   - Any question related to 'Index Performance Summary' comes in, in response data of MTD, QTD and YTD is expected.
   - MTD stands for “month to date.” It’s the period starting from the beginning of the current month up until now … but not including today’s date, because it might not be complete yet.
   - QTD stands for “quarter to date.” It’s used in exactly the same way as MTD, except you’re looking at the time period from the start of this quarter until now.
   - YTD stands for “year to date” — again, from the beginning of the current year, up to but not including today.
   - For percentage data, please provide valuation in percentage example: 25.5%
Here are some example user inputs and their corresponding SQL queries:
"""



system_suffix = """
When providing the final answer:
-   **COMMON QUERIES:**  
 - **Greetings (hi, hello)**: Respond with **"Hello! how can i help yoy :)?"**
1. Contextualize: Summarize the information retrieved in a way that directly addresses the user's question. Provide concise, relevant answers instead of just returning raw query results.
2. Clarify Ambiguity: If the retrieved information does not directly answer the question, explain the context or suggest potential follow-up queries to refine the result.
3. Error Responses: If a query cannot be executed due to a syntax or data issue, respond with a clear message, like "The requested information could not be retrieved due to a query error. Please refine your question."
4. Unknown Queries: If the question is outside the scope of the database tables or cannot be answered with available data, "
Answer concisely and clearly, ensuring accuracy and relevance to the user's question.
"""



examples = [
    {"input": "give the tester names and details of 'sixdata", "query": 
     """SELECT 
    tn.tester_name AS tester_name,
    p.project_name AS project_name,
    t.billable AS billable_status,
    u.username AS assigned_user
    FROM 
        Testers t
    JOIN 
        Project_name p ON t.project_name_id = p.id
    JOIN 
        Users u ON t.user_id = u.id
    JOIN 
        "Tester_name" tn ON t.tester_name_id = tn.id
    WHERE 
        p.project_name = 'sixdata';"""},
    {"input": "give the current month metrics of sixdata project ?", "query": 
     """SELECT m.*
FROM metrics m
JOIN project_name p ON m.project_name_id = p.id
WHERE p.project_name = 'sixdata'
AND TO_CHAR(m.date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM');
"""}
]
embeddings  = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=embadding_api)
# embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L12-v2")
# Select examples using semantic similarity
example_selector = SemanticSimilarityExampleSelector.from_examples(
    examples,
    embeddings,
    FAISS,
    k=5,
    input_keys=["input"],
)
prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=PromptTemplate.from_template("User input: {input}\nSQL query: {query}"),
    input_variables=["input", "dialect", "top_k"],
    prefix=system_prefix,
    suffix=system_suffix,
)
full_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessagePromptTemplate(prompt=prompt),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ]
)
# Create SQL Agent
toolkit = SQLDatabaseToolkit(db=db, llm=llm)  # Use the SQLDatabase instance here
agent_executor = create_sql_agent(llm=llm, toolkit=toolkit, extra_tools=[custom_tool], prompt=full_prompt, verbose=True, agent_type="openai-tools", handle_parsing_errors=True)
    


def ai_chatbot_routing(app):

    # @traceable
    # # Define Flask API route
    # @app.route('/query', methods=['GET'])
    # def query_database():
    #     query = request.args.get('query')

    #     if not query:
    #         return jsonify({"error": "No query provided"}), 400

    #     try:
    #         result = agent_executor.invoke(query)
    #         return jsonify({"result": result})
    #     except Exception as e:
    #         return jsonify({"error": str(e)}), 500

    @traceable
    @app.route('/sample_question', methods=['POST'])
    def query_database():
        try:
            # Parse JSON input from the request
            data = request.get_json()

            if not data or 'question' not in data:
                return jsonify({"error": "No query provided. Please include a 'query' field in the JSON body."}), 400

            query = data['question']


            # Invoke the agent to get the SQL query results
            result = agent_executor.invoke(query)

            # Assuming the result is already in a structured JSON format, return it directly
            return jsonify({"result": result})

        except Exception as e:
            # Catch any errors and return as JSON
            return jsonify({"error": str(e)}), 500






# from flask import Flask, request, jsonify
# from langchain_groq import ChatGroq
# from langchain_community.utilities import SQLDatabase
# from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
# from langchain_community.agent_toolkits import create_sql_agent
# # from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_core.prompts import (
#     ChatPromptTemplate,
#     FewShotPromptTemplate,
#     MessagesPlaceholder,
#     PromptTemplate,
#     SystemMessagePromptTemplate,
# )
# from langchain_core.example_selectors import SemanticSimilarityExampleSelector
# from langchain_community.vectorstores import FAISS
# from langsmith import traceable
# from sqlalchemy import create_engine
# from dotenv import load_dotenv
# from langchain.agents import Tool
# import os

# # Load environment variables
# load_dotenv()

# # Validate required environment variables
# REQUIRED_ENV_VARS = {
#     "LANGCHAIN_API_KEY": "LangChain API key",
#     "DATABASE_URL": "Database URL",
#     "GOOGLE_API_KEY": "Google API key",
#     "GROQ_API_KEY": "Groq API key"
# }

# missing_vars = {var: desc for var, desc in REQUIRED_ENV_VARS.items() 
#                if not os.getenv(var)}
# if missing_vars:
#     raise ValueError(
#         "Missing required environment variables:\n" + 
#         "\n".join(f"- {var}: {desc}" for var, desc in missing_vars.items())
#     )

# # Configure LangChain
# os.environ.update({
#     'LANGCHAIN_TRACING_V2': 'true',
#     'LANGCHAIN_ENDPOINT': "https://api.smith.langchain.com",
#     'LANGCHAIN_API_KEY': os.getenv("LANGCHAIN_API_KEY"),
#     'LANGCHAIN_PROJECT': "internal_project"
# })

# def setup_database():
#     """Initialize database connection"""
#     try:
#         engine = create_engine(os.getenv("DATABASE_URL"))
#         with engine.connect() as connection:
#             print("Database connection successful!")
#         return SQLDatabase.from_uri(os.getenv("DATABASE_URL"))
#     except Exception as e:
#         raise ConnectionError(f"Failed to connect to database: {str(e)}")

# def create_table_column_tool(llm):
#     """Create custom tool for table/column decision making"""
#     def decide_table_column(query: str) -> str:
#         with open("table_column_description.txt", 'r') as file:
#             schema_desc = file.read()
            
#         template = """
#         Based on the user query: "{query}", determine the appropriate table names 
#         and column names for database querying.
        
#         Consider:
#         1. Select only necessary tables and columns
#         2. Identify required table joins
#         3. Apply appropriate filters
        
#         Schema description:
#         {schema_desc}
#         """
        
#         prompt = ChatPromptTemplate.from_template(template).invoke({
#             "query": query, 
#             "schema_desc": schema_desc
#         })
#         return llm.invoke(prompt).content
    
#     return Tool(
#         name="decide_table_column",
#         func=decide_table_column,
#         description="Determines optimal tables, columns and joins for query execution"
#     )

# def create_sql_prompt_template():
#     """Create the SQL prompt template with examples"""
#     examples = [
#         {
#             "input": "Show all users with their projects",
#             "query": """
#                 SELECT u.id, u.name, p.project_name 
#                 FROM users u
#                 LEFT JOIN project_name p ON u.id = p.user_id
#             """
#         },
#         {
#             "input": "Get testers assigned to project 'Alpha'",
#             "query": """
#                 SELECT t.id, tn.name 
#                 FROM testers t
#                 JOIN tester_name tn ON t.tester_name_id = tn.id
#                 JOIN project_name p ON t.project_id = p.id
#                 WHERE p.project_name = 'Alpha'
#             """
#         }
#     ]

#     embeddings = GoogleGenerativeAIEmbeddings(
#         model="models/embedding-001",
#         google_api_key=os.getenv("GOOGLE_API_KEY")
#     )
    
#     example_selector = SemanticSimilarityExampleSelector.from_examples(
#         examples,
#         embeddings,
#         FAISS,
#         k=2
#     )
    
#     return FewShotPromptTemplate(
#         example_selector=example_selector,
#         example_prompt=PromptTemplate.from_template(
#             "Input: {input}\nSQL: {query}"
#         ),
#         prefix="""You are an SQL expert. Generate queries that:
#         1. Select only necessary columns
#         2. Use appropriate joins
#         3. Include proper filtering
#         4. Follow security best practices""",
#         suffix="Input: {input}",
#         input_variables=["input"]
#     )

# def setup_agent(db, llm):
#     """Initialize the SQL agent with all components"""
#     toolkit = SQLDatabaseToolkit(db=db, llm=llm)
#     custom_tool = create_table_column_tool(llm)
#     prompt = create_sql_prompt_template()
    
#     return create_sql_agent(
#         llm=llm,
#         toolkit=toolkit,
#         extra_tools=[custom_tool],
#         prompt=prompt,
#         verbose=True,
#         agent_type="openai-tools",
#         handle_parsing_errors=True
#     )
    
# def ai_chatbot_routing(app):
#     """Route for AI chatbot"""
#     @app.route('/sample_question', methods=['POST'])
#     @traceable
#     def query_database():
#             # Initialize components
        
#         db = setup_database()
#         llm = ChatGroq(
#             temperature=0,
#             groq_api_key=os.getenv("GROQ_API_KEY"),
#             model_name="llama-3.3-70b-versatile"
#         )
#         agent = setup_agent(db, llm)
#         try:
#             data = request.get_json()
#             if not data or 'question' not in data:
#                 return jsonify({
#                     "error": "Missing required field 'question' in request body"
#                 }), 400
                
#             result = agent.invoke(data['question'])
#             return jsonify({"result": result})
            
#         except Exception as e:
#             return jsonify({
#                 "error": str(e),
#                 "type": type(e).__name__
#             }), 500
    
#     return app





# from flask import Flask, request, jsonify
# from langchain_groq import ChatGroq
# from langchain_community.utilities import SQLDatabase
# from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
# from langchain_community.agent_toolkits import create_sql_agent
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_core.prompts import (
#     ChatPromptTemplate,
#     FewShotPromptTemplate,
#     MessagesPlaceholder,
#     PromptTemplate,
#     SystemMessagePromptTemplate,
# )
# from langchain_core.example_selectors import SemanticSimilarityExampleSelector
# from langchain_community.vectorstores import FAISS
# from langsmith import traceable
# from sqlalchemy import create_engine
# from dotenv import load_dotenv
# from langchain.agents import Tool
# import os

# # Load environment variables
# load_dotenv()

# # Validate required environment variables
# REQUIRED_ENV_VARS = {
#     "LANGCHAIN_API_KEY": "LangChain API key",
#     "DATABASE_URL": "Database URL",
#     "GOOGLE_API_KEY": "Google API key",
#     "GROQ_API_KEY": "Groq API key"
# }

# missing_vars = {var: desc for var, desc in REQUIRED_ENV_VARS.items() 
#                if not os.getenv(var)}
# if missing_vars:
#     raise ValueError(
#         "Missing required environment variables:\n" + 
#         "\n".join(f"- {var}: {desc}" for var, desc in missing_vars.items())
#     )

# # Configure LangChain
# os.environ.update({
#     'LANGCHAIN_TRACING_V2': 'true',
#     'LANGCHAIN_ENDPOINT': "https://api.smith.langchain.com",
#     'LANGCHAIN_API_KEY': os.getenv("LANGCHAIN_API_KEY"),
#     'LANGCHAIN_PROJECT': "internal_project"
# })

# def setup_database():
#     """Initialize database connection"""
#     try:
#         engine = create_engine(os.getenv("DATABASE_URL"))
#         with engine.connect() as connection:
#             print("Database connection successful!")
#         return SQLDatabase.from_uri(os.getenv("DATABASE_URL"))
#     except Exception as e:
#         raise ConnectionError(f"Failed to connect to database: {str(e)}")

# def create_table_column_tool(llm):
#     """Create custom tool for table/column decision making"""
#     def decide_table_column(query: str) -> str:
#         with open(r"D:\SIX-DATA\internal_project_sajiv\Backend_flask\ai_for_database\table_column_description.txt", 'r') as file:
#             schema_desc = file.read()
            
#         template = """
#         Based on the user query: "{query}", determine the appropriate table names 
#         and column names for database querying.
        
#         Consider:
#         1. Select only necessary tables and columns
#         2. Identify required table joins
#         3. Apply appropriate filters
        
#         Schema description:
#         {schema_desc}
#         """
        
#         prompt = ChatPromptTemplate.from_template(template).invoke({
#             "query": query, 
#             "schema_desc": schema_desc
#         })
#         return llm.invoke(prompt).content
    
#     return Tool(
#         name="decide_table_column",
#         func=decide_table_column,
#         description="Determines optimal tables, columns and joins for query execution"
#     )

# def create_prompt_template():
#     """Create the complete prompt template with system message and examples"""
#     system_message = """You are an SQL database assistant for a project management system. Handle queries according to these rules:

# 1. COMMON QUERIES:
#    - Greetings (hi, hello): Respond with "Hello! I can help you with querying project, tester, and user information. What would you like to know?"
#    - Project details: Provide comprehensive project information including rag status, tester count, and billing details
#    - Tester information: Include both billable and non-billable testers, their assignments, and project associations

# 2. SQL QUERY RULES:
#    - Use appropriate JOINs to connect related tables
#    - Include relevant columns only
#    - Apply proper filtering and grouping
#    - Format numbers and dates appropriately
#    - Handle NULL values gracefully

# 3. SPECIFIC RESPONSE FORMATS:
#    For project queries:
#    - Include project name, rag status, tester count
#    - Show billable/non-billable breakdown
#    - Include automation and AI usage status

#    For tester queries:
#    - Show tester name, assigned project
#    - Include billable status
#    - Group by project when relevant"""

#     examples = [
#         {
#             "input": "hi",
#             "response": "Hello! I can help you with querying project, tester, and user information. What would you like to know?"
#         },
#         {
#             "input": "give details of the project",
#             "query": """
#                 SELECT 
#                     pn.project_name,
#                     pd.rag,
#                     pd.tester_count,
#                     pd.billing_type,
#                     pd.automation,
#                     pd.ai_used,
#                     pd.rag_details
#                 FROM project_name pn
#                 JOIN project_details pd ON pn.id = pd.project_name_id
#                 ORDER BY pn.project_name;
#             """,
#             "explanation": "This query retrieves comprehensive project details including rag status, tester count, and other key metrics."
#         },
#         {
#             "input": "get the tester count and names",
#             "query": """
#                 SELECT 
#                     pn.project_name,
#                     COUNT(t.id) as total_testers,
#                     STRING_AGG(tn.tester_name, ', ') as tester_names,
#                     SUM(CASE WHEN t.billable = true THEN 1 ELSE 0 END) as billable_count,
#                     SUM(CASE WHEN t.billable = false THEN 1 ELSE 0 END) as non_billable_count
#                 FROM project_name pn
#                 LEFT JOIN testers t ON pn.id = t.project_name_id
#                 LEFT JOIN Tester_name tn ON t.tester_name_id = tn.id
#                 GROUP BY pn.project_name
#                 ORDER BY pn.project_name;
#             """,
#             "explanation": "This query shows tester counts and names for each project, including billable status breakdown."
#         }
#     ]

#     # Create embeddings and example selector
#     embeddings = GoogleGenerativeAIEmbeddings(
#         model="models/embedding-001",
#         google_api_key=os.getenv("GOOGLE_API_KEY")
#     )
    
#     example_selector = SemanticSimilarityExampleSelector.from_examples(
#         examples,
#         embeddings,
#         FAISS,
#         k=2
#     )

#     # Create few-shot template with improved structure
#     few_shot = FewShotPromptTemplate(
#         example_selector=example_selector,
#         example_prompt=PromptTemplate.from_template(
#             "User: {input}\nAssistant: {explanation if explanation else ''}\n{query if query else response}\n"
#         ),
#         prefix=system_message,
#         suffix="User: {input}\nAssistant: Let me help you with that query.",
#         input_variables=["input"]
#     )

#     # Return final chat template
#     return ChatPromptTemplate.from_messages([
#         ("system", system_message),
#         MessagesPlaceholder(variable_name="chat_history"),
#         ("human", "{input}"),
#         MessagesPlaceholder(variable_name="agent_scratchpad")
#     ])

# def setup_agent(db, llm):
#     """Initialize the SQL agent with all components"""
#     toolkit = SQLDatabaseToolkit(db=db, llm=llm)
#     custom_tool = create_table_column_tool(llm)
#     prompt = create_prompt_template()
    
#     return create_sql_agent(
#         llm=llm,
#         toolkit=toolkit,
#         extra_tools=[custom_tool],
#         prompt=prompt,
#         verbose=True,
#         agent_type="openai-tools",
#         handle_parsing_errors=True
#     )

# def ai_chatbot_routing(app):
#     """Route for AI chatbot"""
#     # Initialize components once at startup
#     db = setup_database()
#     llm = ChatGroq(
#         temperature=0,
#         groq_api_key=os.getenv("GROQ_API_KEY"),
#         model_name="llama-3.3-70b-versatile"
#     )
#     agent = setup_agent(db, llm)
    
#     @app.route('/sample_question', methods=['POST'])
#     @traceable
#     def query_database():
#         try:
#             data = request.get_json()
#             if not data or 'question' not in data:
#                 return jsonify({
#                     "error": "Missing required field 'question' in request body"
#                 }), 400
                
#             result = agent.invoke({
#                 "input": data['question'],
#                 "chat_history": [],  # Add chat history if needed
#                 "agent_scratchpad": []  # Initialize empty scratchpad
#             })
#             return jsonify({"result": result})
            
#         except Exception as e:
#             return jsonify({
#                 "error": str(e),
#                 "type": type(e).__name__
#             }), 500
    
#     return app








# from flask import Flask, request, jsonify
# from langchain_groq import ChatGroq
# from langchain_community.utilities import SQLDatabase
# from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
# from langchain_community.agent_toolkits import create_sql_agent
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_core.prompts import (
#     ChatPromptTemplate,
#     FewShotPromptTemplate,
#     MessagesPlaceholder,
#     PromptTemplate,
#     SystemMessagePromptTemplate,
# )
# from langchain_core.example_selectors import SemanticSimilarityExampleSelector
# from langchain_community.vectorstores import FAISS
# from langsmith import traceable
# from sqlalchemy import create_engine
# from dotenv import load_dotenv
# from langchain.agents import Tool
# import os
# import logging

# # Initialize logging for debugging
# logging.basicConfig(level=logging.DEBUG)

# # Load environment variables
# load_dotenv()

# # Validate required environment variables
# REQUIRED_ENV_VARS = {
#     "LANGCHAIN_API_KEY": "LangChain API key",
#     "DATABASE_URL": "Database URL",
#     "GOOGLE_API_KEY": "Google API key",
#     "GROQ_API_KEY": "Groq API key"
# }

# missing_vars = {var: desc for var, desc in REQUIRED_ENV_VARS.items() 
#                if not os.getenv(var)}
# if missing_vars:
#     raise ValueError(
#         "Missing required environment variables:\n" + 
#         "\n".join(f"- {var}: {desc}" for var, desc in missing_vars.items())
#     )

# # Configure LangChain
# os.environ.update({
#     'LANGCHAIN_TRACING_V2': 'true',
#     'LANGCHAIN_ENDPOINT': "https://api.smith.langchain.com",
#     'LANGCHAIN_API_KEY': os.getenv("LANGCHAIN_API_KEY"),
#     'LANGCHAIN_PROJECT': "internal_project"
# })

# def setup_database():
#     """Initialize database connection"""
#     try:
#         engine = create_engine(os.getenv("DATABASE_URL"))
#         with engine.connect() as connection:
#             logging.debug("Database connection successful!")
#         return SQLDatabase.from_uri(os.getenv("DATABASE_URL"))
#     except Exception as e:
#         logging.error(f"Failed to connect to database: {str(e)}")
#         raise ConnectionError(f"Failed to connect to database: {str(e)}")

# def create_table_column_tool(llm):
#     """Create custom tool for table/column decision making"""
#     def decide_table_column(query: str) -> str:
#         try:
#             with open(r"D:\SIX-DATA\internal_project_sajiv\Backend_flask\ai_for_database\table_column_description.txt", 'r') as file:
#                 schema_desc = file.read()
#             logging.debug("Schema description successfully loaded.")
#         except Exception as e:
#             logging.error(f"Error reading the file: {e}")
#             schema_desc = ""  # Use empty string if the file can't be read

#         template = """
#         Based on the user query: "{query}", determine the appropriate table names 
#         and column names for database querying.
        
#         Consider:
#         1. Select only necessary tables and columns
#         2. Identify required table joins
#         3. Apply appropriate filters
        
#         Schema description:
#         {schema_desc}
#         """
        
#         try:
#             prompt = ChatPromptTemplate.from_template(template).invoke({
#                 "query": query, 
#                 "schema_desc": schema_desc
#             })
#             logging.debug(f"Generated prompt: {prompt}")
#         except Exception as e:
#             logging.error(f"Error generating prompt: {e}")
#             return "Error generating prompt."

#         try:
#             response = llm.invoke(prompt)
#             logging.debug(f"LLM response: {response.content}")
#             return response.content
#         except Exception as e:
#             logging.error(f"Error calling LLM: {e}")
#             return "Error calling LLM."

#     return Tool(
#         name="decide_table_column",
#         func=decide_table_column,
#         description="Determines optimal tables, columns, and joins for query execution"
#     )

# def create_prompt_template():
#     """Create the complete prompt template with system message and examples"""
#     system_message = """You are an SQL database assistant for a project management system. Handle queries according to these rules:

# 1. COMMON QUERIES:
#    - Greetings (hi, hello): Respond with "Hello! I can help you with querying project, tester, and user information. What would you like to know?"
#    - Project details: Provide comprehensive project information including rag status, tester count, and billing details
#    - Tester information: Include both billable and non-billable testers, their assignments, and project associations

# 2. SQL QUERY RULES:
#    - Use appropriate JOINs to connect related tables
#    - Include relevant columns only
#    - Apply proper filtering and grouping
#    - Format numbers and dates appropriately
#    - Handle NULL values gracefully

# 3. SPECIFIC RESPONSE FORMATS:
#    For project queries:
#    - Include project name, rag status, tester count
#    - Show billable/non-billable breakdown
#    - Include automation and AI usage status

#    For tester queries:
#    - Show tester name, assigned project
#    - Include billable status
#    - Group by project when relevant"""

#     examples = [
#         {
#             "input": "hi",
#             "response": "Hello! I can help you with querying project, tester, and user information. What would you like to know?"
#         },
#         {
#             "input": "give details of the project",
#             "query": """
#                 SELECT 
#                     pn.project_name,
#                     pd.rag,
#                     pd.tester_count,
#                     pd.billing_type,
#                     pd.automation,
#                     pd.ai_used,
#                     pd.rag_details
#                 FROM project_name pn
#                 JOIN project_details pd ON pn.id = pd.project_name_id
#                 ORDER BY pn.project_name;
#             """,
#             "explanation": "This query retrieves comprehensive project details including rag status, tester count, and other key metrics."
#         },
#         {
#             "input": "get the tester count and names",
#             "query": """
#                 SELECT 
#                     pn.project_name,
#                     COUNT(t.id) as total_testers,
#                     STRING_AGG(tn.tester_name, ', ') as tester_names,
#                     SUM(CASE WHEN t.billable = true THEN 1 ELSE 0 END) as billable_count,
#                     SUM(CASE WHEN t.billable = false THEN 1 ELSE 0 END) as non_billable_count
#                 FROM project_name pn
#                 LEFT JOIN testers t ON pn.id = t.project_name_id
#                 LEFT JOIN Tester_name tn ON t.tester_name_id = tn.id
#                 GROUP BY pn.project_name
#                 ORDER BY pn.project_name;
#             """,
#             "explanation": "This query shows tester counts and names for each project, including billable status breakdown."
#         }
#     ]

#     try:
#         embeddings = GoogleGenerativeAIEmbeddings(
#             model="models/embedding-001",
#             google_api_key=os.getenv("GOOGLE_API_KEY")
#         )
#         logging.debug("Embeddings created successfully.")
#     except Exception as e:
#         logging.error(f"Error creating embeddings: {e}")
#         embeddings = None
    
#     example_selector = None
#     if embeddings:
#         try:
#             example_selector = SemanticSimilarityExampleSelector.from_examples(
#                 examples,
#                 embeddings,
#                 FAISS,
#                 k=2
#             )
#             logging.debug("Example selector created successfully.")
#         except Exception as e:
#             logging.error(f"Error creating example selector: {e}")

#     try:
#         few_shot = FewShotPromptTemplate(
#             example_selector=example_selector,
#             example_prompt=PromptTemplate.from_template(
#                 "User: {input}\nAssistant: {explanation if explanation else ''}\n{query if query else response}\n"
#             ),
#             prefix=system_message,
#             suffix="User: {input}\nAssistant: Let me help you with that query.",
#             input_variables=["input"]
#         )
#         logging.debug("Few-shot prompt template created successfully.")
#     except Exception as e:
#         logging.error(f"Error creating few-shot prompt template: {e}")
#         few_shot = None

#     try:
#         return ChatPromptTemplate.from_messages([
#             ("system", system_message),
#             MessagesPlaceholder(variable_name="chat_history"),
#             ("human", "{input}"),
#             MessagesPlaceholder(variable_name="agent_scratchpad")
#         ])
#     except Exception as e:
#         logging.error(f"Error creating chat prompt template: {e}")
#         return None

# def setup_agent(db, llm):
#     """Initialize the SQL agent with all components"""
#     toolkit = SQLDatabaseToolkit(db=db, llm=llm)
#     custom_tool = create_table_column_tool(llm)
#     prompt = create_prompt_template()
    
#     return create_sql_agent(
#         llm=llm,
#         toolkit=toolkit,
#         extra_tools=[custom_tool],
#         prompt=prompt,
#         verbose=True,
#         agent_type="openai-tools",
#         handle_parsing_errors=True
#     )

# def ai_chatbot_routing(app):
#     """Route for AI chatbot"""
#     # Initialize components once at startup
#     db = setup_database()
#     llm = ChatGroq(
#         temperature=0,
#         groq_api_key=os.getenv("GROQ_API_KEY"),
#         model_name="llama-3.3-70b-versatile"
#     )
#     agent = setup_agent(db, llm)
    
#     @app.route('/sample_question', methods=['POST'])
#     @traceable
#     def query_database():
#         try:
#             data = request.get_json()
#             if not data or 'question' not in data:
#                 return jsonify({
#                     "error": "Missing required field 'question' in request body"
#                 }), 400
                
#             result = agent.invoke({
#                 "input": data['question'],
#                 "chat_history": [],  # Add chat history if needed
#                 "agent_scratchpad": []  # Initialize empty scratchpad
#             })
#             return jsonify({"result": result})
            
#         except Exception as e:
#             logging.error(f"Error processing request: {str(e)}")
#             return jsonify({
#                 "error": str(e),
#                 "type": type(e).__name__
#             }), 500
    
#     return app


# ------------------------------working code ------------------------------

# from flask import Flask, request, jsonify
# from langchain_groq import ChatGroq
# from langchain_community.utilities import SQLDatabase
# from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
# from langchain_community.agent_toolkits import create_sql_agent
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_core.prompts import (
#     ChatPromptTemplate,
#     FewShotPromptTemplate,
#     MessagesPlaceholder,
#     PromptTemplate,
#     SystemMessagePromptTemplate,
# )
# from langchain_core.example_selectors import SemanticSimilarityExampleSelector
# from langchain_community.vectorstores import FAISS
# from langsmith import traceable
# from sqlalchemy import create_engine
# from dotenv import load_dotenv
# from langchain.agents import Tool
# import os

# # Load environment variables
# load_dotenv()

# # Validate required environment variables
# REQUIRED_ENV_VARS = {
#     "LANGCHAIN_API_KEY": "LangChain API key",
#     "DATABASE_URL": "Database URL",
#     "GOOGLE_API_KEY": "Google API key",
#     "GROQ_API_KEY": "Groq API key"
# }

# missing_vars = {var: desc for var, desc in REQUIRED_ENV_VARS.items() 
#                if not os.getenv(var)}
# if missing_vars:
#     raise ValueError(
#         "Missing required environment variables:\n" + 
#         "\n".join(f"- {var}: {desc}" for var, desc in missing_vars.items())
#     )

# # Configure LangChain
# os.environ.update({
#     'LANGCHAIN_TRACING_V2': 'true',
#     'LANGCHAIN_ENDPOINT': "https://api.smith.langchain.com",
#     'LANGCHAIN_API_KEY': os.getenv("LANGCHAIN_API_KEY"),
#     'LANGCHAIN_PROJECT': "internal_project"
# })

# def setup_database():
#     """Initialize database connection"""
#     try:
#         engine = create_engine(os.getenv("DATABASE_URL"))
#         with engine.connect() as connection:
#             print("Database connection successful!")
#         return SQLDatabase.from_uri(os.getenv("DATABASE_URL"))
#     except Exception as e:
#         raise ConnectionError(f"Failed to connect to database: {str(e)}")

# def create_table_column_tool(llm):
#     """Create custom tool for table/column decision making"""
#     def decide_table_column(query: str) -> str:
#         with open(r"D:\SIX-DATA\internal_project_sajiv\Backend_flask\ai_for_database\table_column_description.txt", 'r') as file:
#             schema_desc = file.read()
            
#         template = """
#         Based on the user query: "{query}", determine the appropriate table names 
#         and column names for database querying.
        
#         Consider:
#         1. Select only necessary tables and columns
#         2. Identify required table joins
#         3. Apply appropriate filters
        
#         Schema description:
#         {schema_desc}
#         """
        
#         prompt = ChatPromptTemplate.from_template(template).invoke({
#             "query": query, 
#             "schema_desc": schema_desc
#         })
#         # print(llm.invoke(prompt).content)
#         # return "super"
#         return llm.invoke(prompt).content
        
    
#     return Tool(
#         name="decide_table_column",
#         func=decide_table_column,
#         description="Determines optimal tables, columns and joins for query execution"
#     )

# def create_prompt_template():
#     """Create the complete prompt template with system message and examples"""
#     # Define system message
#     system_message = """
# ---

# **COMMON QUERIES:**  
# - **Greetings (hi, hello)**: Respond with **"Hello! how can i help yoy :)?"**

# ---

# **SQL QUERY RULES:**
# - Use appropriate JOINs to connect related tables.  
# - Include relevant columns only.  
# - Apply proper filtering and grouping.  
# - Format numbers and dates appropriately.  
# - Handle NULL values gracefully.

# ---

# **SPECIFIC RESPONSE FORMATS:**

# - **For project detail queries**:
#    - Include project name, rag status, tester count.    
#    - Include automation and AI usage status.  
   
# - **For tester queries**:
#    - Show tester name, assigned project.  
#    - Include billable status.  
#    - Group by project when relevant.

#     """

#     # Define examples
#     examples = [{"input": "give the tester names and details of 'sixdata'", "query": """SELECT 
#     tn.tester_name AS tester_name,
#     p.project_name AS project_name,
#     t.billable AS billable_status,
#     u.username AS assigned_user
#     FROM 
#         Testers t
#     JOIN 
#         Project_name p ON t.project_name_id = p.id
#     JOIN 
#         Users u ON t.user_id = u.id
#     JOIN 
#         "Tester_name" tn ON t.tester_name_id = tn.id
#     WHERE 
#         p.project_name = 'sixdata';
#     """},]


#     # Create embeddings and example selector
#     embeddings = GoogleGenerativeAIEmbeddings(
#         model="models/embedding-001",
#         google_api_key=os.getenv("GOOGLE_API_KEY")
#     )
    
#     example_selector = SemanticSimilarityExampleSelector.from_examples(
#         examples,
#         embeddings,
#         FAISS,
#         k=2
#     )

#     # Create few-shot template
#     few_shot = FewShotPromptTemplate(
#         example_selector=example_selector,
#         example_prompt=PromptTemplate.from_template(
#             "User: {input}\nAssistant: Let me help you with that SQL query:\n{query}\n"
#         ),
#         prefix=system_message,
#         suffix="User: {input}\nAssistant: Let me help you with that.",
#         input_variables=["input"]
#     )

#     # Create final chat template
#     return ChatPromptTemplate.from_messages([
#         ("system", system_message),
#         MessagesPlaceholder(variable_name="chat_history"),
#         ("human", "{input}"),
#         MessagesPlaceholder(variable_name="agent_scratchpad")
#     ])

# def setup_agent(db, llm):
#     """Initialize the SQL agent with all components"""
#     toolkit = SQLDatabaseToolkit(db=db, llm=llm)
#     custom_tool = create_table_column_tool(llm)
#     prompt = create_prompt_template()
    
#     return create_sql_agent(
#         llm=llm,
#         toolkit=toolkit,
#         extra_tools=[custom_tool],
#         prompt=prompt,
#         verbose=True,
#         agent_type="openai-tools",
#         handle_parsing_errors=True
#     )

# def ai_chatbot_routing(app):
#     """Route for AI chatbot"""
#     # Initialize components once at startup
#     db = setup_database()
#     llm = ChatGroq(
#         temperature=0,
#         groq_api_key=os.getenv("GROQ_API_KEY"),
#         model_name="llama-3.3-70b-versatile"
#     )
#     agent = setup_agent(db, llm)
    
#     @app.route('/sample_question', methods=['POST'])
#     @traceable
#     def query_database():
#         try:
#             data = request.get_json()
#             if not data or 'question' not in data:
#                 return jsonify({
#                     "error": "Missing required field 'question' in request body"
#                 }), 400
                
#             result = agent.invoke({
#                 "input": data['question'],
#                 "chat_history": [],  # Add chat history if needed
#                 "agent_scratchpad": []  # Initialize empty scratchpad
#             })
#             return jsonify({"result": result})
            
#         except Exception as e:
#             return jsonify({
#                 "error": str(e),
#                 "type": type(e).__name__
#             }), 500
    
#     return app









# --------------------------new code by using the langgraph -------------------------



# from flask import Flask, request, jsonify
# from dotenv import load_dotenv
# from langsmith import traceable
# from dotenv import load_dotenv
# import os
# load_dotenv()
# # to connect the sql server
# from langchain_community.utilities import SQLDatabase

# db = SQLDatabase.from_uri("postgresql://postgres:database@localhost/internal_project_1")
# print(db.dialect)
# print(db.get_usable_table_names())
# # db.run("SELECT * FROM defect_accepted_rejected LIMIT 10;")

# os.environ['LANGCHAIN_TRACING_V2']='true'
# os.environ['LANGCHAIN_ENDPOINT'] ="https://api.smith.langchain.com"
# os.environ['LANGCHAIN_API_KEY'] =os.getenv("LANGCHAIN_API_KEY")
# os.environ['LANGCHAIN_PROJECT']="internal_project"



# from typing import Any

# from langchain_core.messages import ToolMessage
# from langchain_core.runnables import RunnableLambda, RunnableWithFallbacks
# from langgraph.prebuilt import ToolNode


# def create_tool_node_with_fallback(tools: list) -> RunnableWithFallbacks[Any, dict]:
#     """
#     Create a ToolNode with a fallback to handle errors and surface them to the agent.
#     """
#     return ToolNode(tools).with_fallbacks(
#         [RunnableLambda(handle_tool_error)], exception_key="error"
#     )


# def handle_tool_error(state) -> dict:
#     error = state.get("error")
#     tool_calls = state["messages"][-1].tool_calls
#     return {
#         "messages": [
#             ToolMessage(
#                 content=f"Error: {repr(error)}\n please fix your mistakes.",
#                 tool_call_id=tc["id"],
#             )
#             for tc in tool_calls
#         ]
#     }



# from langchain_community.agent_toolkits import SQLDatabaseToolkit
# from langchain_groq import ChatGroq
# from langchain_core.tools import tool

# toolkit = SQLDatabaseToolkit(db=db, llm=ChatGroq(temperature=0, groq_api_key="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", model_name="llama-3.3-70b-versatile"))
# tools = toolkit.get_tools()

# list_tables_tool = next(tool for tool in tools if tool.name == "sql_db_list_tables")
# get_schema_tool = next(tool for tool in tools if tool.name == "sql_db_schema")

# @tool
# def db_query_tool(query: str) -> str:
#     """
#     Executes a database query and returns the result.
    
#     Args:
#         query (str): The SQL query to execute.
    
#     Returns:
#         str: The result of the query or an error message if the query fails.
#     """
#     result = db.run_no_throw(query)
#     if not result:
#         return "Error: Query failed. Please rewrite your query and try again."
#     return result




# from langchain_core.prompts import ChatPromptTemplate

# query_check_system = """
# common quuery(hi, hello mean) responde like hello how can i help you 
# You are a SQL expert with a strong attention to detail.
# Double check the SQLite query for common mistakes, including:
# - Using NOT IN with NULL values
# - Using UNION when UNION ALL should have been used
# - Using BETWEEN for exclusive ranges
# - Data type mismatch in predicates
# - Properly quoting identifiers
# - Using the correct number of arguments for functions
# - Casting to the correct data type
# - Using the proper columns for joins

# If there are any of the above mistakes, rewrite the query. If there are no mistakes, just reproduce the original query.

# You will call the appropriate tool to execute the query after running this check."""

# query_check_prompt = ChatPromptTemplate.from_messages(
#   [("system", query_check_system), ("placeholder", "{messages}")]
# )
# query_check = query_check_prompt | ChatGroq(temperature=0, groq_api_key="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", model_name="llama-3.3-70b-versatile").bind_tools(
#   [db_query_tool], tool_choice="required"
# )



# from typing import Annotated, Literal
# from langchain_groq import ChatGroq
# from langchain_core.messages import AIMessage
# from langchain_core.pydantic_v1 import BaseModel, Field

# from typing_extensions import TypedDict

# from langgraph.graph import END, StateGraph, START
# from langgraph.graph.message import AnyMessage, add_messages


# # Define the state for the agent
# class State(TypedDict):
#     messages: Annotated[list[AnyMessage], add_messages]


# # Define a new graph
# workflow = StateGraph(State)


# # Add a node for the first tool call
# def first_tool_call(state: State) -> dict[str, list[AIMessage]]:
#     return {
#         "messages": [
#             AIMessage(
#                 content="",
#                 tool_calls=[
#                     {
#                         "name": "sql_db_list_tables",
#                         "args": {},
#                         "id": "tool_abcd123",
#                     }
#                 ],
#             )
#         ]
#     }


# def model_check_query(state: State) -> dict[str, list[AIMessage]]:
#     """
#     Use this tool to double-check if your query is correct before executing it.
#     """
#     return {"messages": [query_check.invoke({"messages": [state["messages"][-1]]})]}


# workflow.add_node("first_tool_call", first_tool_call)

# # Add nodes for the first two tools
# workflow.add_node(
#     "list_tables_tool", create_tool_node_with_fallback([list_tables_tool])
# )
# workflow.add_node("get_schema_tool", create_tool_node_with_fallback([get_schema_tool]))

# # Add a node for a model to choose the relevant tables based on the question and available tables
# model_get_schema = ChatGroq(temperature=0, groq_api_key="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", model_name="llama-3.3-70b-versatile").bind_tools(
#     [get_schema_tool]
# )
# workflow.add_node(
#     "model_get_schema",
#     lambda state: {
#         "messages": [model_get_schema.invoke(state["messages"])],
#     },
# )


# # Describe a tool to represent the end state
# class SubmitFinalAnswer(BaseModel):
#     """Submit the final answer to the user based on the query results."""

#     final_answer: str = Field(..., description="The final answer to the user")


# # Add a node for a model to generate a query based on the question and schema
# query_gen_system = """You are a SQL expert with a strong attention to detail.

# Given an input question, output a syntactically correct SQLite query to run, then look at the results of the query and return the answer.

# DO NOT call any tool besides SubmitFinalAnswer to submit the final answer.

# When generating the query:

# Output the SQL query that answers the input question without a tool call.

# Unless the user specifies a specific number of examples they wish to obtain, always limit your query to at most 5 results.
# You can order the results by a relevant column to return the most interesting examples in the database.
# Never query for all the columns from a specific table, only ask for the relevant columns given the question.

# If you get an error while executing a query, rewrite the query and try again.

# If you get an empty result set, you should try to rewrite the query to get a non-empty result set. 
# NEVER make stuff up if you don't have enough information to answer the query... just say you don't have enough information.

# If you have enough information to answer the input question, simply invoke the appropriate tool to submit the final answer to the user.

# DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database."""
# query_gen_prompt = ChatPromptTemplate.from_messages(
#     [("system", query_gen_system), ("placeholder", "{messages}")]
# )
# query_gen = query_gen_prompt | ChatGroq(temperature=0, groq_api_key="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", model_name="llama-3.3-70b-versatile").bind_tools(
#     [SubmitFinalAnswer]
# )


# def query_gen_node(state: State):
#     message = query_gen.invoke(state)

#     # Sometimes, the LLM will hallucinate and call the wrong tool. We need to catch this and return an error message.
#     tool_messages = []
#     if message.tool_calls:
#         for tc in message.tool_calls:
#             if tc["name"] != "SubmitFinalAnswer":
#                 tool_messages.append(
#                     ToolMessage(
#                         content=f"Error: The wrong tool was called: {tc['name']}. Please fix your mistakes. Remember to only call SubmitFinalAnswer to submit the final answer. Generated queries should be outputted WITHOUT a tool call.",
#                         tool_call_id=tc["id"],
#                     )
#                 )
#     else:
#         tool_messages = []
#     return {"messages": [message] + tool_messages}


# workflow.add_node("query_gen", query_gen_node)

# # Add a node for the model to check the query before executing it
# workflow.add_node("correct_query", model_check_query)

# # Add node for executing the query
# workflow.add_node("execute_query", create_tool_node_with_fallback([db_query_tool]))


# # Define a conditional edge to decide whether to continue or end the workflow
# def should_continue(state: State) -> Literal[END, "correct_query", "query_gen"]:
#     messages = state["messages"]
#     last_message = messages[-1]
#     # If there is a tool call, then we finish
#     if getattr(last_message, "tool_calls", None):
#         return END
#     if last_message.content.startswith("Error:"):
#         return "query_gen"
#     else:
#         return "correct_query"


# # Specify the edges between the nodes
# workflow.add_edge(START, "first_tool_call")
# workflow.add_edge("first_tool_call", "list_tables_tool")
# workflow.add_edge("list_tables_tool", "model_get_schema")
# workflow.add_edge("model_get_schema", "get_schema_tool")
# workflow.add_edge("get_schema_tool", "query_gen")
# workflow.add_conditional_edges(
#     "query_gen",
#     should_continue,
# )
# workflow.add_edge("correct_query", "execute_query")
# workflow.add_edge("execute_query", "query_gen")

# # Compile the workflow into a runnable
# app1 = workflow.compile()


# ### to get the quary to the model


# def ai_chatbot_routing(app):
#     @traceable
#     @app.route('/sample_question', methods=['POST'])
#     def query_database():
#         try:
#             # Parse JSON input from the request
#             data = request.get_json()
#             print(data)
#             # if not data or 'question' not in data:
#             #     return jsonify({"error": "No query provided. Please include a 'query' field in the JSON body."}), 400

#             query = data['question']
#             print(query)
#             messages = app1.invoke(
#                 {"messages": [("user", query)]}
#             )
#             print(messages)
#             json_str = messages["messages"][-1].tool_calls[0]["args"]["final_answer"]

#             print("before the function")
#             for event in app1.stream(
#                 {"messages": [("user", query)]}
#             ):
#                 print(event)

#             print(json_str)
#             print(type(json_str))
#             # Invoke the agent to get the SQL query results

#             # Assuming the result is already in a structured JSON format, return it directly
#             return jsonify({"result": json_str})

#         except Exception as e:
#             # Catch any errors and return as JSON
#             return jsonify({"error": str(e)}), 500


