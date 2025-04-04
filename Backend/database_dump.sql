-- Create tables in the correct order to handle foreign key dependencies

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(700) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'TestLead'
);

-- Project_name table
CREATE TABLE project_name (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Project_details table
CREATE TABLE project_details (
    id SERIAL PRIMARY KEY,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    rag VARCHAR(100) NOT NULL,
    tester_count INTEGER NOT NULL,
    billable INTEGER[] NOT NULL,
    nonbillable INTEGER[] NOT NULL,
    billing_type VARCHAR(100) NOT NULL,
    automation VARCHAR(100) NOT NULL DEFAULT 'Nil',
    ai_used VARCHAR(100) NOT NULL DEFAULT 'Nil',
    rag_details VARCHAR(100) NOT NULL DEFAULT 'Nil',
    user_id INTEGER NOT NULL REFERENCES users(id),
    agile BOOLEAN
);

-- Tester_name table
CREATE TABLE tester_name (
    id SERIAL PRIMARY KEY,
    tester_name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Testers table
CREATE TABLE testers (
    id SERIAL PRIMARY KEY,
    billable BOOLEAN DEFAULT FALSE,
    tester_name_id INTEGER NOT NULL REFERENCES tester_name(id),
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- New_defects table
CREATE TABLE new_defects (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    month VARCHAR(100) NOT NULL,
    regression_defect INTEGER NOT NULL,
    functional_defect INTEGER NOT NULL,
    defect_reopened INTEGER NOT NULL,
    uat_defect INTEGER NOT NULL,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Test_execution_status table
CREATE TABLE test_execution_status (
    id SERIAL PRIMARY KEY,
    month VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    total_execution INTEGER NOT NULL,
    tc_execution INTEGER NOT NULL,
    pass_count INTEGER NOT NULL,
    fail_count INTEGER NOT NULL,
    no_run INTEGER NOT NULL,
    blocked INTEGER NOT NULL,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Total_defect_status table
CREATE TABLE total_defect_status (
    id SERIAL PRIMARY KEY,
    month VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    total_defect INTEGER NOT NULL,
    defect_closed INTEGER NOT NULL,
    open_defect INTEGER NOT NULL,
    critical INTEGER NOT NULL,
    high INTEGER NOT NULL,
    medium INTEGER NOT NULL,
    low INTEGER NOT NULL,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Build_status table
CREATE TABLE build_status (
    id SERIAL PRIMARY KEY,
    month VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    total_build_received INTEGER NOT NULL,
    builds_accepted INTEGER NOT NULL,
    builds_rejected INTEGER NOT NULL,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Defect_accepted_rejected table
CREATE TABLE defect_accepted_rejected (
    id SERIAL PRIMARY KEY,
    month VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    total_defects INTEGER NOT NULL,
    dev_team_accepted INTEGER NOT NULL,
    dev_team_rejected INTEGER NOT NULL,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Test_case_creation_status table
CREATE TABLE test_case_creation_status (
    id SERIAL PRIMARY KEY,
    month VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    total_test_case_created INTEGER NOT NULL,
    test_case_approved INTEGER NOT NULL,
    test_case_rejected INTEGER NOT NULL,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Metrics table
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    month VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    defectleakage FLOAT NOT NULL,
    defectdensity FLOAT NOT NULL,
    defectremovalefficiency FLOAT NOT NULL,
    automationcoverage FLOAT NOT NULL,
    testcasesefficiency FLOAT,
    testerproductivity FLOAT NOT NULL,
    defectseverityindex FLOAT NOT NULL,
    defectfixrate FLOAT NOT NULL,
    defectrejectionratio FLOAT NOT NULL,
    meantimetofinddefect FLOAT NOT NULL,
    meantimetorepair FLOAT NOT NULL,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);

-- Agile_details table
CREATE TABLE agile_details (
    id SERIAL PRIMARY KEY,
    current_data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scream_name VARCHAR(100) NOT NULL,
    tester_name_id INTEGER NOT NULL REFERENCES testers(id),
    total_experience FLOAT NOT NULL,
    cpt_experience_start_date TIMESTAMP NOT NULL,
    total FLOAT NOT NULL,
    skillset VARCHAR[] NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    project_name_id INTEGER NOT NULL REFERENCES project_name(id)
);

-- Sprint_details table - fixed duplicate column and case sensitivity
CREATE TABLE sprint_details (
    id SERIAL PRIMARY KEY,
    story_committed INTEGER NOT NULL,
    story_completed INTEGER NOT NULL,
    story_points_committed INTEGER NOT NULL,
    story_points_completed INTEGER NOT NULL,
    defect_open_critical INTEGER DEFAULT 0,
    defect_open_high INTEGER DEFAULT 0,
    defect_open_medium INTEGER DEFAULT 0,
    defect_open_low INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL REFERENCES users(id),
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    agile_id INTEGER NOT NULL REFERENCES agile_details(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    sprint_name VARCHAR(200) NOT NULL,
    pi_name VARCHAR(200)  -- Changed from PI_name to pi_name
);

-- Story_details table
CREATE TABLE story_details (
    id SERIAL PRIMARY KEY,
    story_name VARCHAR(200) NOT NULL,
    story_point INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Incomplete',
    completed_percentage FLOAT NOT NULL,
    manual_or_automation VARCHAR(50) NOT NULL DEFAULT 'manual',
    tester_name_id INTEGER NOT NULL REFERENCES testers(id),
    sprint_detail_id INTEGER REFERENCES sprint_details(id)
);

-- Testing_type table
CREATE TABLE testing_type (
    id SERIAL PRIMARY KEY,
    total_testcase INTEGER NOT NULL,
    tcexecution INTEGER NOT NULL,
    passed INTEGER NOT NULL,
    fail INTEGER NOT NULL,
    opendefact VARCHAR(100) NOT NULL,
    type_of_testing VARCHAR(50) NOT NULL,
    project_name_id INTEGER NOT NULL REFERENCES project_name(id),
    user_id INTEGER NOT NULL REFERENCES users(id)
);
