import { Component, signal, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';

import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],

})

export class CalendarComponent {
  ngOnInit(): void {
    this.carregarEventosDoUsuario()
  }

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  firestore = inject(Firestore);
  currentEvents = signal<EventApi[]>([]);
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      bootstrap5Plugin
    ],

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },

    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this), // função para adicionar eventos
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    locale: 'pt-br',
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista'
    },

    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });


  carregarEventosDoUsuario() {
    if (typeof localStorage !== 'undefined') {
      let email = localStorage.getItem("email");
    }
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }


  // ***** Modal em produção de adicionar evento *****
  handleDateSelect(selectInfo: DateSelectArg) {
    let modal = document.querySelector(".modalAddEvent") as HTMLElement
    modal.style.display = "block"
    modal.style.position = "absolute";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.zIndex = '2'
    modal.style.backgroundColor = "#fff"
    modal.style.width = "450px"
    modal.style.height = "450px"
    modal.style.borderRadius = "10px"

    const addButton = document.querySelector('.modalAddEvent button[type="submit"]') as HTMLButtonElement;

    addButton.onclick = async () => {
      const titleInput = document.querySelector('.modalAddEvent input#nameEvent') as HTMLInputElement;
      const startDateInput = document.querySelector('.modalAddEvent input#startDate') as HTMLInputElement;
      const endDateInput = document.querySelector('.modalAddEvent input#endDate') as HTMLInputElement;
      const startHourInput = document.querySelector('.modalAddEvent input#startHour') as HTMLInputElement;
      const endHourInput = document.querySelector('.modalAddEvent input#endHour') as HTMLInputElement;

      const title = titleInput.value
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      const startHour = startHourInput.value;
      const endHour = endHourInput.value;

      const startDateTime = new Date(`${startDate}T${startHour}`);
      const endDateTime = new Date(`${endDate}T${endHour}`);

      const calendarApi = selectInfo.view.calendar;

      console.log(calendarApi);

      calendarApi.unselect(); // clear date selection

      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          allDay: false
        });
      }

      // try {
      //   const email = localStorage.getItem("email");
       
      // }

      titleInput.value = '';
      startDateInput.value = '';
      endDateInput.value = '';
      startHourInput.value = '';
      endHourInput.value = '';

      modal.style.display = "none";
    }

  }

  // função quando clicar em cima da evento
  // handleEventClick(clickInfo: EventClickArg) {
  //   if (confirm(`Tem certeza que deseja excluir o evento '${clickInfo.event.title}'?`)) {
  //     clickInfo.event.remove();
  //   }
  // }


  // arrumar a função de editar
  handleEventClick(clickInfo: EventClickArg) {
    let modal = document.querySelector(".modalEditEvent") as HTMLElement
    modal.style.display = "block"
    modal.style.position = "absolute";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.zIndex = '2'
    modal.style.backgroundColor = "#fff"
    modal.style.width = "450px"
    modal.style.height = "450px"
    modal.style.borderRadius = "10px"

    const event = clickInfo.event;
    const modalEditEvent = document.querySelector(".modalEditEvent") as HTMLElement;
    const editNameEventInput = document.querySelector('.modalEditEvent input#editNameEvent') as HTMLInputElement;
    const editStartDateInput = document.querySelector('.modalEditEvent input#editStartDate') as HTMLInputElement;
    const editEndDateInput = document.querySelector('.modalEditEvent input#editEndDate') as HTMLInputElement;
    const editStartHourInput = document.querySelector('.modalEditEvent input#editStartHour') as HTMLInputElement;
    const editEndHourInput = document.querySelector('.modalEditEvent input#editEndHour') as HTMLInputElement;

    editNameEventInput.value = event.title;
    if (event.start) {
      editStartDateInput.value = event.start.toISOString().split('T')[0];
      editStartHourInput.value = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Usando toLocaleTimeString para exibir o horário local
    }

    if (event.end) {
      editStartDateInput.value = event.end.toISOString().split('T')[0];
      editEndHourInput.value = event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Usando toLocaleTimeString para exibir o horário local
    }

    // Evento para editar o evento
    const editButton = document.querySelector('.modalEditEvent button[type="submit"]') as HTMLButtonElement;
    editButton.onclick = () => {
      const newTitle = editNameEventInput.value;
      const newStartDate = editStartDateInput.value;
      const newEndDate = editEndDateInput.value;
      const newStartHour = editStartHourInput.value;
      const newEndHour = editEndHourInput.value;

      const newStartDateTime = new Date(`${newStartDate}T${newStartHour}`);
      const newEndDateTime = new Date(`${newEndDate}T${newEndHour}`);

      event.setProp('title', newTitle);
      event.setStart(newStartDateTime);
      event.setEnd(newEndDateTime);

      modalEditEvent.style.display = "none";
    };
  }

  // arrumar a função de editar
  // handleEventClick(clickInfo: EventClickArg) {
  //   const event = clickInfo.event;
  //   const modalEditEvent = document.querySelector(".modalEditEvent") as HTMLElement;
  //   const editNameEventInput = document.querySelector('.modalEditEvent input#editNameEvent') as HTMLInputElement;
  //   const editStartDateInput = document.querySelector('.modalEditEvent input#editStartDate') as HTMLInputElement;
  //   const editEndDateInput = document.querySelector('.modalEditEvent input#editEndDate') as HTMLInputElement;
  //   const editStartHourInput = document.querySelector('.modalEditEvent input#editStartHour') as HTMLInputElement;
  //   const editEndHourInput = document.querySelector('.modalEditEvent input#editEndHour') as HTMLInputElement;

  //   editNameEventInput.value = event.title;
  //   editStartDateInput.value = event.start!.toISOString().split('T')[0];
  //   editEndDateInput.value = event.end!.toISOString().split('T')[0];
  //   editStartHourInput.value = event.start!.toISOString().split('T')[1].slice(0, 5);
  //   editEndHourInput.value = event.end!.toISOString().split('T')[1].slice(0, 5);

  //   modalEditEvent.style.display = "block";

  //   // Evento para editar o evento
  //   const editButton = document.querySelector('.modalEditEvent button[type="submit"]') as HTMLButtonElement;
  //   editButton.onclick = () => {
  //       const newTitle = editNameEventInput.value;
  //       const newStartDate = editStartDateInput.value;
  //       const newEndDate = editEndDateInput.value;
  //       const newStartHour = editStartHourInput.value;
  //       const newEndHour = editEndHourInput.value;

  //       const newStartDateTime = new Date(`${newStartDate}T${newStartHour}`);
  //       const newEndDateTime = new Date(`${newEndDate}T${newEndHour}`);

  //       event.setProp('title', newTitle);
  //       event.setStart(newStartDateTime);
  //       event.setEnd(newEndDateTime);

  //       modalEditEvent.style.display = "none";
  //   };
  // }

  // Outras partes do seu código...
  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // aparece um aviso
  }

  closeModal() {
    const modalAddEvent = document.querySelector(".modalAddEvent") as HTMLElement
    modalAddEvent.style.display = "none"
  }

  closeModalEdit() {
    const modalAddEvent = document.querySelector(".modalEditEvent") as HTMLElement
    modalAddEvent.style.display = "none"
  }

}
