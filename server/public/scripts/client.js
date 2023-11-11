console.log('JS is sourced!');

function onReady() {
    console.log('Hello World');
    getTodos();
}

onReady();

function getTodos() {
    axios({
        type: 'GET',
        url: '/todos'
    }).then((response) => {
        renderTodos(response.data);
    }).catch((error) => {
        console.log("GET /todos resulted in an error:", error);
    })
}

function handleSubmit(event) {
    event.preventDefault();
    console.log('Submitting event');
    console.log(document.getElementById("textIn").value);
    let newToDo = { 
        text: document.getElementById("textIn").value,
        isComplete: false
    }

    document.getElementById("textIn").value = '';
    document.getElementById("submitButton").value = '';

    axios({
        url: '/todos',
        method: 'POST',
        data: newToDo
    }).then((response) => {
        console.log('Response, update this code later');
        getTodos();
    }).catch((error) => {
        console.log(error, 'ERROR');
        alert('ERROR', error);
    })
}

function renderTodos(todos) {
    const toDosBody = document.getElementById('toDoTableBody');
    // Need to get row
    toDosBody.innerHTML = '';

    for (let task of todos) {
        toDosBody.innerHTML += `
            <tr id="${task.id}">
                <td data-testid="toDoItem" class=${task.isComplete ? "completed" : "task-is-not-complete"}>${task.text}
                    <button data-testid="completeButton" onclick="updateFinished(event)"><strong>Complete Task</strong></button>
                    <button data-testid="deleteButton" onclick="deleteTodo(event)">❌</button>
                    
                    </td>
            </tr>
        `;
    }
}

function deleteTodo(event) {
    console.log('deleting');
    let taskId = event.target.closest('tr').getAttribute('id');
    axios({
        url: `/todos/${taskId}`,
        method: 'DELETE'
    }).then((response) => {
        getTodos();
    }).catch((error) => {
        console.log(error, 'Error in deleting to-do');
        alert('ERROR, FAILED TO DELETE');
    })
}

function updateFinished(event) {
    console.log('Finishing task');
    let toDoId = event.target.closest('tr').getAttribute('id');
    console.log(toDoId);

    axios({
        url: `/todos/${toDoId}`,
        method: 'PUT'
    }).then((response) => {
        getTodos();
    }).catch((error) => {
        console.log(error, 'Error in updating');
        alert('ERROR IN UPDATING');
    })
}