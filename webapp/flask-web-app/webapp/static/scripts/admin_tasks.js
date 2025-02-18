
function refreshTasks(){
    getTasks().then(result=>{
        tasks = processJsonAndHandleError(result);
        console.log(tasks);
        var tableBody = $('#data-table tbody');
        // Clear existing rows
        tableBody.empty();
        tasks.forEach(task => {
            
            var newRow = $('<tr>');

            // Populate cells with data
            newRow.append($('<td>').text(task.id));
            newRow.append($('<td>').text(task.name));
            newRow.append($('<td>').text(task.description));
            newRow.append($('<td>').text(task.quota));
            //newRow.append($('<td>').html('<button class="btn btn-primary" onclick="showModalTaskAddWithData(${task.id},${task.name},${task.description},${task.quota})">Click me</button>'));
            var buttonCell = $('<td>');
            var button = $('<button>').addClass('btn btn-primary').text('Edit');
            button.click(function() {
                showModalTaskAddWithData(task.id,task.name,task.description,task.quota);
            });
            buttonCell.append(button);
            newRow.append(buttonCell);

            //newRow.append($('<td>').html(`<button type='button' onclick='showModalTaskAddWithData(${task.id},${task.name},${task.description},${task.quota})' class='btn btn-primary'>Edit</button>`));
            // Add more cells as needed

            // Append the new row to the table body
            tableBody.append(newRow);

        });
    });
}


$(document).ready(function() {
    refreshTasks();
});

function closeModalTaskAdd() {
    $('#modalTaskAdd').modal('hide');
}

function showModalTaskAdd() {
    $('#modalTaskAdd').modal('show');
}

function deleteTask() {
    var result = confirm("Are you sure you want to delete the task with ID= "+$('#add-task-id').val()+" ?");
            
    // If the user confirms, perform the action
    if (result) {
        $.ajax({
            type: "DELETE",
            url: "/rest/api/task/"+$('#add-task-id').val(),
            data: {
                csrf_token: $('#input-csrf-token').val()
            },
            success: function (data) {
                var error = JSON.parse(JSON.parse(data).error);
                console.log(error);
                showSnackBar(error.error_code, error.error_message);
                refreshTasks();
            }
        });
    } else {
        console.log("Action canceled!");
    }
}

function showModalTaskAddWithData(id,name,description,quota) {
    $('#add-task-name').val(name);
    $('#add-task-description').val(description);
    $('#add-task-quota').val(quota);
    $('#add-task-id').val(id);
    $('#modalTaskAdd').modal('show');
}


function addTask() {
    $.ajax({
        type: "PUT",
        url: "/rest/api/task/"+$('#add-task-id').val(),
        data: {
            name: $('#add-task-name').val(),
            description: $('#add-task-description').val(),
            quota: $('#add-task-quota').val(),
            csrf_token: $('#input-csrf-token').val()
        },
        success: function (data) {
            var error = JSON.parse(JSON.parse(data).error);
            console.log(error);
            showSnackBar(error.error_code, error.error_message);
            refreshTasks();
        }
    });
}

function updateTask() {
    

    $.ajax({
        type: "POST",
        url: "/rest/api/group/",
        data: {
            email: $('#add-group-email').val(),
            name: $('#add-group-name').val(),
            password: $('#add-group-password').val(),
            task_ids: $('#add-group-task').val(),
            csrf_token: $('#input-csrf-token').val()
        },
        success: function (data) {
            var error = JSON.parse(JSON.parse(data).error);
            console.log(error);
            showSnackBar(error.error_code, error.error_message);
            refreshTasks();
        }
    });
}