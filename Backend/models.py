#here we have the model (databse structur)
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import ARRAY
db = SQLAlchemy()
from sqlalchemy import types
from sqlalchemy.ext.mutable import MutableDict
# For user table
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(700), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='TestLead')

    def to_dict(self):
        return {
            'user_id': self.id,
            'username': self.username,
            'password': self.password,
            'role': self.role
        }
# Project_name model
class Project_name(db.Model):
    __tablename__ = 'project_name'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_name = db.Column(db.String(100), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="project_names")

    # Define the relationship with Project_details
    project_details = db.relationship("Project_details", backref="related_project_name", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'project_name': self.project_name,
            "user_id": self.user_id
        }

# Project_details model
class Project_details(db.Model):
    __tablename__ = 'project_details'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    rag = db.Column(db.String(100), nullable=False)
    tester_count = db.Column(db.Integer, nullable=False)
    billable = db.Column(db.ARRAY(db.Integer), nullable=False)
    nonbillable = db.Column(db.ARRAY(db.Integer), nullable=False)
    billing_type = db.Column(db.String(100), nullable=False)
    automation = db.Column(db.String(100), nullable=False, default="Nil")
    ai_used = db.Column(db.String(100), nullable=False, default="Nil")
    rag_details = db.Column(db.String(100), nullable=False, default="Nil")
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    agile = db.Column(db.Boolean, nullable=True)

    # Define the relationship to Project_name without delete-orphan
    project_name = db.relationship("Project_name", backref="project_details_list")
    user = db.relationship("Users", backref="project_details")

    def to_dict(self):
        return {
            'id': self.id,
            'project_name_id': self.project_name_id,
            'rag': self.rag,
            'tester_count': self.tester_count,
            'billable': self.billable,
            'nonbillable': self.nonbillable,
            'billing_type': self.billing_type,
            'automation': self.automation,
            'ai_used': self.ai_used,
            'rag_details': self.rag_details,
            "user_id": self.user_id,
            'agile': self.agile
        }
    
class Testers(db.Model):
    __tablename__ = 'testers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # tester_name = db.Column(db.String(100), nullable=False, unique=False)
    billable = db.Column(db.Boolean, nullable=True, default=False)
    tester_name_id = db.Column(db.Integer, db.ForeignKey("tester_name.id"), nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="testers")
    # Relationship with Project_name
    project_name = db.relationship("Project_name", backref="testers")
    tester_name = db.relationship("Tester_name", backref="testers")

        
    def to_dict(self):
        return {
            'id': self.id,
            'tester_name': self.tester_name.tester_name,
            'billable': self.billable,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }
    

#new testername

class Tester_name(db.Model):
    __tablename__ = 'tester_name'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tester_name = db.Column(db.String(100), nullable=False, unique=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("Users", backref="tester_name")
      
    def to_dict(self):
        return {
            'id': self.id,
            'tester_name': self.tester_name,
            "user_id": self.user_id
        }
    
# For new defects table
class New_defects(db.Model):
    __tablename__ = 'new_defects'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    month = db.Column(db.String(100), nullable=False)
    regression_defect = db.Column(db.Integer, nullable=False)
    functional_defect = db.Column(db.Integer, nullable=False)
    defect_reopened = db.Column(db.Integer, nullable=False)
    uat_defect = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="New_defects")

    # Relationship
    project_name = db.relationship("Project_name", backref="new_defects")

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date,
            'month': self.month,
            'regression_defect': self.regression_defect,
            'functional_defect': self.functional_defect,
            'defect_reopened': self.defect_reopened,
            'uat_defect': self.uat_defect,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }

# For test execution status table
class Test_execution_status(db.Model):
    __tablename__ = 'test_execution_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_execution = db.Column(db.Integer, nullable=False)
    tc_execution = db.Column(db.Integer, nullable=False)
    pass_count = db.Column(db.Integer, nullable=False)
    fail_count = db.Column(db.Integer, nullable=False)
    no_run = db.Column(db.Integer, nullable=False)
    blocked = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="Test_execution_status")

    # Relationship
    project_name = db.relationship("Project_name", backref="test_execution_status")

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'pass_count': self.pass_count,
            'fail_count': self.fail_count,
            'no_run': self.no_run,
            'blocked': self.blocked,
            'project_name_id': self.project_name_id,
            'date': self.date,
            'total_execution': self.total_execution,
            'tc_execution': self.tc_execution,
            "user_id": self.user_id
        }

# For total defect status table
class Total_Defect_Status(db.Model):
    __tablename__ = 'total_defect_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_defect = db.Column(db.Integer, nullable=False)
    defect_closed = db.Column(db.Integer, nullable=False)
    open_defect = db.Column(db.Integer, nullable=False)
    critical = db.Column(db.Integer, nullable=False)
    high = db.Column(db.Integer, nullable=False)
    medium = db.Column(db.Integer, nullable=False)
    low = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="Total_Defect_Status")

    # Relationship
    project_name = db.relationship("Project_name", backref="total_defect_status")

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'total_defect': self.total_defect,
            'defect_closed': self.defect_closed,
            'open_defect': self.open_defect,
            'critical': self.critical,
            'high': self.high,
            'medium': self.medium,
            'low': self.low,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }

# Build status table
class BuildStatus(db.Model):
    __tablename__ = 'build_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_build_received = db.Column(db.Integer, nullable=False)
    builds_accepted = db.Column(db.Integer, nullable=False)
    builds_rejected = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="BuildStatus")


    # Relationship with the Project_name table
    project = db.relationship('Project_name', backref='build_status')

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'total_build_received': self.total_build_received,
            'builds_accepted': self.builds_accepted,
            'builds_rejected': self.builds_rejected,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }

# Defect accepted vs rejected table
class DefectAcceptedRejected(db.Model):
    __tablename__ = 'defect_accepted_rejected'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_defects = db.Column(db.Integer, nullable=False)
    dev_team_accepted = db.Column(db.Integer, nullable=False)
    dev_team_rejected = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="DefectAcceptedRejected")

    # Relationship with the Project_name table
    project = db.relationship('Project_name', backref='defect_accepted_rejected')

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'total_defects': self.total_defects,
            'dev_team_accepted': self.dev_team_accepted,
            'dev_team_rejected': self.dev_team_rejected,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }

# Test case creation status table
class TestCaseCreationStatus(db.Model):
    __tablename__ = 'test_case_creation_status'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    total_test_case_created = db.Column(db.Integer, nullable=False)
    test_case_approved = db.Column(db.Integer, nullable=False)
    test_case_rejected = db.Column(db.Integer, nullable=False)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="TestCaseCreationStatus")

    # Relationship with the Project_name table
    project = db.relationship('Project_name', backref='test_case_creation_status')

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'total_test_case_created': self.total_test_case_created,
            'test_case_approved': self.test_case_approved,
            'test_case_rejected': self.test_case_rejected,
            'project_name_id': self.project_name_id,
            "user_id": self.user_id
        }



class Metrics(db.Model):
    __tablename__ = 'metrics'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    month = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)

    defectleakage = db.Column(db.Float, nullable=False)  # Corrected here
    defectdensity = db.Column(db.Float, nullable=False)  # Corrected here
    defectremovalefficiency = db.Column(db.Float, nullable=False)  # Corrected here
    automationcoverage = db.Column(db.Float, nullable=False)  # Corrected here
    testcasesefficiency = db.Column(db.Float, nullable=True)  # Corrected here
    testerproductivity = db.Column(db.Float, nullable=False)  # Corrected here
    defectseverityindex = db.Column(db.Float, nullable=False)  # Corrected here
    defectfixrate = db.Column(db.Float, nullable=False)  # Corrected here
    defectrejectionratio = db.Column(db.Float, nullable=False)  # Corrected here
    meantimetofinddefect = db.Column(db.Float, nullable=False)  # Corrected here
    meantimetorepair = db.Column(db.Float, nullable=False)  # Corrected here

    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="metrics")

    project = db.relationship('Project_name', backref='metrics')

    def to_dict(self):
        return {
            'id': self.id,
            'month': self.month,
            'date': self.date,
            'defectleakage': self.defectleakage,
            'defectdensity': self.defectdensity,
            'defectremovalefficiency': self.defectremovalefficiency,
            'automationcoverage': self.automationcoverage,
            'testcasesefficiency': self.testcasesefficiency,
            'testerproductivity': self.testerproductivity,
            'defectseverityindex': self.defectseverityindex,
            'defectfixrate': self.defectfixrate,
            'defectrejectionratio': self.defectrejectionratio,
            'meantimetofinddefect': self.meantimetofinddefect,
            'meantimetorepair': self.meantimetorepair,
            'project_name_id': self.project_name_id,
            'user_id': self.user_id
        }
from sqlalchemy.orm import foreign


class AgileDetails(db.Model):
    __tablename__ = 'agile_details'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    current_data = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Remove the unique constraint from scream_name
    scream_name = db.Column(db.String(100), nullable=False)  # unique=False (default behavior)
    
    tester_name_id = db.Column(db.Integer, db.ForeignKey("testers.id"), nullable=False)
    tester_name = db.relationship("Testers", backref="agile_details")  # Use Testers instead of Tester_name

    total_experience = db.Column(db.Float, nullable=False)
    cpt_experience_start_date = db.Column(db.DateTime, nullable=False)
    total = db.Column(db.Float, nullable=False)
    skillset = db.Column(ARRAY(db.String), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="agile_details")

    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    project_name = db.relationship("Project_name", backref="agile_details")

    def to_dict(self):
        return {
            'id': self.id,
            'current_data': self.current_data.isoformat(),
            'scream_name': self.scream_name,
            'tester_name': self.tester_name.tester_name.tester_name,  # Access tester_name from Testers model
            'total_experience': self.total_experience,
            'cpt_experience_start_date': self.cpt_experience_start_date.isoformat(),
            'total': self.total,
            'skillset': self.skillset,
            'user_id': self.user_id,
            'project_name': self.project_name.project_name if self.project_name else None
        }


# new code for ajesting the logics 
class SprintDetails(db.Model):
    __tablename__ = 'sprint_details'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    story_committed = db.Column(db.Integer, nullable=False)
    story_completed = db.Column(db.Integer, nullable=False)
    story_points_committed = db.Column(db.Integer, nullable=False)
    story_points_completed = db.Column(db.Integer, nullable=False)
    
    # Defect severities
    defect_open_critical = db.Column(db.Integer, default=0)
    defect_open_high = db.Column(db.Integer, default=0)
    defect_open_medium = db.Column(db.Integer, default=0)
    defect_open_low = db.Column(db.Integer, default=0)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("Users", backref="sprint_details")
    
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)
    project_name = db.relationship("Project_name", backref="sprint_details", foreign_keys=[project_name_id])

    # Replacing sprint_id with agile_id and referencing the AgileDetails table
    agile_id = db.Column(db.Integer, db.ForeignKey("agile_details.id"), nullable=False)
    agile = db.relationship("AgileDetails", backref="sprint_details")

    # Adding start_date and end_date columns
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)

    # Fix: Change sprint_name from Integer to String to store text values
    sprint_name = db.Column(db.String(200), nullable=False)
    PI_name = db.Column(db.String(200), nullable=True)
    def to_dict(self):
        return {
            'id': self.id,
            'story_committed': self.story_committed,
            'story_completed': self.story_completed,
            'story_points_committed': self.story_points_committed,
            'story_points_completed': self.story_points_completed,
            'defect_open_critical': self.defect_open_critical,
            'defect_open_high': self.defect_open_high,
            'defect_open_medium': self.defect_open_medium,
            'defect_open_low': self.defect_open_low,
            'user_id': self.user_id,
            'project_name_id': self.project_name_id,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'sprint_name': self.sprint_name,
            "PI_name": self.PI_name
        }


class StoryDetails(db.Model):
    __tablename__ = 'story_details'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    story_name = db.Column(db.String(200), nullable=False)
    story_point = db.Column(db.Integer, nullable=False)
    story_consumed = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(50), nullable=False, default="Incomplete")
    completed_percentage = db.Column(db.Float, nullable=False)
    manual_or_automation = db.Column(db.String(50), nullable=False, default="manual")
    target_date = db.Column(db.Date, nullable=True)
    actual_hour = db.Column(db.Integer, nullable=True, default=0)  # Integer format
    estimated_hour = db.Column(db.Integer, nullable=True, default=0)  # Integer format

    
    # Foreign key to link StoryDetails to Testers table
    tester_name_id = db.Column(db.Integer, db.ForeignKey("testers.id"), nullable=False)
    
    # Add foreign_keys argument to specify which foreign key to use
    tester_name = db.relationship("Testers", backref="story_details", foreign_keys=[tester_name_id])

    # Relationship to SprintDetails (Making sprint_detail_id NOT NULL)
    sprint_detail_id = db.Column(db.Integer, db.ForeignKey("sprint_details.id"), nullable=True)  # Set to nullable=False to enforce relationship
    
    # Use a unique backref name to avoid conflict
    sprint_detail = db.relationship("SprintDetails", backref="story_details_ref", foreign_keys=[sprint_detail_id])

    def to_dict(self):
        return {
            'id': self.id,
            'story_name': self.story_name,
            'story_point': self.story_point,
            'status': self.status,
            'tester_name': self.tester_name.tester_name.tester_name,
            'Story_consumed': self.story_consumed,
            'completed_percentage': self.completed_percentage,
            'manual_or_automation': self.manual_or_automation,
            "tester_id":self.tester_name_id,
            "target_date":self.target_date,
            "actual_hour":self.actual_hour,
            "estimated_hour":self.estimated_hour
        }



class TestingType(db.Model):
    __tablename__ = 'testing_type'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    total_testcase = db.Column(db.Integer, nullable=False)
    tcexecution = db.Column(db.Integer, nullable=False)
    passed = db.Column(db.Integer, nullable=False)
    fail = db.Column(db.Integer, nullable=False)
    opendefact = db.Column(db.String(100), nullable=False)
    type_of_testing = db.Column(db.String(50), nullable=False)
    
    # Reference the correct table name 'project_name' (lowercase)
    project_name_id = db.Column(db.Integer, db.ForeignKey("project_name.id"), nullable=False)  # Corrected here
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    project_name = db.relationship("Project_name", backref="testing_type")  # No cascade delete now
    user = db.relationship("Users", backref="testing_type")

    def to_dict(self):
        return {
            'id': self.id,
            'total_testcase': self.total_testcase,
            'tcexecution': self.tcexecution,
            'passed': self.passed,
            'fail': self.fail,
            'opendefact': self.opendefact,
            'type_of_testing': self.type_of_testing,
            'project_name_id': self.project_name_id,
            'user_id': self.user_id
        }