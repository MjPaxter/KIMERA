var totMembers = 0;

$(document).on('submit', '#apply-form', function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/apply",
        data: $(this).serialize(),
        success: function (data) {
            var error = JSON.parse(JSON.parse(data).error);
            console.log(error);
            showSnackBar(error.error_code, error.error_message);
        }
    });
});

function addMember() {
    var memberHtml = $("#apply-member-generator").clone().appendTo("#apply-member-generator-container");
    memberHtml.removeAttr('id');
    memberHtml.find("#apply-member-name").attr("id", "apply-member-name-" + totMembers.toString());
    memberHtml.find("#apply-member-email").attr("id", "apply-member-email-" + totMembers.toString());
    totMembers++;
    memberHtml.css("display", "block");
}

function refreshTasks() {
    $.ajax({
        type: "GET",
        url: "/rest/api/task/",
        success: function (data) {
            var error = JSON.parse(JSON.parse(data).error);
            if(error.error_code==200){
                var tasks=JSON.parse(JSON.parse(data).data);
                console.log("Received tasks:",tasks);
                tasks.forEach(task => {
                    $('#apply-group-task-picker').append('<option value="' + task.id + '">' + task.name + '</option>');
                });
                $("#apply-group-task-picker").selectpicker("refresh");
            }else{
                console.log(error);
                showSnackBar(error.error_code, error.error_message);
            }
        }
    });
}

$('#apply-group-task-picker').on('change', function(e){
    console.log(this.value,
                this.options[this.selectedIndex].value,
                $(this).find("option:selected").val(),);
  });

$(document).ready(function () {
    refreshTasks();
});