function getSubmissionsOfGroup(group) {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/submission/group/" + group.email,
    }));
}

function getMySubmissions() {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/submission/",
    }));
}

function getMyTasks() {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/my/task/",
    }));
}

function getTasks() {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/task/",
    }));
}

function getGroupTasks(group) {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/task/group/"+group.email,
    }));
}

function getMyGroup() {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/my/group/",
    }));
}

function getMyGroupMembers() {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/my/member/",
    }));
}

function getMembersOfGroup(group) {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/member/group/" + group.name,
    }));
}

function getAllGroups() {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/group/",
    }));
}

function getTaskById(task_id) {
    return Promise.resolve($.ajax({
        type: "GET",
        url: "/rest/api/task/"+task_id,
    }));
}

function processJsonAndHandleError(data){
    var error = JSON.parse(JSON.parse(data).error);
    if (error.error_code == 200) {
        var d = JSON.parse(JSON.parse(data).data);
        return d;
    } else {
        console.log(error);
        showSnackBar(error.error_code, error.error_message);
        throw new Error(error);
    }
}