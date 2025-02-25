# from langchain_community.utilities import SQLDatabase
# # for connection of database
# db = SQLDatabase.from_uri("postgresql://postgres:database@localhost/internal_project")
# # print(db.dialect)
# # print(db.get_usable_table_names())
# # print(db.run("SELECT * FROM project_name LIMIT 1;"))



# # #for proper type of output
# # from typing_extensions import TypedDict


# # class State(TypedDict):
# #     question: str
# #     query: str
# #     result: str
# #     answer: str

# import getpass
# import os



# #for get the llm to exicute the code
# if not os.environ.get("GROQ_API_KEY"):
#     os.environ["GROQ_API_KEY"] = "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"

# from langchain_groq import ChatGroq

# llm = ChatGroq(model="llama3-8b-8192")

# # from langchain_community.tools.sql_database.tool import QuerySQLDatabaseTool

# # def generate_answer(state: State):
# #     """Answer question using retrieved information as context."""
# #     prompt = (
# #         "Given the following user question, corresponding SQL query, "
# #         "and SQL result, answer the user question.\n\n"
# #         f'Question: {state["question"]}\n'
# #         f'SQL Query: {state["query"]}\n'
# #         f'SQL Result: {state["result"]}'
# #     )
# #     response = llm.invoke(prompt)
# #     return {"answer": response.content}



# # def execute_query(state: State):
# #     """Execute SQL query."""
# #     execute_query_tool = QuerySQLDatabaseTool(db=db)
# #     print(execute_query_tool.invoke(state["query"]))
# #     return {"result": execute_query_tool.invoke(state["query"])}

# # #this was for prompot for sql
# # from langchain import hub

# # query_prompt_template = hub.pull("langchain-ai/sql-query-system-prompt")

# # assert len(query_prompt_template.messages) == 1
# # query_prompt_template.messages[0].pretty_print()

# # from typing_extensions import Annotated


# # class QueryOutput(TypedDict):
# #     """Generated SQL query."""

# #     query: Annotated[str, ..., "Syntactically valid SQL query."]


# # def write_query(state: State):
# #     """Generate SQL query to fetch information."""
# #     prompt = query_prompt_template.invoke(
# #         {
# #             "dialect": db.dialect,
# #             "top_k": 10,
# #             "table_info": db.get_table_info(),
# #             "input": state["question"],
# #         }
# #     )
# #     structured_llm = llm.with_structured_output(QueryOutput)
# #     result = structured_llm.invoke(prompt)
# #     (execute_query({"query": result["query"]}))
# #     return {"query": result["query"]}


# # print(write_query({"question": "how many project_name are there?"}))










# from langchain_community.agent_toolkits import SQLDatabaseToolkit

# toolkit = SQLDatabaseToolkit(db=db, llm=llm)

# tools = toolkit.get_tools()

# # print(tools)



# # from langchain.schema.runnable import RunnableSequence
# # from langchain.schema.runnable import RunnableBinding
# # from langchain.chat_models.openai import ChatOpenAI
# # from langchain_core.prompts import ChatPromptTemplate

# # prompt_template = RunnableSequence(
# #   last=RunnableBinding(
# #       bound=ChatGroq(
# #     model="mixtral-8x7b-32768"),
# #     kwargs={},
# #   ),
# #   first=ChatPromptTemplate.from_messages([
# #     ("system", """You are an agent designed to interact with a SQL database.
# # Given an input question, create a syntactically correct {dialect} query to run, then look at the results of the query and return the answer.
# # Unless the user specifies a specific number of examples they wish to obtain, always limit your query to at most {top_k} results.
# # You can order the results by a relevant column to return the most interesting examples in the database.
# # Never query for all the columns from a specific table, only ask for the relevant columns given the question.
# # You have access to tools for interacting with the database.
# # Only use the below tools. Only use the information returned by the below tools to construct your final answer.
# # You MUST double check your query before executing it. If you get an error while executing a query, rewrite the query and try again.

# # DO NOT make any DML statements (INSERT, UPDATE, DELETE, DROP etc.) to the database.

# # To start you should ALWAYS look at the tables in the database to see what you can query.
# # Do NOT skip this step.
# # Then you should query the schema of the most relevant tables.
     
# # To start you should ALWAYS look at the tables in the database to see what you can query.
# # The available tables in the database are:
# # - 'Users'
# # - 'project_name'
# # - 'project_details'
# # - 'testers'
# # - 'Tester_name'
# # - 'new_defects'

# # If the user asks for **project name**, you should query the **'project_name'** table.
# # If the user asks for **project details**, you should query the **'project_details'** table.
# # If the user asks about **testers** or **Tester names**, you should query the **'testers'** or **'Tester_name'** table accordingly.

# # DO NOT skip this step.     

# #      """),
# #   ]),
# # )


# # print(prompt_template)







# from langchain import hub

# # Pull original template from the hub
# prompt_template = hub.pull("langchain-ai/sql-agent-system-prompt")

# # Define new templates you want to add
# new_templates = """

# Do NOT skip this step.
# Then you should query the schema of the most relevant tables.
     
# To start you should ALWAYS look at the tables in the database to see what you can query.
# The available tables in the database are:
# - 'Users'
# - 'project_name'
# - 'project_details'
# - 'testers'
# - 'Tester_name'
# - 'new_defects'

# If the user asks for **project name**, you should query the **'project_name'** table.
# If the user asks for **project details**, you should query the **'project_details'** table.
# If the user asks about **testers** or **Tester names**, you should query the **'testers'** or **'Tester_name'** table accordingly.

# DO NOT skip this step.  

# """



# new_templates = """
# and responde are like answer and dont give like (those coluere are present , if ressult have list type mean give the length of the list like that)
 
# and if i am give the project name like sixdata mean give the all are lowercase only dont uppercase for search
# The available tables in the database are:
# - 'Users'
# - 'project_name'
# - 'project_details'
# - 'testers'
# - 'Tester_name'
# - 'new_defects'
# - 'metrics'

# If the user asks for **project name**, you should query the **'project_name'** table.
# If the user asks for **project details**, you should query the **'project_details'** table.
# If the user asks about **testers** or **Tester names**, you should query the **'testers'** or **'Tester_name'** table accordingly.
# If the user asks for **new defects**, you should query the **'new_defects'** table.
# If the user asks for **metrics**, you should query the **'metrics'** table.

# ### SQL Query Template for Current and Previous Month Data:

# - For **project name** (to get the project details based on project name):
#     ```sql
#     SELECT id, project_name, user_id
#     FROM project_name
#     WHERE project_name LIKE '%project_name%';
#     ```

# - For **current and previous month details** (using the **metrics** table, for a specific project):
#     ```sql
#     -- Current month data for the specific project
#     SELECT id, month, date, defectleakage, defectdensity, defectremovalefficiency, 
#            automationcoverage, testcasesefficiency, testerproductivity, defectseverityindex, 
#            defectfixrate, defectrejectionratio, meantimetofinddefect, meantimetorepair, 
#            project_name_id, user_id
#     FROM metrics
#     WHERE project_name_id = project_name_id
#     AND month = 'current_month';
#     ```

#     ```sql
#     -- Previous month data for the specific project
#     SELECT id, month, date, defectleakage, defectdensity, defectremovalefficiency, 
#            automationcoverage, testcasesefficiency, testerproductivity, defectseverityindex, 
#            defectfixrate, defectrejectionratio, meantimetofinddefect, meantimetorepair, 
#            project_name_id, user_id
#     FROM metrics
#     WHERE project_name_id = project_name_id
#     AND month = 'previous_month';
#     ```

# ### Example SQL Queries Based on User's Request for Current and Previous Month Data:

# 1. **Get the current and previous month metrics for a project (e.g., project_name = 'Project ABC')**:
#     ```sql
#     -- Get the project ID for 'Project ABC'
#     SELECT id FROM project_name WHERE project_name LIKE '%Project ABC%';

#     -- Assume project ID returned is 2, and current month is 'January' and previous month is 'December'.
    
#     -- Current month metrics for project 2 (January)
#     SELECT id, month, date, defectleakage, defectdensity, defectremovalefficiency, 
#            automationcoverage, testcasesefficiency, testerproductivity, defectseverityindex, 
#            defectfixrate, defectrejectionratio, meantimetofinddefect, meantimetorepair, 
#            user_id
#     FROM metrics
#     WHERE project_name_id = 2 AND month = 'January';

#     -- Previous month metrics for project 2 (December)
#     SELECT id, month, date, defectleakage, defectdensity, defectremovalefficiency, 
#            automationcoverage, testcasesefficiency, testerproductivity, defectseverityindex, 
#            defectfixrate, defectrejectionratio, meantimetofinddefect, meantimetorepair, 
#            user_id
#     FROM metrics
#     WHERE project_name_id = 2 AND month = 'December';
#     ```

# 2. **Get the current and previous month metrics for a project (e.g., project_name = 'Project XYZ')**:
#     ```sql
#     -- Get the project ID for 'Project XYZ'
#     SELECT id FROM project_name WHERE project_name LIKE '%Project XYZ%';

#     -- Assume project ID returned is 3, and current month is 'February' and previous month is 'January'.
    
#     -- Current month metrics for project 3 (February)
#     SELECT id, month, date, defectleakage, defectdensity, defectremovalefficiency, 
#            automationcoverage, testcasesefficiency, testerproductivity, defectseverityindex, 
#            defectfixrate, defectrejectionratio, meantimetofinddefect, meantimetorepair, 
#            user_id
#     FROM metrics
#     WHERE project_name_id = 3 AND month = 'February';

#     -- Previous month metrics for project 3 (January)
#     SELECT id, month, date, defectleakage, defectdensity, defectremovalefficiency, 
#            automationcoverage, testcasesefficiency, testerproductivity, defectseverityindex, 
#            defectfixrate, defectrejectionratio, meantimetofinddefect, meantimetorepair, 
#            user_id
#     FROM metrics
#     WHERE project_name_id = 3 AND month = 'January';
#     ```

# ### Instructions for Query Generation:

# 1. **For "project name" queries**:
#    - Use the `project_name` table to get the project ID based on a **project name** (e.g., 'Project ABC').
#    - This ID will be used in subsequent queries for the metrics.

# 2. **For "metrics" queries**:
#    - Query the **metrics** table for the **current month** and the **previous month** using the **project ID** and **month**.
#    - The `current_month` and `previous_month` can be dynamically determined based on the current date, or the user can specify them.

# 3. **For "previous month" data**:
#    - Subtract one month from the `current_month` to get the `previous_month`.
#    - For example, if the current month is `January`, the previous month would be `December`.

# ### Example Use Case:

# **User asks for the current and previous month's metrics for 'Project ABC'**:
# 1. Query the **project_name** table to get the project ID for 'Project ABC'.
# 2. Use the **metrics** table to fetch the current and previous month's data for that project ID, dynamically determining the months based on the current date.

# ---

# This template allows for querying both the **current** and **previous** month's details for a specific project, ensuring that the system can return relevant data for the user


# .



# """

# # Combine the original template with the new templates
# prompt_template = prompt_template + new_templates

# # Optionally push back to the hub if you want to save it
# # hub.push("langchain-ai/sql-agent-system-prompt", extended_prompt_template)

# # Use the extended prompt template for further operations
# print(prompt_template.pretty_print())



# system_message = prompt_template.format(dialect="postgresql", top_k=5)

# from langchain_core.messages import HumanMessage
# from langgraph.prebuilt import create_react_agent

# agent_executor = create_react_agent(llm, tools, state_modifier=system_message)


# question = "give summery of the project detail of wise ?"

# for step in agent_executor.stream(
#     {"messages": [{"role": "user", "content": question}]},
#     stream_mode="values",
# ):
#     step["messages"][-1].pretty_print()



# #  Remember to include the following SECRETS:
# #  - OPENAI_API_KEY






