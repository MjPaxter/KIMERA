$(document).ready(function () {
    getMyData();
});

function isDateWithinThisMonth(dateString) {
    // Parse the date string into a Date object
    var date = new Date(dateString);

    // Get the current date
    var today = new Date();

    // Extract month and year from the current date
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();

    // Extract month and year from the provided date
    var dateMonth = date.getMonth();
    var dateYear = date.getFullYear();

    // Check if the year and month of the provided date match the current year and month
    return currentMonth === dateMonth && currentYear === dateYear;
}

function getMyData() {

    getMyTasks().then(result => {
        tasks = processJsonAndHandleError(result);
        $('#task-picker').find('option').remove()

        tasks.forEach(task => {
            $('#task-picker').append('<option  value="' + task.id + '">' + task.name + '</option>');
        });
        $("#task-picker").selectpicker("refresh");
        console.log("Received task=", tasks);


        getMySubmissions().then(result => {
            var submissions=processJsonAndHandleError(result);
            console.log("Received submissions=", submissions);

            var task_id = $("#task-picker").val()
            $("#task-picker").selectpicker("refresh");

            const filteredArray = submissions.filter(item => item.task_id == task_id);
            submissions.length = 0;
            Array.prototype.push.apply(submissions, filteredArray);

            console.log("Received submissions=", submissions);
            
            const generator = $('#list-item-generator');
            qpu_total_time_used=0;
            submissions.forEach(submission=>{
                if(isDateWithinThisMonth(submission.date_time) && (submission.submission_sampler!="S")){
                    qpu_total_time_used+=submission.qpu_time;
                }

                var clonedElement = generator.clone();
                clonedElement.css('display', 'block');
                clonedElement.removeAttr('id');
                clonedElement.find(".item-submission-id").text(submission.id);
                clonedElement.find(".item-submission-at").text(submission.date_time);
                if(submission.submission_sampler=="S"){
                    clonedElement.find(".item-submission-sampler").text("Simulated");
                }
                if(submission.submission_sampler=="H"){
                    clonedElement.find(".item-submission-sampler").text("Hybrid");
                }
                if(submission.submission_sampler=="Q"){
                    clonedElement.find(".item-submission-sampler").text("Quantum");
                }

                clonedElement.find(".item-submission-time-s").text(microsToSeconds(submission.qpu_time));
                clonedElement.find(".item-submission-time-ms").text(microsToMillis(submission.qpu_time));
                clonedElement.find(".item-submission-time-us").text(microsToRemainingMicros(submission.qpu_time));
                
                $('#submissions-list').append(clonedElement);
            });

            $("#text-qpu-used-time-s").text(microsToSeconds(qpu_total_time_used));
            $("#text-qpu-used-time-ms").text(microsToMillis(qpu_total_time_used));
            $("#text-qpu-used-time-us").text(microsToRemainingMicros(qpu_total_time_used));
            $("#text-submission-number").text(submissions.length);

            getTaskById(task_id).then(result => {
                var task=processJsonAndHandleError(result);
                console.log("Received task=", task);
                $("#admin-dashboard-groups-taskname").text(task.name);
                $("#text-qpu-task-time-s").text(microsToSeconds(task.quota));
                $("#text-qpu-task-time-ms").text(microsToMillis(task.quota));
                $("#text-qpu-task-time-us").text(microsToRemainingMicros(task.quota));
                var percentage_qpu=(qpu_total_time_used/task.quota*100).toFixed(2);;
                $("#bar-percentage-submissions").css("width", percentage_qpu+"%");
                $("#bar-percentage-submissions-text").text(percentage_qpu+"%");
            });
            
            updateChartData("submissionChart",submissions);
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