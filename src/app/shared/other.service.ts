import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});
@Injectable({
  providedIn: 'root'
})
export class OtherService {
  constructor(
    private as: AuthService,
  ) { }
  logout() {
    Swal.fire({
      imageUrl: 'assets/images/common/atwk.png',
      html: 'Are you sure <br> you want to log out?',
      imageWidth: 120,
      // showCancelButton: true,
      confirmButtonText: 'LOGOUT',
      // cancelButtonText:'LOGOUT EVERYWHERE',
      showCloseButton: true,
      customClass: {
        popup: 'sky-blue-bg logout-popup-size max-width',
        header: 'header-class',
        title: 'title-class',
        content: 'content-class-audio-send',
        image: 'image-class',
        actions: 'actions-class-del',
        confirmButton: 'confirm-button-class btn-width-logout',
        cancelButton: 'cancel-button-class btn-width-logout',
      },
    }).then((res) => {

      if (res.value) {
        this.as.logout(false);
      } else if (res.dismiss) {
        let x = res.dismiss.toString();
        if (x == 'cancel') {
          this.as.logout(true);

        }

      }
    })
  }

  swall(icon, title) {
    Toast.fire({
      icon: icon,
      title: title,
      customClass: {
        container: 'container-class',
        popup: 'popup-class max-width',
        title: 'title-class',
      },
    })
  }

  // ====================== time calculation ==================
  getDuration(time) {
    let localTime = new Date((new Date(time).getTime() - 19800000) + (new Date().getTimezoneOffset() * - 60000))
    let ms = new Date().getTime() - new Date(time).getTime();
    let year: number = 365 * 24 * 60 * 60 * 1000;
    let month: number = 30 * 24 * 60 * 60 * 1000;
    let week: number = 7*24 * 60 * 60 * 1000;
    let day: number = 24 * 60 * 60 * 1000;
    let hour: number = 60 * 60 * 1000;
    let minute: number = 60 * 1000;
    let second: number = 1000;
    let res = { value: 0, unit: '', online: false, localTime: localTime }
    if (ms >= year) {
      res.value = Math.floor(ms / year); res.unit = 'y';
    } else if (ms >= month) {
      res.value = Math.floor(ms / month); res.unit = 'm';
    } else if (ms >= week) {
      res.value = Math.floor(ms / week); res.unit = 'w';
    } else if (ms >= day) {
      res.value = Math.floor(ms / day); res.unit = 'd';
    } else if (ms >= hour) {
      res.value = Math.floor(ms / hour); res.unit = 'h';
      if (res.value <= 2) { res.online = true; }
    } else if (ms >= minute) {
      res.value = Math.floor(ms / minute); res.unit = 'min'; res.online = true;
    } else if (ms >= second) {
      res.value = Math.floor(ms / second); res.unit = 'sec'; res.online = true;
    }

    return res;
  }

  deletedSuccessfully() {
    Toast.fire({
      icon: 'success',
      title: 'Deleted successfully'
    })

  }
  delpopup() {
    return Swal.fire({
      title: 'Are you sure to delete ?',
      imageUrl: 'assets/images/common/atwk.png',
      imageWidth: 120,
      // imageHeight: 107,
      showCancelButton: true,
      confirmButtonText: 'No',
      cancelButtonText: 'Yes',
      allowOutsideClick: false,
      customClass: {
        popup: 'sky-blue-bg del-popup-size max-width',
        header: 'header-class',
        title: 'title-class',
        image: 'image-class',
        actions: 'actions-class-del',
        confirmButton: 'confirm-button-class',
        cancelButton: 'cancel-button-class',
      },
    })
  }
  changeTimeZone(time) {
    return new Date((new Date(time).getTime() - 19800000) + (new Date().getTimezoneOffset() * - 60000));
  }
  Linkify(inputText) {
    //URLs starting with http://, https://, or ftp://
    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with www. (without // before it, or it'd re-link the ones done above)
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links
    var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText
  }
  async swallImage(image) {
    if (image != 'assets/images/dark/s_m.svg' && image !='assets/images/dark/user.svg' && image !='assets/images/dark/s_f.svg') {


      let bgColor;
      if (localStorage.getItem('dark') == 'true') {
        bgColor = '#001f52';
      } else {
        bgColor = '#ffffff';
      }

      await Swal.fire({
        imageUrl: image,
        showCloseButton: true,
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: '<a download href="' + image + '"><i class="fa fa-2x fa-download" aria-hidden="true"></i></a>',
        background: bgColor,
        customClass: {
          container: 'container-class1',
          popup: 'popup-class-img-view',
          title: 'title-class1',
          closeButton: 'close-button-class-light',
          image: 'image-class-light',
          header: 'header-class-light',
          confirmButton: 'downlod-class'
        },
        showClass: {
          popup: 'animated fadeInUp faster'
        },
        hideClass: {
          popup: 'animated fadeOutDown faster'
        },
        preConfirm: (login) => { return false }

      })
    }
  }
}
