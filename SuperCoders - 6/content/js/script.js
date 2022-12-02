// Get textarea
const text = document.querySelector("#text");
// Get empty div with id
const prt = document.querySelector("#parent");

// Add list in todo in new/existing and storing in Server Storage
text.addEventListener("keypress",function(event)
{
  // If press enter...
  if (event.key == "Enter")
  {
    // Get Value
    var todo = text.value;

    // save in server
    const request = new XMLHttpRequest();
    request.open("POST", "https://to-do-app-server-express-login-service-3p34g8o8xdlaq2xkpn.codequotient.in/todo")
    request.setRequestHeader("Content-Type", "application/json");

    request.send(JSON.stringify({text:todo}));

    request.addEventListener("load",function()
    {
      if (request.status === 200)
      {
        // Create list of todos
        todoList(todo);

        // clear textarea
        text.value = "";      
      }
      else
      {
        console.log("Error Occured");
      }
    });
  }
});

// to get all todos
const getAllTodosRequest = new XMLHttpRequest();

getAllTodosRequest.open("GET", "https://to-do-app-server-express-login-service-3p34g8o8xdlaq2xkpn.codequotient.in/todo");

getAllTodosRequest.send();

getAllTodosRequest.addEventListener("load",function()
{
  if (getAllTodosRequest.status === 200)
  {
    var todos = JSON.parse(getAllTodosRequest.responseText);

    todos.forEach(function(todo)
    {
      // Create list of todos
      todoList(todo.text);
    })   
  }
  else
  {
    console.log("Error Occured");
  }
});

// create todo list 
function todoList(todo)
{
  // Create New Div
  var listItem = document.createElement("div");
  listItem.setAttribute("class","listContainer");

  // Create New Paragraph in Div
  var listText = document.createElement("span");
  listText.setAttribute("class","inputText");
  listText.innerText = todo;

  // Add value to List from textarea
  listItem.appendChild(listText);
  prt.appendChild(listItem);

  // Span for buttons
  var edit = document.createElement("span");
  edit.setAttribute("class","edit");
  listItem.appendChild(edit);

  // Create Pencil to update task
  var pencil = document.createElement("p");
  pencil.setAttribute("class","editText");
  pencil.innerHTML = "&#9998"; //add "Pencil" in list
  edit.appendChild(pencil);

  // Create Checkbox
  var check = document.createElement("input");
  check.setAttribute("class","check");
  check.type = "checkbox";
  edit.appendChild(check);

  // Create Cross
  var cross = document.createElement("p");
  cross.setAttribute("class","cross");
  cross.innerHTML = "&#x2A2F"; //add "X" in list
  edit.appendChild(cross);

  // Create Line
  var line = document.createElement("hr");
  listItem.appendChild(line);

  // striking text
  var strike = false;

  // underline text using checkbox
  check.addEventListener("click", function()
  {
    if (strike === false)
    {
      strike =true;
      listText.style.setProperty("text-decoration", "line-through");
    }
    else
    {
      strike = false;
      listText.style.removeProperty("text-decoration", "line-through");
    }
  });

  // Deleting todo from screen
  cross.addEventListener("click", function()
  {
    prt.removeChild(listItem);
  });
}
