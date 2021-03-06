var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
//might not need this path variable
var path = require('path');
var picabloFilePath = "";
var bcrypt = require('bcrypt'); // hashing
// var __dirname = "";
var baseURL = "https://www.picablostats.com/portal/";
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(session({ secret: 'dogs_dont_like_me' }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var clients = {}
// clients = {
//     id: client_id, (int)
//     firstname: req.body.firstname, (string)
//     lastname: req.body.lastname, (string)
//     email: req.body.email, (string)
//     password: p, (string)
//     project_ids: matchEmails(req.body.email), (string)
//     timestamp: time, (int)
//     hasPayment: false (boolean)
// }
// 
var freelancers = {}
// freelancers = {
//     id: int,
//     values: {
//         firstname: string,
//         lastname: string,
//         email: string,
//         password: long,
//         project_ids: [int]
//         field: string,
//         hours: string,
//         timestamp: string (account creation)
//         hasPayment: boolean,
//     }
// }
var projects = {}
// projects = {
//     id: int,
//     values: {
//         id: int,
//         client_id: int,
//         client_firstname: string,
//         client_lastname: string,
//         client_email: string
//         freelancer_id: int,
//         freelancer_firtname: string,
//         name: string,
//         amount: int, (number of cents)
//         contract: string, (file location)
//         milestones: [<milestone_object>],
//     }
// }
// milestone_object = {
//     date: date_object,
//     amount: int, (number of cents)
//     description: string,
//     feedback: string,
//     client_approved: boolean,
//     freelancer_approved: boolean
// }



// fs.readFile(freelancersFile, 'utf8', function readFileCallback(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         obj = JSON.parse(data); //now it an object
//         console.log("Read data file: " + obj);
//         if (obj) freelancers = obj;
//     }
// });

var read = (filePath) => {
    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            console.log("Read data file: " + obj);
            if (obj) return obj;
        }
    });
}

// reads file (.json) into variable
fs.readFile("freelancers.json", 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        obj = JSON.parse(data); //now it an object
        console.log("Read data file old-fashioned way: " + obj);
        if (obj) freelancers = obj;
    }
});
// reads file (.json) into variable
fs.readFile("clients.json", 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        obj = JSON.parse(data); //now it an object
        console.log("Read data file old-fashioned way: " + obj);
        if (obj) clients = obj;
    }
});
// reads file (.json) into variable
fs.readFile("projects.json", 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        obj = JSON.parse(data); //now it an object
        console.log("Read data file old-fashioned way: " + obj);
        if (obj) projects = obj;
    }
});


app.use(express.static('public'));
console.log("directory is: " + picabloFilePath);
//////////////////////\\\\\\\\\\\\\\\\\\\\\\
//////////////// INDEX PAGE \\\\\\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\\
app.get('/', function (req, res) {
    //getFiles();
    res.sendFile(picabloFilePath + "" + "index.html");
})

//////////////////////\\\\\\\\\\\\\\\\\\\\\\
/////////////// CLIENT PAGES \\\\\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\\

// account
app.get('/client/account/addpayment.html', function (req, res) {
    res.sendFile(picabloFilePath + "/client/account/" + "addpayment.html");
})

//TODO this
app.post('/client/account/addpayment.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {

    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/client/account/register.html', function (req, res) {
    res.sendFile(picabloFilePath + "/client/account/" + "register.html");
})
app.post('/client/account/register.html/post', urlencodedParser, function (req, res) {
    
    // Prepare output in JSON format
    var p = '';
    // bcrypt.hash(req.body.password, 10, function(err, hash) {
    //     console.log(hash);
    //     p = hash;
    //     console.log(p);
    // });

    var time = new Date().getUTCMilliseconds(); // creates validation time for each user


    p = bcrypt.hashSync(req.body.password, 10);

    // get length and replace here (client_id = length + 1)
    // var client_id = parseInt(Object.keys(clients).length + 1);
    // insert {"id: "}
    // clients[client_id] = response;
    // console.log("num clients right now: " + clients_db.find().length);

    //console.log("in connect function");
    
        response = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: p,
            project_ids: matchEmails(req.body.email),
            timestamp: time,
            hasPayment: false
        };
        fs.writeFile('clients.json', JSON.stringify(clients), 'utf8', (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        
        var client_id = parseInt(Object.keys(clients).length) + 1;
    clients[client_id] = response;
    req.session.user = client_id;
    req.session.user_type = 'client';
        // uploadFile("clients.json", bucket);
        // console.log("Uploaded client file to S3");
    
        //console.log(response);
        res.redirect("/client/project/" + "dashboard.html");
    } // end callback
); // end post

// project
app.get('/client/project/approvescope.html', function (req, res) {
    res.sendFile(picabloFilePath + "/client/project/" + "approvescope.html");
})


app.post('/client/project/approvescope.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {

    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/client/project/dashboard.html', function (req, res) {
    res.sendFile(picabloFilePath + "/client/project/" + "dashboard.html");
})
app.post('/client/project/dashboard.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {

    };
    console.log(response);
    res.end(JSON.stringify(response));
})


app.get('/client/account/login.html', function (req, res) {
    //getFiles();
    res.sendFile(picabloFilePath + "/client/account/" + "login.html");
})
app.post('/client/account/login.html/post', urlencodedParser, function (req, res) {
    //getFiles();
    // Prepare output in JSON format
    response = {
        email: req.body.email,
        password: req.body.password
    };
    //TODO this
    var user_id = -1;
    for (var i = 0; i < Object.keys(clients).length; i++) {
        if (clients[i + 1]['email'] == req.body.email) {
            user_id = i + 1;
            break;
        }
    };
    console.log('login user id ' + user_id);
    if (user_id == -1) {
        res.sendFile(picabloFilePath + "/public/client/account/" + "login.html");
    } else {

        //if (req.body.password == clients[user_id]['password']) {
        if (bcrypt.compareSync(req.body.password, clients[user_id]['password'])) {

            // sets a cookie with the user's info
            req.session.user = user_id;
            req.session.user_type = 'client';
            clients[user_id]['project_ids'] = matchEmails(req.body.email);
            res.redirect(picabloFilePath + '/client/project/dashboard.html');
        } else {
            res.sendFile(picabloFilePath + "/public/client/account/" + "login.html");
        }
    }

    console.log(response);
    res.sendFile(picabloFilePath + "/public/client/account/" + "login.html");
})

// if (clients[req.session.user]['timestamp'] == req.body.key) {
//let them through
//} else {
// don't let them in
//}
/* But this means that people can change user id to get different hash

OPTIONS:
1) add the account time to all forms and check that the project id has user id whose time = time
2) 
*/

////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\
/////////////// FREELANCER PAGES \\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\

// account

app.get('/flogout', function (req, res) {
    req.session.destroy();
    res.redirect('/freelancer/account/login.html');
    //res.end(req.session.user);
})
app.get('/clogout', function (req, res) {
    req.session.destroy();
    res.redirect(picabloFilePath + '/client/account/login.html');
    //res.end(req.session.user);
})

app.get('/freelancer/account/addinfo.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/account/" + "addinfo.html");
})
app.post('/freelancer/account/addinfo.html/post', urlencodedParser, function (req, res) {
    //getFiles();
    // Prepare output in JSON format
    freelancers[req.session.user]['field'] = req.body.lineOfWork;
    freelancers[req.session.user]['hours'] = req.body.typeOfFreelancer;
    response = {
        typeOfFreelancer: req.body.typeOfFreelancer,
        lineOfWork: req.body.lineOfWork
    };
    //TODO: AWS switchover (done)
    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    //uploadFile("freelancers.json", bucket);
    console.log("Uploaded freelancers file to S3");
    console.log(response);
    res.redirect('/freelancer/project/dashboard.html');
})

app.get('/freelancer/account/addpayment.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/account/" + "addpayment.html");
})
app.post('/freelancer/account/addpayment.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {

    };
    console.log(response);
    res.end(JSON.stringify(response));
})
app.get('/freelancer/account/login.html', function (req, res) {
    //getFiles();
    res.sendFile(picabloFilePath + "/freelancer/account/" + "login.html");
})
app.post('/freelancer/account/login.html/post', urlencodedParser, function (req, res) {
    //getFiles();
    // Prepare output in JSON format
    response = {
        email: req.body.email,
        password: req.body.password
    };
    //TODO this
    var user_id = -1;
    for (var i = 0; i < Object.keys(freelancers).length; i++) {
        if (freelancers[i + 1]['email'] == req.body.email) {
            user_id = i + 1;
            break;
        }
    };
    console.log('user id ' + user_id);
    if (user_id == -1) {
        res.sendFile(picabloFilePath + "/public/freelancer/account/" + "login.html");
    } else {

        if (bcrypt.compareSync(req.body.password, freelancers[user_id]['password'])) {
            // sets a cookie with the user's info
            req.session.user = user_id;
            req.session.user_type = 'freelancer';
            res.redirect('/freelancer/project/dashboard.html');
        } else {
            res.sendFile(picabloFilePath + "/public/freelancer/account/" + "login.html");
        }
    };
    console.log(response);
    res.sendFile(picabloFilePath + "/public/freelancer/account/" + "login.html");
})
app.get('/freelancer/account/register.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/account/" + "register.html");
})
app.post('/freelancer/account/register.html/post', urlencodedParser, function (req, res) {
    //getFiles();
    // Prepare output in JSON format
    // this is filled out
    var time = new Date().getUTCMilliseconds(); // creates validation time for each user
    p = bcrypt.hashSync(req.body.password, 10);

    response = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: p,
        project_ids: [],
        timestamp: time,
        hasPayment: false
    };
    var freelancer_id = parseInt(Object.keys(freelancers).length) + 1;
    freelancers[freelancer_id] = response;
    req.session.user = freelancer_id;
    req.session.user_type = 'freelancer';

    //TODO: AWS switchover (done)
    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    //uploadFile("freelancers.json", bucket);
    console.log("Uploaded freelancers file to S3");
    console.log(response);
    res.redirect("/freelancer/account/" + "addinfo.html");
})

// PROJECT
app.get('/freelancer/project/addclient.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/project/" + "addclient.html");
})
app.post('/freelancer/project/addclient.html/post', urlencodedParser, function (req, res) {
    //getFiles();
    // Prepare output in JSON format
    var proj_id = parseInt(Object.keys(projects).length + 1);

    // Upload contract
    /*
        1. Create project filename
        2. Upload file to AWS
        3. Store filename in JSON file
    */
    var amount = Math.floor(parseFloat(req.body.amount) * 100);
    response = {
        id: proj_id,
        client_id: -1,
        client_firstname: req.body.firstname,
        client_lastname: req.body.lastname,
        client_email: req.body.email,
        freelancer_id: req.session.user,
        freelancer_firstname: freelancers[req.session.user]['firstname'],
        freelancer_lastname: freelancers[req.session.user]['lastname'],
        name: req.body.projname,
        contract: req.body.contract,
        amount: amount,
        milestones: [],
    };
    projects[proj_id] = response;
    freelancers[req.session.user]['project_ids'].push(proj_id);
    req.session.project = proj_id;
    req.session.amount = amount;
    req.session.remaining_amount = amount;
    //TODO: AWS switchover (done)
    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    //uploadFile("freelancers.json", bucket);
    console.log("Uploaded freelancers file to S3");
    //TODO: AWS switchover (done)
    fs.writeFile('projects.json', JSON.stringify(projects), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    //uploadFile("projects.json", bucket);
    console.log("Uploaded projects file to S3");
    console.log(response);
    res.redirect("/freelancer/project/" + "addmilestones.html");
})

app.get('/freelancer/project/addmilestones.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/project/" + "addmilestones.html");
})
app.post('/freelancer/project/addmilestones.html/post', urlencodedParser, function (req, res) {
    //getFiles();
    // Prepare output in JSON format
    var amount;
    amount = req.body.fixedAmount;
    // if (req.body.unitOfMoney == 'percent') {
    //     amount = Math.ceil(parseFloat(req.body.amount) / 100 * projects[req.session.project]['amount']);
    // } else {
    //     amount = Math.floor(parseFloat(req.body.amount) * 100);
    // }
    response = {
        'date': req.body.date,
        'amount': amount,
        'description': req.body.desc,
        'feedback': '',
        'client_approved': false,
        'freelancer_approved': false,

    };
    // Check that we haven't gone over
    req.session.remaining_amount = req.session.remaining_amount - amount;
    console.log("project: " + req.session.project + " | response: " + JSON.stringify(response));
    projects[req.session.project]['milestones'].push(response);
    //TODO: AWS switchover (done)
    fs.writeFile('projects.json', JSON.stringify(projects), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    //uploadFile("projects.json", bucket);
    console.log("Uploaded projects file to S3");
    console.log(response);
    if (req.body.submit == 'Add More') {
        res.redirect("/freelancer/project/" + "addmilestones.html");
    } else {
        res.redirect("/freelancer/project/" + "dashboard.html");
    }

})

app.get('/freelancer/project/dashboard.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/project/" + "dashboard.html");
})
app.post('/freelancer/project/dashboard.html/post', urlencodedParser, function (req, res) {
    /** Should never be reached */


    // We should never be posting to dashboard. We post to /approve_method

    // Prepare output in JSON format
    // receives project_id, milestone_index

    // if (freelancers[req.session.user]['project_ids'].includes(req.body.project_id)) {
    //     projects[req.body.project_id]['milestones'][milestone_index]['freelancer_approved'] = true;
    //     console.log(response);
    // } else {
    //     // alert that you can't edit that project
    //     response = {};
    // }

    //TODO: fill this out
    res.end(JSON.stringify(response));
})

app.get('/freelancer/project/fillmilestones.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/project/" + "fillmilestones.html");
})
app.post('/freelancer/project/fillmilestones.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {

    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/freelancer/project/reviewproject.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/project/" + "reviewproject.html");
})
app.post('/freelancer/project/reviewproject.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {

    };
    console.log(response);
    res.end(JSON.stringify(response));
})
app.get('/freelancer/addstripe.html', function (req, res) {
    res.sendFile(picabloFilePath + "/freelancer/" + "addstripe.html");
})


// API STRUCTURE
app.get('/test', function (req, res) {
    res.end(
        'current user:  ' + req.session.user +
        '\ncurrent user type: ' + req.session.user_type +
        '\ncurrent project:  ' + req.session.project +
        '\nclients:     ' + JSON.stringify(clients) +
        '\nfreelancers: ' + JSON.stringify(freelancers) +
        '\nprojects:    ' + JSON.stringify(projects));
})


app.get('/user_name', function (req, res) {
    if (req.session.user) {
        if (req.session.user == -1) {
            res.end("");
        } else {
            if (req.session.user_type == "freelancer") {
                res.end(freelancers[req.session.user]['firstname']);
            }
            else {
                res.end(clients[req.session.user]['firstname']);
            }
        }
    } else {
        res.end("");
    }


})

app.get('/logged_in', function (req, res) {
    if (!req.session.user || req.session.user == -1) {
        console.log("user (not logged in) is " + req.session.user);
        res.end("-1");
    } else {
        console.log("user is " + req.session.user);
        res.end("1")
    }
})

app.get('/projects', function (req, res) {
    var user_projects = [];
    freelancers[req.session.user]['project_ids'].forEach(function (i) {
        user_projects.push(projects[i]);
    })
    res.end(JSON.stringify(user_projects));
})

app.get('/remainingamt', function (req, res) {
    if (req.session.remaining_amount) {
        res.end(toString(req.session.remaining_amount));
    } else {
        res.end("");
    }
})

app.get('/projectamt', function (req, res) {
    if (req.session.product) {
        if (req.session.amount) {
            res.end(toString(req.session.amount));
        } else {
            res.end("");
        }
    } else {
        res.end("");
    }
})

app.get('/client_projects', function (req, res) {
    var user_projects = [];
    clients[req.session.user]['project_ids'].forEach(function (i) {
        user_projects.push(projects[i]);
    })
    res.end(JSON.stringify(user_projects));
})

app.post('/approve_milestone', urlencodedParser, function (req, res) {
    var submitted = req.body.submitbtn;
    var project_id = req.body.project_id;
    var milestone_index = req.body.milestone_index;
    //if (freelancers[req.session.user]['project_ids'].includes(project_id)) {
    if (true) {
        console.log(project_id + ' ' + milestone_index);
        projects[project_id]['milestones'][milestone_index]['freelancer_approved'] = true;
        res.redirect("/freelancer/project/" + "dashboard.html");
    } else {
        console.log("tried to edit milestone not assigned to user");
    }
})

app.post('/client_approve_milestone', urlencodedParser, function (req, res) {
    var submitted = req.body.submitbtn;
    var project_id = req.body.project_id;
    var milestone_index = req.body.milestone_index;
    console.log(project_id + ' ' + milestone_index);
    projects[project_id]['milestones'][milestone_index]['client_approved'] = true;
    res.redirect("/client/project/" + "dashboard.html");
})

app.post('/token', function (req, res) {
    console.log('body is ' + req.body);
    token = req.body.token;
    console.log('token is: ' + JSON.stringify(token));
})

app.get('/project', function (req, res) {
    var proj = "";
    console.log(req.session.project);
    if (req.session.project) {
        proj = JSON.stringify(req.session.project);
        console.log("proj = ");
        console.log(proj);
    }
    res.end(proj);
})

app.get('/create_account', function (req, res) {
    if (req.session.user_type == 'client') {
        clients[req.session.user]['account'] = req.query.code;
    } else {
        freelancers[req.session.user]['account'] = req.query.code;
    }
    res.end(req.query.code);
})

app.get('/fname', function (req, res) {
    res.end(projects[req.session.project])
})

function matchEmails(client_email) {
    var project_ids = [];
    if (projects != {}) {
        Object.keys(projects).forEach(function (proj) {
            if (client_email == projects[proj]['client_email']) {
                project_ids.push(projects[proj]['id']);
            }
        })
    }
    return project_ids;
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://127.0.0.1:%s", port)
})
