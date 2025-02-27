from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models import db,Users,Project_name,Project_details,New_defects,Total_Defect_Status,Test_execution_status,Testers,TestCaseCreationStatus,DefectAcceptedRejected,BuildStatus
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
import os
from datetime import date

#logic for get assign the month recoding to the date


#for get the project id for corrosponding project name
def get_project_name(project_name):
    project = Project_name.query.filter_by(project_name=project_name).first()
    return project



# convert the date into month
def get_month(date_str):
    if len(date_str) > 10:
        date_obj = date.fromisoformat(date_str[0:10])
        return date_obj.strftime('%B')
    else:
        date_obj = date.now()
        return date_obj.strftime('%B')


def register_router(app):
    # ------------------------for login and register the users --------------------------------
    #to register the users


    #change the passwoed

    @app.route('/password-update', methods=['POST'])
    @jwt_required()
    def password_update():
        
        user_id = int(get_jwt_identity())
        final = Users.query.filter_by(id=user_id).first()
        if not final.role == "admin":
            return jsonify({"message":"user not authorizee to edite"})
        data = request.json
        hashed_password = generate_password_hash(data['password'])
        
        update = Users.query.filter_by(id=data["userId"]).first()
        
        update.password = hashed_password
        db.session.commit()
        return jsonify({"message":"updates sucessfully"})
    
    @app.route('/role-change', methods=['POST'])
    @jwt_required()
    def change_role():
        user_id = int(get_jwt_identity())
        final = Users.query.filter_by(id=user_id).first()
        if not final.role == "admin":
            return jsonify({"message":"user not authorizee to edite"})
        data = request.json
        
        role = data["role"]
        
        update = Users.query.filter_by(id=data["userId"]).first()
        
        update.role = role
        db.session.commit()
        return jsonify({"message":"updates sucessfully"})



    @app.route('/get-role', methods=['GET'])
    @jwt_required()
    def get_role():
        user_id = int(get_jwt_identity())
        final = Users.query.filter_by(id=user_id).first()
        return jsonify({"role":final.role})
    

    @app.route('/all-users', methods=['GET'])
    @jwt_required()
    def get_user_all():
        user_id = int(get_jwt_identity())
        final = Users.query.all()
        return jsonify({"user":[trash.to_dict() for trash in final]})


    @app.route('/register', methods=['POST'])
    def register_user():

        #get the data from the json  file
        data = request.json
        #check if the data was correct or not
        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Username and password required'}), 400
        
        #check if the username is present or not
        if Users.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'User already exists'}), 400
        #create the password in encripted file
        hashed_password = generate_password_hash(data['password'])
        
        # adding the User table for username and password
        new_user = Users(username=data['username'], password=hashed_password,role=data["role"])
        
        try:
            db.session.add(new_user)
            db.session.commit()
            return jsonify({'message': 'User registered successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
        


    #login the users
    @app.route('/login', methods=['POST'])
    def login_user():
        data = request.json
        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Username and password required'}), 400
        
        user = Users.query.filter_by(username=data['username']).first()
        if user is None:
            return jsonify({'error': 'User not found'}), 404
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'username': user.username,
                'userId': user.id,
                'role': user.role,
            }
        }), 200
    
    # -------------------------------end of login and register the user ----------------------------