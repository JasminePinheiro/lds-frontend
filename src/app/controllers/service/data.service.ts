import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  redirectToPage() {
    if(typeof window !== 'undefined') {

    window.addEventListener('keydown', (event: any) => {

      if (event.keyCode === 116 || (event.ctrlKey && event.keyCode === 82)) {
        window.location.href = window.location.href
      }
    })
  }

}
}
