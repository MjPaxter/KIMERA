function showSnackBar(errorcode, errorMessage) {
    var snackbar = document.getElementById("snackbar");
    var snackbarErrorCode = document.getElementById("snackbar-error-code");
    var snackbarErrorMessage = document.getElementById("snackbar-error-message");
    if (errorcode == 200) {
        snackbarErrorCode.style.color = "#32CD32";
        snackbarErrorCode.innerHTML = "Ok!";
        snackbarErrorMessage.innerHTML = "";
    }
    else {
        snackbarErrorCode.style.color = "#FF0000";
        snackbarErrorCode.innerHTML = "Error " + errorcode + ": ";
        snackbarErrorMessage.innerHTML = errorMessage;
    }

    if (errorcode == 200) {
        snackbar.className = "show-ok";
        setTimeout(function () { snackbar.className = snackbar.className.replace("show-ok", ""); }, 2800);
    } else {
        snackbar.className = "show-error";
        setTimeout(function () { snackbar.className = snackbar.className.replace("show-error", ""); }, 4800);
    }
}