let todoString = document.querySelector("#input-note");
let todoList = document.querySelector(".todoList");
let updatedString = document.querySelector("#update-todo");
let todoData = new Array();
let todoObj;
let localFlag = 0;

if ('serviceWorker' in navigator) {
  	window.addEventListener('load', () => {
    	navigator.serviceWorker.register('/serviceworker.js');
  	});
}

if(typeof(Storage)!=="undefined") {
	localFlag = 1;
} else {
	alert("Hello User, LocalStorage is not supported on your browser!! No to-do task will be saved when you close the browser.")
}

setTimeout(function() {
	if(localStorage.getItem('task')!=null && localFlag) {
		// Get task data from local storage and insert in variable
		todoObj = JSON.parse(localStorage.getItem("task"));
		for(let i=0;i<todoObj.length;i++) {
			let obj = {
				"name": todoObj[i].name,
				"completed": todoObj[i].completed
			};
			todoData.push(obj);
		}
	}
	document.querySelector(".loaderPart").style.display = "none";
	document.querySelector(".mainPart").style.display = "block";
},2500);

window.addEventListener("resize", function() {
	if(document.querySelector(".mainPart").style.display == "none") {
		return;
	}
	if(document.documentElement.scrollHeight > document.documentElement.clientHeight) {
		document.querySelector(".footer").style.cssText = "position: static; padding: 10px 0;";
	} else {
		document.querySelector(".footer").style.cssText = "position: absolute;";
	}
});

window.addEventListener("unload", function() {
	if(localStorage.getItem('task')!=null) {
		localStorage.removeItem("task");
	}
	localStorage.setItem("task", JSON.stringify(todoData));
});

document.querySelector(".btn1").addEventListener("click", function() {
	let oldPage = document.querySelector(".mainPart");
	let newPage = document.querySelector(".todoPart");
	let today = new Date();
	// Remove current page and add new page
	oldPage.style.transition = "opacity 0.5s ease";
	oldPage.style.opacity = 0;
	setTimeout(function() {
		oldPage.parentNode.removeChild(oldPage);
		newPage.style.display = "block";
		document.querySelector(".today").innerHTML = today.toDateString();
	}, 1000);
	// Create all tasks that were previously present
	for(let i=0;i<todoData.length;i++) {
		savedTasks(todoData[i]);
	}
});

document.querySelector(".addTaskBtn").addEventListener("click", function() {
	// Stop if input field is blank
	if(todoString.value.length==0) {
		return;
	}
	// Create tasks
	savedTasks(0);
	// Add tasks to array
	let obj = {
		"name" : todoString.value,
		"completed" : 0
	};
	todoData.push(obj);
	// Clear to-do input field
	todoString.value = "";
});

todoList.addEventListener("click", function(e) {
	let elem = e.target;
	// If check is clicked
	if(elem.classList[0] == "check") {
		iterateTasks(elem, 1);
		elem.parentNode.classList.toggle("done");
	}
	// If edit is cicked
	if(elem.classList[0] == "edit") {
		document.querySelector(".overlay2").style.display = "block";
		document.querySelector(".updateAlertBox").addEventListener("click", function(q) {
			let res = q.target;
			if(res.id == "Update") {
				// Check if input field is blank
				if(updatedString.value=="") {
					return;
				}
				iterateTasks(elem, 2);
				elem.parentElement.children[1].innerHTML = updatedString.value;
				updatedString.value = "";
				document.querySelector(".overlay2").style.display = "none";
			} else if(res.id == "Cancel") {
				document.querySelector(".overlay2").style.display = "none";
			}
		});
	}
	// If delete is clicked
	if(elem.classList[0] == "delete") {
		document.querySelector(".overlay1").style.display = "block";
		document.querySelector(".deleteAlertBox").addEventListener("click", function(q) {
			let res = q.target;
			if(res.id == "Yes") {
				iterateTasks(elem, 3);
				elem.parentNode.remove();
				document.querySelector(".overlay1").style.display = "none";
			} else if(res.id == "No") {
				document.querySelector(".overlay1").style.display = "none";
			}
		});
	}
});

function savedTasks(data) {
	// Create a to-do task
	let todo = document.createElement("div");
	todo.classList.add("todo-add");
	// Add check button to to-do task
	let check = document.createElement("div");
	check.classList.add("check");
	check.innerHTML = '<i class="fas fa-check"></i>';
	todo.appendChild(check);
	// Add task string from input
	let inp = document.createElement("div");
	inp.classList.add("todoNote");
	if(data=="0") {
		inp.innerHTML = todoString.value;
	} else {
		inp.innerHTML = data.name;
		if(data.completed==1) {
			todo.classList.add("done");
		}
	}
	todo.appendChild(inp);

	// Add delete button to to-do task
	let del = document.createElement("div");
	del.classList.add("delete");
	del.innerHTML = '<i class="fas fa-trash-alt"></i>';
	todo.appendChild(del);
	// Add edit button to to-do task
	let edit = document.createElement("div");
	edit.classList.add("edit");
	edit.innerHTML = '<i class="fas fa-pen"></i>';
	todo.appendChild(edit);

	// Add to-do task to the to-do container
	todoList.appendChild(todo);
}

function iterateTasks(elem, exp) {
	for(let i=0;i<todoData.length;i++) {
		let a = ""+elem.parentElement.children[1].innerHTML;
		let b = ""+todoData[i].name;
		if(a.trim() == b.trim()) {
			switch(exp) {
				case 1:
					todoData[i].completed = (todoData[i].completed == 0) ? 1 : 0;
					break;
				case 2:
					todoData[i].name = updatedString.value;
					break;
				case 3:
					todoData.splice(i, 1);
					break;
				default:
					alert("");
			}
			break;
		}
	}
}
