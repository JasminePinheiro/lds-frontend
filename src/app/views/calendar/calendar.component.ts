import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],

})

export class CalendarComponent {
  ngOnInit(): void { }

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
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) {
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

  // como  horário de inicio --Teste 1
  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const title = prompt('Please enter a title for your event');
  //   let time: string | null = null;

  //   if (title) {
  //     // Solicitar horário ao usuário
  //     time = prompt('Please enter a time for your event (HH:mm)');
  //   }

  //   const calendarApi = selectInfo.view.calendar;
  //   calendarApi.unselect(); // clear date selection

  //   if (title && time) {
  //     // Obtenha a data selecionada
  //     const start = selectInfo.start;

  //     // Combine a data selecionada com o horário fornecido pelo usuário
  //     const startWithTime = new Date(start);
  //     const [hours, minutes] = time.split(':');
  //     startWithTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

  //     // Formate a data e hora selecionadas para o formato ISO8601
  //     const startStr = startWithTime.toISOString();
  //     const endStr = startWithTime.toISOString(); // Para um evento com duração de uma hora

  //     calendarApi.addEvent({
  //       id: createEventId(),
  //       title,
  //       start: startStr,
  //       end: endStr,
  //       allDay: false // Este evento não é de dia inteiro
  //     });
  //   }
  // }



  // com o horário de começo e fim --Teste 2
  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const title = prompt('Por favor, digite o nome do evento');
  //   let startTime: any;
  //   let endTime: any;

  //   if (title) {
  //     const start = selectInfo.start;
  //     const end = selectInfo.end;

  //     startTime = prompt('Por favor, digite a hora de início do evento (HH:mm)');
  //     endTime = prompt('Por favor, digite a hora de término do evento (HH:mm)');

  //     if (startTime && endTime) {
  //       const startWithTime = new Date(start);
  //       const [startHours, startMinutes] = startTime.split(':');
  //       startWithTime.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10));

  //       const endWithTime = new Date(end);
  //       const [endHours, endMinutes] = endTime.split(':');
  //       endWithTime.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));

  //       const calendarApi = selectInfo.view.calendar;

  //       calendarApi.unselect();

  //       calendarApi.addEvent({
  //         id: createEventId(),
  //         title,
  //         start: startWithTime.toISOString(),
  //         end: endWithTime.toISOString(),
  //         allDay: false
  //       });
  //     }
  //   }
  // }


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

    addButton.onclick = function () {
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

      titleInput.value = '';
      startDateInput.value = '';
      endDateInput.value = '';
      startHourInput.value = '';
      endHourInput.value = '';
      
      modal.style.display = "none";
    }

  }

  // adicionar evento no calendario
  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const title = prompt('Por favor, digite o nome do evento');
  //   const calendarApi = selectInfo.view.calendar;

  //   calendarApi.unselect(); // clear date selection

  //   if (title) {
  //     calendarApi.addEvent({
  //       id: createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay
  //     });
  //   }
  // }


  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Tem certeza que deseja excluir o evento '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // aparece um aviso
  }

  closeModal() {
    const modalAddEvent = document.querySelector(".modalAddEvent") as HTMLElement
    modalAddEvent.style.display = "none"
  }

}
