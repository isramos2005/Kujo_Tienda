
function SuccessToast(message){
    VanillaToasts.create({
        title: 'Éxito',
        text: message,
        type: 'success',
        icon: 'assets/img/TOAST-ICONS/SUCCESS.png',
        timeout: 5000
      });
}

function ErrorToast(message){
    VanillaToasts.create({
        title: 'Error',
        text: message,
        type: 'error',
        icon: 'assets/img/TOAST-ICONS/ERROR.png',
        timeout: 5000,
      });
}

function InfoToast(message){
    VanillaToasts.create({
        title: 'Información',
        text: message,
        type: 'info',
        position: 'topCenter',
        icon: 'assets/img/TOAST-ICONS/INFO.png',
        timeout: 5000,
      });
}

function WarningToast(message){
    VanillaToasts.create({
        title: 'Advertencia',
        text: message,
        type: 'warning',
        icon: 'assets/img/TOAST-ICONS/WARNING.png',
        timeout: 5000
      });
}