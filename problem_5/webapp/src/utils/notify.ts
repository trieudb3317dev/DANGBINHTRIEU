import Swal, { SweetAlertIcon } from 'sweetalert2';

const notify = (error: SweetAlertIcon, title: string) => {
  return Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  }).fire({
    icon: error,
    title: title,
  });
};

export default notify;
