import { Component, inject } from '@angular/core';
import { EventModel } from '../../controllers/models/event-user';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

// firestore = inject(Firestore)

//   async testeAddEvent() {
//     try {
//       const newEvent: EventModel = {
//         end_date: 123,
//         event_name: "mine",
//         start_date: 123,
//         username: "mine"
//       }
//       alert("passou")

//     await  addDoc(collection(this.firestore, 'eventos'), newEvent)
//     console.log(this.firestore);
    

//     } catch (error) {
//       console.log(error);
//     }
//   }
  
}
