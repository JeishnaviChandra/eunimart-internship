from employees import *

@app.route('/addemployee', methods=["POST"])
def add_employee():
    print("fghj")
    body = request.get_json()
    # print(body)
    name=body.get("name")
    print(name)
    year=body.get("year")
    dob=body.get("dob")
    employee = Employee(**body).save()
    return jsonify({
        "status":200,
        "message":'employee '+name+ ' is added'
    })

@app.route('/employees',methods=["GET"])
def  get_all_employees():
    employee = Employee.objects()
    return jsonify({
        "status":200,
        "employeesList":employee
    })

@app.route('/getemployee/<id>',methods=["GET"])
def get_employee(id):
    employee=Employee.objects(id=id).first()
    return jsonify({
        "status":200,
        "Employee":employee
    })

@app.route('/updateemployee/<id>',methods=["PUT"])
def update_employee(id):
    body=request.get_json()
    name=body.get("name")
    year=body.get("year")
    dob=body.get("dob")
    employee=Employee.objects.get_or_404(id=id)
    employee.update(**body)
    return jsonify({
        "status":200,
        "message":'employee'+ name + 'is updated'
    })

@app.route('/deleteemployee/<id>', methods=['DELETE'])
def delete_empoyee(id):
    employee = Employee.objects.get_or_404(id=id)
    employee.delete()
    return jsonify({
        "status":200,
        "message":'employee is deleted'
    })


