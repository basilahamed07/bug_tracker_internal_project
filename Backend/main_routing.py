# in this file handling the router file here (like api handling)


from routers.billable_details_route import billable_details_route
from routers.project_details_route import project_details_route
from routers.test_details_route import test_details_route
from routers.router import register_router
from routers.view_matric import test_matric_routing
from pdf_report_generatot.pdf_report_api import pdf_router
from routers.Total_defect_api import total_defect_api
# from ai_for_database.ai_database_sqltoolkit import ai_chatbot_routing
from routers.view_matrix_input import view_matrix_input_route
from routers.ai_insight import ai_insight_router
from routers.agileapi import agile_details
from routers.SprintDetails import sprint_api
from routers.nonagile import non_agile


def all_router(app):
    billable_details_route(app)
    project_details_route(app)
    test_details_route(app)
    register_router(app)
    test_matric_routing(app)
    pdf_router(app)
    total_defect_api(app)
    # ai_chatbot_routing(app)
    view_matrix_input_route(app)
    ai_insight_router(app)
    agile_details(app)
    sprint_api(app)
    non_agile(app)



