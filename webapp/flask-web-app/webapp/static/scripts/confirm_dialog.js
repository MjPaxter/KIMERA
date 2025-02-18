function openConfirmDialog({ target = null, title = "", content = "", onConfirm = null, onCancel = null, type = 'red', confirmText = 'Conferma', cancelText = 'Annulla' } = {}) {
    if (target == null) {
        $.confirm({
            title: title,
            content: content,
            columnClass: 'col-12 col-md-8',
            type: type,
            bgOpacity: 0.5,
            draggable: false,
            buttons: {
                confirm: {
                    text: confirmText,
                    btnClass: "confirm__button",
                    action: function () {
                        if (onConfirm != null) {
                            onConfirm();
                        }
                    }
                },
                cancel: {
                    text: cancelText,
                    btnClass: "blue_button",
                    action: function () {
                        if (onCancel != null) {
                            onCancel();
                        }
                    }
                }
            },
        });
    } else {
        $(target).confirm({
            title: title,
            content: content,
            columnClass: 'col-12 col-md-8',
            type: type,
            bgOpacity: 0.5,
            draggable: false,
            buttons: {
                confirm: {
                    text: confirmText,
                    btnClass: "confirm__button",
                    action: function () {
                        if (onConfirm != null) {
                            onConfirm();
                        }
                    }
                },
                cancel: {
                    text: cancelText,
                    btnClass: "blue_button",
                    action: function () {
                        if (onCancel != null) {
                            onCancel();
                        }
                    }
                }
            },
        });
    }
}