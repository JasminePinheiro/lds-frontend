import { Component, signal, ChangeDetectorRef, OnInit, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';


import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { EventModel } from '../../controllers/models/event-user';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],

})

export class CalendarComponent {

  constructor(private changeDetector: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.calendarVisible.set(true);
      this.loadEventsToCalendar();
    }
  }

  firestore = inject(Firestore);
  currentEvents = signal<EventApi[]>([]);
  calendarVisible = signal(false);
  selectedEvent: EventApi | null = null;


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
    initialEvents: INITIAL_EVENTS,
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
  });


  // Obtém os eventos do Firebase e adiciona ao calendário
  async loadEventsToCalendar() {
    const events = await this.getEventsFromFirebase();
    this.calendarOptions.update(options => ({
      ...options,
      events: events
    }));
  }


  // Função que pega os dados do firebase e adiciona no calendário
  async getEventsFromFirebase(): Promise<EventInput[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'eventos'));
    const events: EventInput[] = [];
    querySnapshot.forEach(doc => {
      const eventData = doc.data() as EventModel;

      const startDate = eventData.start_date instanceof Date
        ? eventData.start_date
        : new Date(eventData.start_date as number);

      const endDate = eventData.end_date instanceof Date
        ? eventData.end_date
        : new Date(eventData.end_date as number);

      events.push({
        id: doc.id,
        title: eventData.event_name,
        start: startDate,
        end: endDate,
        allDay: false,
        extendedProps: {
          description: eventData.description // adiciona mais campos nos eventos do calendário
        }
      });
    });
    return events;
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

  // ***** Modal que adicionar um evento *****
  async handleDateSelect(selectInfo: DateSelectArg) {
    let modal = document.querySelector(".modalAddEvent") as HTMLElement
    modal.style.display = "block"
    modal.style.position = "absolute";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.zIndex = '2';
    modal.style.backgroundColor = "#fff";
    modal.style.width = "450px";
    modal.style.height = "500px";

    const addButton = document.querySelector('.modalAddEvent button[type="submit"]') as HTMLButtonElement;

    addButton.onclick = async () => {
      const titleInput = document.querySelector('.modalAddEvent input#nameEvent') as HTMLInputElement;
      const descriptionInput = document.querySelector('.modalAddEvent textarea#descriptionEvent') as HTMLInputElement;
      const startDateInput = document.querySelector('.modalAddEvent input#startDate') as HTMLInputElement;
      const endDateInput = document.querySelector('.modalAddEvent input#endDate') as HTMLInputElement;
      const startHourInput = document.querySelector('.modalAddEvent input#startHour') as HTMLInputElement;
      const endHourInput = document.querySelector('.modalAddEvent input#endHour') as HTMLInputElement;

      const title = titleInput.value
      const description = descriptionInput.value;
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      const startHour = startHourInput.value;
      const endHour = endHourInput.value;

      const startDateTime = new Date(`${startDate}T${startHour}`);
      const endDateTime = new Date(`${endDate}T${endHour}`);

      const calendarApi = selectInfo.view.calendar;

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

      try {
        if (typeof localStorage !== 'undefined') {

          let email = localStorage.getItem("email");
          const newEvent: EventModel = {
            end_date: endDateTime.getTime(),
            event_name: title,
            start_date: startDateTime.getTime(),
            username: email!,
            description: description,
          }

          await addDoc(collection(this.firestore, 'eventos'), newEvent)

          titleInput.value = '';
          startDateInput.value = '';
          endDateInput.value = '';
          startHourInput.value = '';
          endHourInput.value = '';
          descriptionInput.value = '';

        } else {
          throw Error("LocalStorage undefined");
        }

      } catch (error) {
        throw error;
      }
      modal.style.display = "none";
    }

  }

  // ***** Modal que edita o evento *****
  handleEventClick(clickInfo: EventClickArg) {
    this.selectedEvent = clickInfo.event;

    let modal = document.querySelector(".modalEditEvent") as HTMLElement
    modal.style.display = "block"
    modal.style.position = "absolute";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.zIndex = '2';
    modal.style.backgroundColor = "#fff";
    modal.style.width = "450px";
    modal.style.width = "450px";
    modal.style.height = "500px";

    const event = clickInfo.event;

    const modalEditEvent = document.querySelector(".modalEditEvent") as HTMLElement;
    const editNameEventInput = document.querySelector('.modalEditEvent input#editNameEvent') as HTMLInputElement;
    const editDescriptionEventInput = document.querySelector('.modalEditEvent textarea#editDescriptionEvent') as HTMLInputElement;
    const editStartDateInput = document.querySelector('.modalEditEvent input#editStartDate') as HTMLInputElement;
    const editEndDateInput = document.querySelector('.modalEditEvent input#editEndDate') as HTMLInputElement;
    const editStartHourInput = document.querySelector('.modalEditEvent input#editStartHour') as HTMLInputElement;
    const editEndHourInput = document.querySelector('.modalEditEvent input#editEndHour') as HTMLInputElement;

    editNameEventInput.value = event.title;

    if (event.start) {
      const startDate = new Date(event.start);
      const dia = startDate.toLocaleDateString('pt-BR', { day: '2-digit' });
      const mes = startDate.toLocaleDateString('pt-BR', { month: '2-digit' });
      const ano = startDate.toLocaleDateString('pt-BR', { year: 'numeric' });
      editStartDateInput.value = `${ano}-${mes}-${dia}`;
      editStartHourInput.value = startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    if (event.end) {
      const endDate = new Date(event.end);
      const dia = endDate.toLocaleDateString('pt-BR', { day: '2-digit' });
      const mes = endDate.toLocaleDateString('pt-BR', { month: '2-digit' });
      const ano = endDate.toLocaleDateString('pt-BR', { year: 'numeric' });
      editEndDateInput.value = `${ano}-${mes}-${dia}`;
      editEndHourInput.value = endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    editDescriptionEventInput.value! = event.extendedProps['description'] || '';

    const editButton = document.querySelector('.modalEditEvent button[type="submit"]') as HTMLButtonElement;

    editButton.onclick = async () => {
      const newTitle = editNameEventInput.value;
      const newDescription = editDescriptionEventInput.value;
      const newStartDate = editStartDateInput.value;

      const newEndDate = editEndDateInput.value;
      const newStartHour = editStartHourInput.value;
      const newEndHour = editEndHourInput.value;
      const newStartDateTime = new Date(`${newStartDate}T${newStartHour}`);
      const newEndDateTime = new Date(`${newEndDate}T${newEndHour}`);
  
      event.setProp('title', newTitle);
      event.setStart(newStartDateTime);
      event.setEnd(newEndDateTime);
      event.setExtendedProp('description', newDescription);


      try {
        const eventRef = doc(this.firestore, 'eventos', this.selectedEvent!.id); // Referência ao documento
        await updateDoc(eventRef, {
          event_name: newTitle,
          description: newDescription,
          start_date: newStartDateTime.getTime(),
          end_date: newEndDateTime.getTime(),
        });

        console.log('Evento atualizado com sucesso');
      } catch (error) {
        console.error('Erro ao atualizar o evento:', error);
      }

      modalEditEvent.style.display = "none";
    };
  }

  // Função remover evento
  async handleRemoveEvent() {
    if (this.selectedEvent) {
      if (confirm(`Tem certeza que deseja excluir o evento '${this.selectedEvent.title}'?`)) {
        try {
          await deleteDoc(doc(this.firestore, 'eventos', this.selectedEvent.id));
          this.selectedEvent.remove();
          this.selectedEvent = null;

          const modal = document.querySelector(".modalEditEvent") as HTMLElement;
          modal.style.display = "none";
        } catch (error) {
          console.error("Erro ao remover o evento: ", error);
        }
      }
    }
  }

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
