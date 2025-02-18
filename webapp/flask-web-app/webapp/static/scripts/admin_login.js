$(document).on('submit', '#admin-login-form', function (e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "/admin/login",
        data: $(this).serialize(),
        success: function (data) {
            var error = JSON.parse(JSON.parse(data).error);
            if(error.error_code==200){
                window.location.href="/admin/dashboard/"
            }else{
                console.log(error);
                showSnackBar(error.error_code, error.error_message);
            }
        }
    });
});