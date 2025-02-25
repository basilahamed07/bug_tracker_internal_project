from flask import jsonify, request
from models import TestingType, db, Total_Defect_Status
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

def non_agile(app):
    
    # _______________ get the input from the lead_________________________--
    # Get specific project agile details
    @app.route('/testing-type/latest/<int:project_name_id>', methods=['GET'])
    @jwt_required()
    def get_latest_testing_type(project_name_id):
        # Get the latest testing type record for the given project
        testing_type = TestingType.query.filter_by(project_name_id=project_name_id).order_by(TestingType.id.desc()).first()

        if not testing_type:
            return jsonify({'message': 'No testing type found for this project'}), 404

        return jsonify(testing_type.to_dict()), 200
    

    @app.route('/testing-type/<int:project_name_id>', methods=['GET'])
    @jwt_required()
    def get_tester_type(project_name_id):
        # Get the latest testing type record for the given project
        testing_type = TestingType.query.filter_by(project_name_id=project_name_id).all()

        if not testing_type:
            return jsonify({'message': 'No testing type found for this project'}), 404

        return jsonify([trash.to_dict() for trash in testing_type]), 200

    @app.route('/testing-type', methods=['POST'])
    @jwt_required()
    def create_testing_type():
        # Get JSON data sent from frontend
        data = request.get_json()
        user = int(get_jwt_identity())

        # Iterate over the array of testing data (manual and automation)
        for testing_data in data:
            # Creating a new TestingType record for each item in the array
            new_testing_type = TestingType(
                total_testcase=testing_data['total_testcase'],
                tcexecution=testing_data['tcexecution'],
                passed=testing_data['passed'],
                fail=testing_data['fail'],
                opendefact=testing_data['opendefact'],
                type_of_testing=testing_data['type_of_testing'],
                project_name_id=testing_data['project_name_id'],
                user_id=user
            )

            # Add the new testing type to the session and commit
            db.session.add(new_testing_type)

        # Commit all the new testing types at once
        db.session.commit()

        # Return a success message along with the new records in the response
        return jsonify({'message': 'Data submitted successfully', 'data': [t.to_dict() for t in db.session.new]}), 201
    
    @app.route('/testing-type/<int:id>', methods=['PUT'])
    @jwt_required()
    def update_testing_type(id):
        data = request.get_json()

        # Fetch the TestingType record by ID
        testing_type = TestingType.query.get(id)

        if not testing_type:
            return jsonify({'message': 'Testing Type not found'}), 404

        # Update the fields
        testing_type.total_testcase = data.get('total_testcase', testing_type.total_testcase)
        testing_type.tcexecution = data.get('tcexecution', testing_type.tcexecution)
        testing_type.passed = data.get('passed', testing_type.passed)
        testing_type.fail = data.get('fail', testing_type.fail)  # Changed from fields to fail
        testing_type.opendefact = data.get('opendefact', testing_type.opendefact)
        testing_type.type_of_testing = data.get('type_of_testing', testing_type.type_of_testing)
        testing_type.project_name_id = data.get('project_name_id', testing_type.project_name_id)
        testing_type.user_id = data.get('user_id', testing_type.user_id)

        db.session.commit()

        return jsonify(testing_type.to_dict()), 200
    
    @app.route('/testing-type/<int:id>', methods=['DELETE'])
    @jwt_required()
    def delete_testing_type(id):
        # Fetch the TestingType record by ID
        testing_type = TestingType.query.get(id)

        if not testing_type:
            return jsonify({'message': 'Testing Type not found'}), 404

        db.session.delete(testing_type)
        db.session.commit()

        return jsonify({'message': 'Testing Type deleted successfully'}), 200


    # ________________ for get manager view api here -----------------------------

    @app.route('/testing-type/automation/latest/<int:project_name_id>', methods=['GET'])
    @jwt_required()
    def get_latest_automation_testing_type(project_name_id):
        # Get the latest TestingType record where the type_of_testing is 'Automation' for the given project
        testing_type = TestingType.query.filter_by(
            project_name_id=project_name_id, type_of_testing='Automation'
        ).order_by(TestingType.id.desc()).first()

        if not testing_type:
            return jsonify({'message': 'No automation testing type found for this project'}), 404

        return jsonify(testing_type.to_dict()), 200


    @app.route('/testing-type/manual/latest/<int:project_name_id>', methods=['GET'])
    @jwt_required()
    def get_latest_manual_testing_type(project_name_id):
        # Get the latest TestingType record where the type_of_testing is 'Manual' for the given project
        testing_type = TestingType.query.filter_by(
            project_name_id=project_name_id, type_of_testing='Manual'
        ).order_by(TestingType.id.desc()).first()

        if not testing_type:
            return jsonify({'message': 'No manual testing type found for this project'}), 404

        return jsonify(testing_type.to_dict()), 200


    # for get the open defact here 

    @app.route('/open_defact/<int:project_name_id>', methods=['GET'])
    @jwt_required()
    def get_open_defact(project_name_id):
        # Get the latest Total_Defect_Status record for the given project
        defect_status = Total_Defect_Status.query.filter_by(project_name_id=project_name_id).order_by(Total_Defect_Status.id.desc()).first()
    
        if not defect_status:
            return jsonify({'message': 'No defect status found for this project'}), 404
    
        # Return only the required keys
        return jsonify({
            'total_defect': defect_status.total_defect,
            'critical': defect_status.critical,
            'high': defect_status.high,
            'medium': defect_status.medium,
            'low': defect_status.low
        }), 200
