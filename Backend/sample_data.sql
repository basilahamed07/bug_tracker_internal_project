-- First, insert users
INSERT INTO users (username, password, role) VALUES
('john_doe', '$2b$10$somehashedpassword1', 'TestLead'),
('jane_smith', '$2b$10$somehashedpassword2', 'TestLead'),
('mike_wilson', '$2b$10$somehashedpassword3', 'TestLead');

-- Then insert project names
INSERT INTO project_name (project_name, user_id) VALUES
('E-Commerce Platform', 1),
('Mobile Banking App', 1),
('Healthcare Portal', 2);

-- Project details
INSERT INTO project_details (project_name_id, rag, tester_count, billable, nonbillable, billing_type, automation, ai_used, rag_details, user_id, agile) VALUES
(1, 'Green', 5, ARRAY[3], ARRAY[2], 'T&M', 'Selenium', 'ChatGPT', 'On Track', 1, true),
(2, 'Amber', 4, ARRAY[2], ARRAY[2], 'Fixed Price', 'Appium', 'None', 'Minor Delays', 1, true),
(3, 'Red', 3, ARRAY[2], ARRAY[1], 'T&M', 'None', 'None', 'Critical Issues', 2, false);

-- Insert tester names
INSERT INTO tester_name (tester_name, user_id) VALUES
('Alex Johnson', 1),
('Sarah Brown', 1),
('Mark Davis', 2);

-- Insert testers
INSERT INTO testers (billable, tester_name_id, project_name_id, user_id) VALUES
(true, 1, 1, 1),
(true, 1, 1, 1),
(false, 1, 1, 2);

-- Insert new defects
INSERT INTO new_defects (date, month, regression_defect, functional_defect, defect_reopened, uat_defect, project_name_id, user_id) VALUES
('2024-01-15', 'January', 5, 8, 2, 3, 1, 1),
('2024-01-15', 'January', 3, 5, 1, 2, 1, 1);

-- Insert test execution status
INSERT INTO test_execution_status (month, date, total_execution, tc_execution, pass_count, fail_count, no_run, blocked, project_name_id, user_id) VALUES
('January', '2024-01-15', 100, 80, 65, 10, 5, 0, 1, 1),
('January', '2024-01-15', 75, 60, 50, 8, 2, 0, 1, 1);

-- Insert total defect status
INSERT INTO total_defect_status (month, date, total_defect, defect_closed, open_defect, critical, high, medium, low, project_name_id, user_id) VALUES
('January', '2024-01-15', 20, 15, 5, 1, 2, 1, 1, 1, 1),
('January', '2024-01-15', 15, 10, 5, 0, 2, 2, 1, 1, 1);

-- Insert build status
INSERT INTO build_status (month, date, total_build_received, builds_accepted, builds_rejected, project_name_id, user_id) VALUES
('January', '2024-01-15', 10, 8, 2, 1, 1),
('January', '2024-01-15', 8, 7, 1, 1, 1);

-- Insert defect accepted rejected
INSERT INTO defect_accepted_rejected (month, date, total_defects, dev_team_accepted, dev_team_rejected, project_name_id, user_id) VALUES
('January', '2024-01-15', 15, 12, 3, 1, 1),
('January', '2024-01-15', 10, 8, 2, 1, 1);

-- Insert test case creation status
INSERT INTO test_case_creation_status (month, date, total_test_case_created, test_case_approved, test_case_rejected, project_name_id, user_id) VALUES
('January', '2024-01-15', 50, 45, 5, 1, 1),
('January', '2024-01-15', 40, 35, 5, 1, 1);

-- Insert metrics
INSERT INTO metrics (month, date, defectleakage, defectdensity, defectremovalefficiency, automationcoverage, testcasesefficiency, testerproductivity, defectseverityindex, defectfixrate, defectrejectionratio, meantimetofinddefect, meantimetorepair, project_name_id, user_id) VALUES
('January', '2024-01-15', 2.5, 1.8, 95.5, 60.0, 92.5, 85.0, 2.1, 88.5, 15.5, 24.0, 48.0, 1, 1),
('January', '2024-01-15', 3.0, 2.0, 92.0, 55.0, 90.0, 82.0, 2.3, 85.0, 18.0, 28.0, 52.0, 1, 1);

-- Insert agile details (updated with current_data)
INSERT INTO agile_details (current_data, scream_name, tester_name_id, total_experience, cpt_experience_start_date, total, skillset, user_id, project_name_id) VALUES
(CURRENT_TIMESTAMP, 'Scrum Team A', 1, 5.5, '2020-01-01', 4.0, ARRAY['Selenium', 'Java', 'REST API Testing'], 1, 1),
(CURRENT_TIMESTAMP, 'Scrum Team B', 2, 3.5, '2021-06-01', 2.5, ARRAY['Manual Testing', 'Postman', 'SQL'], 1, 1);

-- Insert sprint details with correct column name
INSERT INTO sprint_details (
    story_committed, story_completed, story_points_committed, story_points_completed, 
    defect_open_critical, defect_open_high, defect_open_medium, defect_open_low, 
    user_id, project_name_id, agile_id, start_date, end_date, sprint_name, pi_name
) VALUES
(10, 8, 50, 40, 0, 1, 2, 1, 1, 1, 1, '2024-01-01', '2024-01-14', 'Sprint 1', 'PL1'),
(8, 7, 40, 35, 0, 0, 1, 2, 1, 1, 2, '2024-01-01', '2024-01-14', 'Sprint 1', 'PL1');

-- Insert story details
INSERT INTO story_details (story_name, story_point, status, completed_percentage, manual_or_automation, tester_name_id, sprint_detail_id) VALUES
('User Authentication Flow', 8, 'Complete', 100.0, 'automation', 1, 1),
('Payment Gateway Integration', 13, 'In Progress', 75.0, 'manual', 2, 1),
('Mobile App Login', 5, 'Complete', 100.0, 'automation', 1, 2);

-- Insert testing type
INSERT INTO testing_type (total_testcase, tcexecution, passed, fail, opendefact, type_of_testing, project_name_id, user_id) VALUES
(100, 80, 70, 10, '5', 'Functional', 1, 1),
(50, 40, 35, 5, '3', 'Performance', 1, 1),
(75, 60, 55, 5, '2', 'Integration', 1, 1);
