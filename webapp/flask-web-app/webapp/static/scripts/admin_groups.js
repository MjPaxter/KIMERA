var clickedGroup = null;

function showGroupData(group) {
    clickedGroup = group;

    var tasks = null;
    getGroupTasks(group).then(result => {
        tasks = processJsonAndHandleError(result);
        tasks_text = "";
        $('#task-picker').find('option').remove()

        tasks.forEach(task => {
            console.log("Received task=", task);
            tasks_text += task.name + ", ";
            $('#task-picker').append('<option  value="' + task.id + '">' + task.name + '</option>');

        });
        $("#task-picker").selectpicker("refresh");

        $("#admin-dashboard-groups-taskname").text(tasks_text);
        console.log("Received task=", tasks);

        getSubmissionsOfGroup(group).then(result => {
            var submissions = processJsonAndHandleError(result);
            var task_id = $("#task-picker").val()

            const filteredArray = submissions.filter(item => item.task_id == task_id);
            submissions.length = 0;
            Array.prototype.push.apply(submissions, filteredArray);

            console.log("Received submissions=", submissions);

            qpu_total_time_used = 0;
            submissions.forEach(submission => {
                qpu_total_time_used += submission.qpu_time;
            });
            $("#text-qpu-used-time-s").text(microsToSeconds(qpu_total_time_used));
            $("#text-qpu-used-time-ms").text(microsToMillis(qpu_total_time_used));
            $("#text-qpu-used-time-us").text(microsToRemainingMicros(qpu_total_time_used));
            $("#text-submission-number").text(submissions.length);


            getTaskById(task_id).then(result => {
                var task = processJsonAndHandleError(result);
                console.log("Received task=", task);
                $("#text-qpu-task-time-s").text(microsToSeconds(task.quota));
                $("#text-qpu-task-time-ms").text(microsToMillis(task.quota));
                $("#text-qpu-task-time-us").text(microsToRemainingMicros(task.quota));
                var percentage_qpu = qpu_total_time_used / task.quota * 100;
                $("#bar-percentage-submissions").css("width", percentage_qpu + "%");
                $("#bar-percentage-submissions-text").text(percentage_qpu + "%");
            });

            updateChartData("submissionChart", submissions);
        });
        $("#task-picker").selectpicker("refresh");
    });

    $("#admin-dashboard-groups-name").text(group.name);
    $("#admin-dashboard-groups-members").text(group.email);
    $("#admin-dashboard-groups-token").text(group.token);
    $("#admin-dashboard-groups-password").text(group.password);

    //$("#admin-dashboard-groups-status").text(group.status);

    /*$("#admin-dashboard-groups-status").on("click", function () {
        openConfirmDialog({
            target:$("#admin-dashboard-groups-status"), title: "Cambio stato",
            content: "Vuoi davvero eliminare l'account admin di " + a.name + " " + a.surname + "?",
            onConfirm: function () { deleteAdmin(a); },
            confirmText: 'Cancella'
        });
    });*/
}

function addGroup(group) {
    var groupHtml = $("#group-list-item-generator").clone().appendTo("#groups-list-scrollable");
    groupHtml.removeAttr('id');
    groupHtml.addClass("group-list-item-generator-generated");
    groupHtml.on("click", function () {
        showGroupData(group);
    });
    if (group.status == "accepted") {
        groupHtml.find("i").eq(0).css("display", "block");
    } else if (group.status == "pending") {
        groupHtml.find("i").eq(1).css("display", "block");
    } else if (group.status == "rejected") {
        groupHtml.find("i").eq(2).css("display", "block");
    }
    groupHtml.find(".list-group-name").text(group.name);
    groupHtml.css("display", "inline-block");
}


function closeModalAdmission() {
    $('#modalAdmission').modal('hide');
}

function showModalAdmission() {
    $('#modalAdmission').modal('show');
}

function editAdmissionStatus() {
    /*$.ajax({
        type: "PUT",
        url: "/rest/api/group/" + clickedGroup.name + "/status/",
        data: {
            status: $('#modal-admission-data').val(),
            csrf_token: $('#input-csrf-token').val()
        },
        success: function (data) {
            var error = JSON.parse(JSON.parse(data).error);
            if (error.error_code == 200) {
                clickedGroup.status = $('#modal-admission-data').val()
            }
            showGroupData(clickedGroup);
            refreshGroups();
            console.log(error);
            showSnackBar(error.error_code, error.error_message);
        }
    });*/

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
            /*if (error.error_code == 200) {
                clickedGroup.status = $('#modal-admission-data').val()
            }*/
            /*showGroupData(clickedGroup);
            refreshGroups();*/
            console.log(error);
            showSnackBar(error.error_code, error.error_message);
        }
    });
}

function refreshGroups() {
    $(".group-list-item-generator-generated").remove();
    getAllGroups().then(result => {
        var groups = processJsonAndHandleError(result);
        console.log("Received groups=", groups);
        groups.forEach(group => {
            addGroup(group);
        });
    });
}

$("#task-picker").on("changed.bs.select",
    function (e, clickedIndex, newValue, oldValue) {
        console.log(newValue,oldValue)
        if (newValue != oldValue) {
            showGroupData(clickedGroup);
        }
    }
);

$(document).ready(function () {
    getTasks().then(result=>{
        tasks = processJsonAndHandleError(result);
        tasks.forEach(task => {
            $('#add-group-task').append('<option  value="' + task.id + '">' + task.name + '</option>');
        });
        $("#add-group-task").selectpicker("refresh");
    });
    refreshGroups();
});