// import
const express = require("express");
const session = require("express-session")
// To handle files
const fs = require("fs");

// Initiate express
const app = express();

// Middlewares		
// for JavaScript and CSS
app.use(express.static("content"));
// for JSON data type
app.use(express.json());
// for form data type
app.use(express.urlencoded({extended:true}));

// Login Session
app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true,
	cookie: {secure:false}
}));

// Get route to Home Page
app.get("/", Home);
app.get("/home", Home);

// Get route to About Page
app.get("/about", About);

// chaining of todo page route
app.route("/todo").get(GetTodo).post(PostTodo);

// chaining of login page route
app.route("/login").get(function(req, res)
{
	res.sendFile(__dirname+"/content/html/login.html");
})
.post(function(req, res)
{
	getUser(function(users)
	{
		const user = users.filter(function(user)
		{
			if (user.username === req.body.username && user.password === req.body.password)
			{
				return true
			};
		});
			if (user.length)
			{
				req.session.isLoggedIn = true;
				res.redirect("/");
			}
			else
			{
				res.end("Login Failed")
			};
	});
});

// chaining of signup page route
app.route("/signup").get(function(req, res)
{
	res.sendFile(__dirname+"/content/html/signup.html");
})
.post(function(req, res)
{
	saveUser(req.body, function(err)
	{
		if (err)
		{
			res.end("Somthing went Wrong")
		}
		else
		{
			res.redirect("/login")
		};
	});
});

// start server at port 3000
app.listen(3000,function()
{
	console.log("server is running");	
});

// Home function
function Home(req,res)
{
	if (req.session.isLoggedIn)
	{
		res.sendFile(__dirname+"/content/html/home.html");
	}
	else
	{
		res.redirect("/login");
	}
};

// About function
function About(req,res)
{
	res.end("About");
};

// GetTodo function
function GetTodo(req, res)
{
	GetTodos(function(err, todos)
	{
		res.json(todos);
	});
};	

// PostTodo function
function PostTodo(req, res)
{
	GetTodos(function(err,todos)
	{
		savaTodo(req.body, function()
		{
			res.end();	
		});
	});
};

// GetTodos function
function GetTodos(callback)
{
	fs.readFile("./todos.txt", "utf-8", function(err, data)
	{
		if (err)
		{
			callback(err, null)
			return
		};	
		callback(null, JSON.parse(data))
	});
};

// savaTodo function
function savaTodo(todo, callback)
{
	GetTodos(function(err, todos)
	{
		todos.push(todo)
		fs.writeFile("./todos.txt", JSON.stringify(todos), function(err)
		{
			if (err)
			{
				callback(err, null)
				return
			};
			callback(null);
		});
	});
};

// saveUser function to save in user.txt file
function saveUser(user, callback)	
{
	getUser(function(users)
	{
		users.push(user);
		fs.writeFile("./user.txt", JSON.stringify(users), function(err)
		{
			if (err)
			{
				callback(err, null)
				return
			};
			callback(null);
		});
	});
};

// getUser function
function getUser(callback)
{
	fs.readFile("./user.txt", "utf-8", function(err, data)
	{
		if (data)
		{
			callback(JSON.parse(data));
		};
	});
};
