$(document).ready(function () {
    getMyTasks().then(result => {
        var tasks = processJsonAndHandleError(result);
        tasks_text="";
        tasks.forEach(task => {
            tasks_text+=task.name+", "
        });
        console.log("Received tasks=", tasks);
        $("#profile-task-name").text(tasks_text.slice(0, -2));
    });

    getMyGroup().then(result => {
        var group = processJsonAndHandleError(result);
        console.log("Received group=", group);
        $("#profile-group-name").text(group.name);
        $("#profile-description").text(group.description);
        $("#profile-members").text(group.email);
        $("#profile-password").text(group.password);
    });
});