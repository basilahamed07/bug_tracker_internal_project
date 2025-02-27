
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langchain_community.agent_toolkits import create_sql_agent
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotPromptTemplate,
    MessagesPlaceholder,
    PromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_community.vectorstores import FAISS
from langsmith import traceable
from sqlalchemy import create_engine
from dotenv import load_dotenv
from langchain.agents import Tool
import os

# Load environment variables
load_dotenv()

# Validate required environment variables
REQUIRED_ENV_VARS = {
    "LANGCHAIN_API_KEY": "LangChain API key",
    "DATABASE_URL": "Database URL",
    "GOOGLE_API_KEY": "Google API key",
    "GROQ_API_KEY": "Groq API key"
}

missing_vars = {var: desc for var, desc in REQUIRED_ENV_VARS.items() 
               if not os.getenv(var)}
if missing_vars:
    raise ValueError(
        "Missing required environment variables:\n" + 
        "\n".join(f"- {var}: {desc}" for var, desc in missing_vars.items())
    )

# Configure LangChain
os.environ.update({
    'LANGCHAIN_TRACING_V2': 'true',
    'LANGCHAIN_ENDPOINT': "https://api.smith.langchain.com",
    'LANGCHAIN_API_KEY': os.getenv("LANGCHAIN_API_KEY"),
    'LANGCHAIN_PROJECT': "internal_project"
})

def setup_database():
    """Initialize database connection"""
    try:
        engine = create_engine(os.getenv("DATABASE_URL"))
        with engine.connect() as connection:
            print("Database connection successful!")
        return SQLDatabase.from_uri(os.getenv("DATABASE_URL"))
    except Exception as e:
        raise ConnectionError(f"Failed to connect to database: {str(e)}")

def create_table_column_tool(llm):
    """Create custom tool for table/column decision making"""
    def decide_table_column(query: str) -> str:
        with open(r"D:\SIX-DATA\internal_project_sajiv\Backend_flask\ai_for_database\table_column_description.txt", 'r') as file:
            schema_desc = file.read()
            
        template = """
        Based on the user query: "{query}", determine the appropriate table names 
        and column names for database querying.
        
        Consider:
        1. Select only necessary tables and columns
        2. Identify required table joins
        3. Apply appropriate filters
        
        Schema description:
        {schema_desc}
        """
        
        prompt = ChatPromptTemplate.from_template(template).invoke({
            "query": query, 
            "schema_desc": schema_desc
        })
        return llm.invoke(prompt).content
    
    return Tool(
        name="decide_table_column",
        func=decide_table_column,
        description="Determines optimal tables, columns and joins for query execution"
    )

def create_prompt_template():
    """Create the complete prompt template with system message and examples"""
    # Define system message
    system_message = """
    and if user ask any generic question mean like hello or hi mean response is "Hello! How can I help you today?"
    
    You are an SQL expert assistant. Your role is to:
    1. Understand user queries about the database
    2. Generate appropriate SQL queries
    3. Execute queries safely and efficiently
    4. Return results in a clear format
    
    When generating SQL:
    - Select only necessary columns
    - Use appropriate table joins
    - Apply proper filtering
    - Follow security best practices
    - Avoid any destructive operations
    """

    # Define examples
    examples = [
        {
            "input": "Show all users with their projects",
            "query": """
                SELECT u.id, u.name, p.project_name 
                FROM users u
                LEFT JOIN project_name p ON u.id = p.user_id
            """
        },
        {
            "input": "Get testers assigned to project 'Alpha'",
            "query": """
                SELECT t.id, tn.name 
                FROM testers t
                JOIN tester_name tn ON t.tester_name_id = tn.id
                JOIN project_name p ON t.project_id = p.id
                WHERE p.project_name = 'Alpha'
            """
        }
    ]

    # Create embeddings and example selector
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    example_selector = SemanticSimilarityExampleSelector.from_examples(
        examples,
        embeddings,
        FAISS,
        k=2
    )

    # Create few-shot template
    few_shot = FewShotPromptTemplate(
        example_selector=example_selector,
        example_prompt=PromptTemplate.from_template(
            "User: {input}\nAssistant: Let me help you with that SQL query:\n{query}\n"
        ),
        prefix=system_message,
        suffix="User: {input}\nAssistant: Let me help you with that.",
        input_variables=["input"]
    )

    # Create final chat template
    return ChatPromptTemplate.from_messages([
        ("system", system_message),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad")
    ])

def setup_agent(db, llm):
    """Initialize the SQL agent with all components"""
    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    custom_tool = create_table_column_tool(llm)
    prompt = create_prompt_template()
    
    return create_sql_agent(
        llm=llm,
        toolkit=toolkit,
        extra_tools=[custom_tool],
        prompt=prompt,
        verbose=True,
        agent_type="openai-tools",
        handle_parsing_errors=True
    )

def ai_chatbot_routing(app):
    """Route for AI chatbot"""
    # Initialize components once at startup
    db = setup_database()
    llm = ChatGroq(
        temperature=0,
        groq_api_key=os.getenv("GROQ_API_KEY"),
        model_name="llama-3.3-70b-versatile"
    )
    agent = setup_agent(db, llm)
    
    @app.route('/sample_question', methods=['POST'])
    @traceable
    def query_database():
        try:
            data = request.get_json()
            if not data or 'question' not in data:
                return jsonify({
                    "error": "Missing required field 'question' in request body"
                }), 400
                
            result = agent.invoke({
                "input": data['question'],
                "chat_history": [],  # Add chat history if needed
                "agent_scratchpad": []  # Initialize empty scratchpad
            })
            return jsonify({"result": result})
            
        except Exception as e:
            return jsonify({
                "error": str(e),
                "type": type(e).__name__
            }), 500
    
    return app