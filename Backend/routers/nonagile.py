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
        try:
            data = request.get_json()
            user_id = int(get_jwt_identity())
            
            if not data or 'testing_details' not in data:
                return jsonify({"error": "Missing testing details"}), 400

            testing_entries = []
            testing_details = data.get('testing_details', [])
            defect_data = data.get('defect_details', {})

            # Create testing entries
            for test_data in testing_details:
                testing_entry = TestingType(
                    total_testcase=test_data['total_testcase'],
                    tcexecution=test_data['tcexecution'],
                    passed=test_data['passed'],
                    fail=test_data['fail'],
                    opendefact=test_data['opendefact'],
                    type_of_testing=test_data['type_of_testing'],
                    project_name_id=test_data['project_name_id'],
                    user_id=user_id
                )
                testing_entries.append(testing_entry)
                db.session.add(testing_entry)

            # Create defect details if provided
            if defect_data:
                defect_entry = Total_Defect_Status(
                    total_defect=defect_data['total_defects'],
                    critical=defect_data['critical'],
                    high=defect_data['high'],
                    medium=defect_data['medium'],
                    low=defect_data['low'],
                    project_name_id=defect_data['project_name_id'],
                    month=defect_data['month'],
                    date=defect_data['date'],
                    defect_closed=defect_data.get('defect_closed', 0),
                    open_defect=defect_data.get('open_defect', defect_data['total_defects']),
                    user_id=user_id  # Add user_id from JWT token
                )
                db.session.add(defect_entry)

            db.session.commit()

            return jsonify({
                "message": "Testing details added successfully",
                "testing_entries": [entry.to_dict() for entry in testing_entries]
            }), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400
    
    # @app.route('/testing-type/<int:id>', methods=['PUT'])
    # @jwt_required()
    # def update_testing_type(id):
    #     data = request.get_json()

    #     # Fetch the TestingType record by ID
    #     testing_type = TestingType.query.get(id)

    #     if not testing_type:
    #         return jsonify({'message': 'Testing Type not found'}), 404

    #     # Update the fields
    #     testing_type.total_testcase = data.get('total_testcase', testing_type.total_testcase)
    #     testing_type.tcexecution = data.get('tcexecution', testing_type.tcexecution)
    #     testing_type.passed = data.get('passed', testing_type.passed)
    #     testing_type.fail = data.get('fail', testing_type.fail)  # Changed from fields to fail
    #     testing_type.opendefact = data.get('opendefact', testing_type.opendefact)
    #     testing_type.type_of_testing = data.get('type_of_testing', testing_type.type_of_testing)
    #     testing_type.project_name_id = data.get('project_name_id', testing_type.project_name_id)
    #     testing_type.user_id = data.get('user_id', testing_type.user_id)

    #     db.session.commit()

    #     return jsonify(testing_type.to_dict()), 200
    

    @app.route('/testing-type/<int:id>', methods=['PUT'])
    @jwt_required()
    def update_testing_type(id):
        try:
            data = request.get_json()
            user_id = int(get_jwt_identity())
            
            if not data or 'testing_details' not in data:
                return jsonify({"error": "Missing testing details"}), 400
    
            # Fetch the TestingType record by ID
            testing_type = TestingType.query.get(id)
            
            if not testing_type:
                return jsonify({'message': 'Testing Type not found'}), 404
            
            # Update testing type details
            testing_details = data.get('testing_details', [])
            defect_data = data.get('defect_details', {})
    
            # Update the testing entries
            for test_data in testing_details:
                testing_type.total_testcase = test_data.get('total_testcase', testing_type.total_testcase)
                testing_type.tcexecution = test_data.get('tcexecution', testing_type.tcexecution)
                testing_type.passed = test_data.get('passed', testing_type.passed)
                testing_type.fail = test_data.get('fail', testing_type.fail)
                testing_type.opendefact = test_data.get('opendefact', testing_type.opendefact)
                testing_type.type_of_testing = test_data.get('type_of_testing', testing_type.type_of_testing)
                testing_type.project_name_id = test_data.get('project_name_id', testing_type.project_name_id)
                testing_type.user_id = user_id
    
                db.session.add(testing_type)
    
            # Update defect details if provided
            if defect_data:
                defect_entry = Total_Defect_Status.query.filter_by(project_name_id=defect_data.get('project_name_id'), user_id=user_id).first()
                
                if defect_entry:
                    defect_entry.total_defect = defect_data.get('total_defects', defect_entry.total_defect)
                    defect_entry.critical = defect_data.get('critical', defect_entry.critical)
                    defect_entry.high = defect_data.get('high', defect_entry.high)
                    defect_entry.medium = defect_data.get('medium', defect_entry.medium)
                    defect_entry.low = defect_data.get('low', defect_entry.low)
                    defect_entry.month = defect_data.get('month', defect_entry.month)
                    defect_entry.date = defect_data.get('date', defect_entry.date)
                    defect_entry.defect_closed = defect_data.get('defect_closed', defect_entry.defect_closed)
                    defect_entry.open_defect = defect_data.get('open_defect', defect_entry.open_defect)
    
                    db.session.add(defect_entry)
                else:
                    # If no existing defect entry, create a new one
                    defect_entry = Total_Defect_Status(
                        total_defect=defect_data['total_defects'],
                        critical=defect_data['critical'],
                        high=defect_data['high'],
                        medium=defect_data['medium'],
                        low=defect_data['low'],
                        project_name_id=defect_data['project_name_id'],
                        month=defect_data['month'],
                        date=defect_data['date'],
                        defect_closed=defect_data.get('defect_closed', 0),
                        open_defect=defect_data.get('open_defect', defect_data['total_defects']),
                        user_id=user_id
                    )
                    db.session.add(defect_entry)
    
            db.session.commit()
    
            return jsonify({
                "message": "Testing details updated successfully",
                "testing_entries": [entry.to_dict() for entry in [testing_type]]
            }), 200
    
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400

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
