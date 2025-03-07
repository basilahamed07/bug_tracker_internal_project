from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import date
from sqlalchemy import create_engine, distinct
from models import db, Project_name, Testers, Tester_name
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
from langgraph.graph import START, END, StateGraph
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict
from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus,Tester_name,Metrics,AgileDetails,SprintDetails,TestingType
from langchain_core.prompts import ChatPromptTemplate


load_dotenv()
groq_api = os.getenv("groq_api_key")


llm = ChatGroq(temperature=0, groq_api_key=groq_api, model_name="llama-3.3-70b-versatile")

system = "your giving the the summer for the project for 1 passage"

#defing the chatprompttenplate
pompt = ChatPromptTemplate.from_messages(["system", system,("placeholder", "{userinput}")])

llm_with_prompt = pompt | llm
class State(TypedDict):
    userinput: str

#node define 
def llm_call(state:State):
    return llm_with_prompt.invoke(state["userinput"])

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
    @app.route('/ai_insight/<int:id>', methods=['GET'])
    def ai_inside_summery(id):
        #get the all the values accoding to the project

        database_collection = [Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus,Metrics,AgileDetails,SprintDetails,TestingType]
        final_output = {}
        project_name = Project_name.query.filter_by(id=id).first()

        for trash in database_collection:
            test = trash.query.filter_by(project_name_id=id).first()
            if test is not None:
                final_output[trash.__tablename__] = test.to_dict()

        print(final_output)
        response = llm_graph.invoke({"userinput":"hello"})
        print(response.content)
        return jsonify(response.content)
        
       


        
    # This makes sure the endpoint '/ai_insight' is linked to the function ai_insight_route.
    app.add_url_rule('/ai_insight', view_func=ai_insight_route, methods=['GET'])
