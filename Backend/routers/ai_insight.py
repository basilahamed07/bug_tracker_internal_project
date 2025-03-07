from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
from sqlalchemy import create_engine, distinct
from models import db, Project_name, Testers, Tester_name
from langchain_groq import ChatGroq
from langchain_core.messages import AnyMessage
import os
from dotenv import load_dotenv
from langgraph.graph import START, END, StateGraph
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict
from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus,Tester_name,Metrics,AgileDetails,SprintDetails,TestingType,StoryDetails
from langchain_core.prompts import ChatPromptTemplate
from datetime import datetime, timedelta
from sqlalchemy import func
from typing import Annotated

load_dotenv()
groq_api = os.getenv("groq_api_key")


llm = ChatGroq(temperature=0, groq_api_key=groq_api, model_name="llama-3.3-70b-versatile")

system = """
You will receive a set of detailed project information, including the project name, project details, tester names, metrics, sprint details, and more. Your task is to generate a concise summary of the project, 
following these steps:

1)Provide an overview of the project, including the project name and key details.
2)List the testers involved in the project, including their names and count.
3)List the metrics associated with the project and predict whether they are good or bad, along with a brief explanation.
4)Summarize the sprint details, including which sprints are involved and their key outcomes or goals.
5)Provide an overall prediction on the health or success of the project, based on the metrics and sprint details.

Make the summary clear and concise ans do not exist 100 words
"""

#defing the chatprompttenplate
prompt = ChatPromptTemplate.from_messages([
    ("system", system),
    ("human", "{userinput}")  # Use "human" or "user" for user input
])
llm_with_prompt = prompt | llm
class State(TypedDict):
  messages: Annotated[list[AnyMessage],add_messages]


#node define 
def llm_call(state: State):
    messages = state['messages']
    message = llm_with_prompt.invoke(messages)
    return {'messages': [message]}

# define the workflow

workflow = StateGraph(State)
workflow.add_node("llm_call", llm_call)
workflow.add_edge(START, "llm_call")
workflow.add_edge("llm_call", END)

llm_graph = workflow.compile()


def ai_insight_router(app):
    @app.route('/ai_insight', methods=['GET'])
    def ai_insight_route():
        
        ai_insight_data = {
            "summaryData": 
                """SixData is an advanced data visualization and analytics project aimed at helping businesses extract actionable insights from vast datasets. 
                By leveraging powerful tools like charts and tables, SixData presents clear, intuitive visualizations that assist decision-makers in tracking trends, 
                identifying patterns, and understanding complex datasets. The project utilizes modern technologies like React and Express.js for a seamless, responsive 
                experience, offering users detailed analytics in the form of pie charts, line graphs, and tabular data. SixData enables businesses to make informed decisions 
                backed by visualized data, ensuring better operational strategies and growth.""",
            "lineData": {
                "labels": [
                    "LeakDefact", "FaultPattern", "AnomalyTest", "LeakCheck", "ValidationStep", "DeviationMeasure", 
                    "TestDefect", "TrendAnalysis", "FailurePoint", "CriticalTest"
                ],
                "datasets": [
                    {
                        "label": "Collection 1",
                        "data": [120, 145, 132, 140, 150, 160, 170, 175, 180, 190],  # Data for Collection 1
                        "fill": True,
                        "borderColor": "rgb(75, 192, 192)",  # Line color
                        "backgroundColor": "rgba(75, 192, 192, 0.2)",  # Fill color under the line
                        "tension": 0.4,  # Smooth the curve
                    },
                    {
                        "label": "Collection 2",
                        "data": [90, 110, 115, 120, 125, 135, 145, 150, 155, 165],  # Data for Collection 2
                        "fill": True,
                        "borderColor": "rgb(255, 99, 132)",  # Line color
                        "backgroundColor": "rgba(255, 99, 132, 0.2)",  # Fill color under the line
                        "tension": 0.4,  # Smooth the curve
                    }
                ]
            },
            "pieData": {
                "labels": ["Section 1", "Section 2", "Section 3", "Section 4", "Section 5", "Section 6", "Section 7", "Section 8"],
                "datasets": [
                    {
                        "data": [50, 100, 80, 60, 90, 120, 70, 150],
                        "backgroundColor": [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 159, 64, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                        ],
                        "hoverOffset": 4,
                    },
                ],
            },
            "tableData": [
                {"project_name": "SixData", "rag_details": "Completed", "task_id": 101, "status": "Active", "manager": "Alice", "deadline": "2025-12-31", "priority": "High", "department": "Analytics", "client": "Company A"},
                {"project_name": "SixData", "rag_details": "In Progress", "task_id": 102, "status": "Pending", "manager": "Bob", "deadline": "2025-11-30", "priority": "Medium", "department": "Data Science", "client": "Company B"},
                {"project_name": "SixData", "rag_details": "Completed", "task_id": 103, "status": "Completed", "manager": "Charlie", "deadline": "2025-10-15", "priority": "Low", "department": "Operations", "client": "Company C"},
                {"project_name": "SixData", "rag_details": "In Progress", "task_id": 104, "status": "Active", "manager": "David", "deadline": "2025-09-20", "priority": "High", "department": "Business Intelligence", "client": "Company D"},
                {"project_name": "SixData", "rag_details": "On Hold", "task_id": 105, "status": "On Hold", "manager": "Eve", "deadline": "2025-08-25", "priority": "Low", "department": "Development", "client": "Company E"},
            ],
        }

        return jsonify(ai_insight_data)
    # @app.route('/ai_insight/<int:id>', methods=['GET'])
    # def ai_inside_summery(id):
    #     #get the all the values accoding to the project

    #     database_collection = [Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus,Metrics,AgileDetails,SprintDetails,TestingType]
    #     final_values = {}
    #     final_output = {}
    #     project_name = Project_name.query.filter_by(id=id).first().project_name
    #     final_output['project_name'] = project_name
    #     # Project_details = Project_details.query.filter_by(project_name_id=id).first()
    #     metrics = Metrics.query.filter_by(project_name_id=id).first()
    #     final_output['metrics'] = metrics.to_dict()
    #     testers = Testers.query.filter_by(project_name_id=id).all()
    #     final_output["testers_name"] = [tester.to_dict() for tester in testers]

    #     # Fetching SprintDetails based on project_name_id
    #     sprint_details = SprintDetails.query.filter_by(project_name_id=id).all()
    #     print(sprint_details)
    #     # Creating a list to store the data
    #     result = []

    #     # Iterating through the fetched sprint_details
    #     for sprint in sprint_details:
    #         print("inside the for looping")
    #         # Fetching associated story details for each sprint detail
    #         story_details = StoryDetails.query.filter_by(sprint_detail_id=sprint.id).all()

    #         # Create a list of story details using their to_dict() method
    #         story_list = [story.to_dict() for story in story_details]

    #         # Creating the dictionary for sprint details and including story details
    #         sprint_dict = sprint.to_dict()
    #         sprint_dict['story_details'] = story_list  # Add the story details list here

    #         # Add the sprint_dict to the result
    #         result.append(sprint_dict)
    #     final_output['sprint_details'] = result
    #     print(final_output["sprint_details"])
    #     # Now result will contain a list of dictionaries, where each dictionary represents a        sprint
    #     # and contains the sprint details along with its associated story details.


    #     # print(project_name)
    #     # for trash in database_collection:
    #     #     test = trash.query.filter_by(project_name_id=id).first()
    #     #     if test is not None:
    #     #         final_output[trash.__tablename__] = test.to_dict()
    #     # final_output['project_name'] = project_name.project_name

    #     # print(final_output)
    #     response = llm_graph.invoke({"messages": str(final_output)})
    #     print(response['messages'][-1].content)
    #     # print(response)
    #     return jsonify({"summary": response['messages'][-1].content})



    @app.route('/ai_insight/<int:id>', methods=['GET'])
    def ai_inside_summery(id):
        # Get the project name based on the provided id
        project_name = Project_name.query.filter_by(id=id).first().project_name
        final_output = {}
        matrix = {}
        final_output['project_name'] = project_name

        # Get the metrics data for the latest and previous month
        current_date = datetime.now().date()

        # Fetch the latest metric for the current month
        latest_metrics = Metrics.query.filter(Metrics.project_name_id == id, 
                                              Metrics.date <= current_date).order_by    (Metrics.date.desc()).first()

        # Fetch the metrics for the previous month by subtracting one month from the    current month
        previous_month_date = current_date.replace(day=1) - timedelta(days=1)  # Get the    last day of the previous month
        previous_month_start_date = previous_month_date.replace(day=1)  # Get the first     day of the previous month

        previous_metrics = Metrics.query.filter(Metrics.project_name_id == id,
                                                Metrics.date >= previous_month_start_date,
                                                Metrics.date <= previous_month_date).   order_by(Metrics.date.desc()).first()

        # Format the metrics data for both the latest and previous month
        if latest_metrics:
            matrix['latest_metrics'] = latest_metrics.to_dict()
        else:
            matrix['latest_metrics'] = None

        if previous_metrics:
            matrix['previous_month_metrics'] = previous_metrics.to_dict()
        else:
            matrix['previous_month_metrics'] = None

        # Fetch other data (like testers, sprint details, etc.)
        metrics = Metrics.query.filter_by(project_name_id=id).first()
        final_output['metrics'] = metrics.to_dict() if metrics else None

        testers = Testers.query.filter_by(project_name_id=id).all()
        final_output["testers_name"] = [tester.to_dict() for tester in testers]

        # Fetching SprintDetails based on project_name_id
        sprint_details = SprintDetails.query.filter_by(project_name_id=id).all()
        print(sprint_details)

        # Creating a list to store the data
        result = []

        # Iterating through the fetched sprint_details
        for sprint in sprint_details:
            print("inside the for loop")

            # Fetching associated story details for each sprint detail
            story_details = StoryDetails.query.filter_by(sprint_detail_id=sprint.id).all()

            # Create a list of story details using their to_dict() method
            story_list = [story.to_dict() for story in story_details]

            # Creating the dictionary for sprint details and including story details
            sprint_dict = sprint.to_dict()
            sprint_dict['story_details'] = story_list  # Add the story details list here

            # Add the sprint_dict to the result
            result.append(sprint_dict)
        print(matrix)

        final_output['sprint_details'] = result
        # print(final_output["sprint_details"])

        # Now result will contain a list of dictionaries, where each dictionary represents  a sprint
        # and contains the sprint details along with its associated story details.

        # Call the LLM graph with the collected data
        response = llm_graph.invoke({"messages": str(final_output)})
        # print(response['messages'][-1].content)

        # Return the response as JSON
        return jsonify({"summary": response['messages'][-1].content,"matrix":matrix})

        
       


        
    # This makes sure the endpoint '/ai_insight' is linked to the function ai_insight_route.
    app.add_url_rule('/ai_insight', view_func=ai_insight_route, methods=['GET'])
