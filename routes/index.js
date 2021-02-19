var express = require('express');
var router = express.Router();
var fs = require('fs');
var FILENAME = "employee.json";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res) {
  res.send("<b>Hello World!</b>");
});

router.put('/employees', function(req, res) {
  var id = req.body.id;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var dept = req.body.dept;
  var salary = req.body.salary;
  //console.log("recv -> "+id+" "+fname+" "+lname+" "+dept+" "+salary);

  fs.readFile(FILENAME,function(err, data) { 
    if (err) throw err;
    var empObj = JSON.parse(data.toString('utf8'));
    var empArr = empObj.employees;
    empArr.push({"id":id,"fname":fname,"lname":lname,"dept":dept,"salary":salary});
    //console.log("empObj --> "+JSON.stringify(empObj));

    fs.writeFile(FILENAME, JSON.stringify(empObj), function (err) {
      if (err) throw err;
      console.log('File is inserted successfully.');
      res.send({"success": 1});
    });
  });
});

router.post('/employees', function(req, res) {
  var id = req.body.id;
  var fname = req.body.fname;
  var lname = req.body.lname;
  var dept = req.body.dept;
  var salary = req.body.salary;

  fs.readFile(FILENAME,function(err, data) { 
    if (err) throw err;
    var empObj = JSON.parse(data.toString('utf8'));
    var empArr = empObj.employees;

    //xxxxxx find the index of the element to be deleted
    var index = -1;
    for(i=0; i<empArr.length; i++){
       emp = empArr[i];
       if(emp.id == id) index = i;
    }
    //xxxxxx delete the element requested
    if(index != -1){
      empArr.splice(index, 1);
    }
    //xxxxxx add the new element
    empArr.push({"id":id,"fname":fname,"lname":lname,"dept":dept,"salary":salary});

    fs.writeFile(FILENAME, JSON.stringify(empObj), function (err) {
      if (err) throw err;
      console.log('File is updated successfully.');
      //console.log(JSON.stringify(empObj));
      res.send({"success": 1});
    });
  });
});

router.get('/employees', function(req, res, next) { 
  fs.readFile(FILENAME,function(err, data) { 
    if (err) throw err;
    var employeeObj = JSON.parse(data.toString('utf8'));
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(employeeObj));
    res.end();
  });
});

router.get('/employees/ID/:id', function(req, res, next) { 
  var id = req.params.id;
  fs.readFile(FILENAME,function(err, data) { 
    if (err) throw err;
    var empObj = JSON.parse(data.toString('utf8'));
    var empArr = empObj.employees;
    var emp = null;
    for(i=0; i<empArr.length; i++){
       var empElm = empArr[i];
       if(empElm.id == id){
          emp = empElm;
          break;
       }
    }
    //xxx response generation
    if(emp != null){
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(emp));
      res.end();
    }else{
      res.sendStatus(404);
    }
  });
});


module.exports = router;
