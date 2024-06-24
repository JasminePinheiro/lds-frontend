import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { CalendarComponent } from '../calendar/calendar.component';
import { v4 as uuidv4 } from 'uuid';
import { UserProjectModel } from '../../controllers/models/user-project';
import { UserProjectTaskModel } from '../../controllers/models/user-project-task';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})

export class ProjetosComponent implements OnInit {
  columns: UserProjectModel[] = [];
  isNewProjectModalOpen = false;
  newProjectName = '';
  firestore = inject(Firestore);
  selectedTask: UserProjectTaskModel | null = null;
  selectedColumn: UserProjectModel | null = null;
  id: any;
  isEditProjectModalOpen = false;
  editProjectName = '';
  currentProject: UserProjectModel | null = null;


  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeKanbanBoard();
    }
  }


  async initializeKanbanBoard() {
    this.columns = [];
    const username = localStorage.getItem('email');
    if (!username) {
      console.error('Usuario não encontrado');
      return;
    }

    const projectsQuery = query(collection(this.firestore, 'projects'), where('username', '==', username));
    const querySnapshot = await getDocs(projectsQuery); querySnapshot.forEach((doc) => {
      const data = doc.data() as UserProjectModel;
      this.columns.push(data);
    });
  }

  // Função de adicionar projeto
  async addProject() {
    if (this.newProjectName.trim()) {
      this.columns.push({ name: this.newProjectName, tasks: [], username: localStorage.getItem("email")! });
      await addDoc(collection(this.firestore, 'projects'), { name: this.newProjectName, tasks: [], username: localStorage.getItem("email")! });
      this.newProjectName = '';
      this.closeNewProjectModal();
    }

    this.newProjectName = '';
  }


  // Função de editar projeto
  async editProject() {
    if (!this.currentProject) {
      return;
    }

    const newProjectName = this.editProjectName;

    this.columns = this.columns.map(c => c.name === this.currentProject!.name ? { ...c, name: newProjectName } : c);

    const querySnapshot = await getDocs(collection(this.firestore, 'projects'));

    querySnapshot.forEach(async (doc) => {
      const data = doc.data() as UserProjectModel;
      if (data.name === this.currentProject!.name) {
        await updateDoc(doc.ref, { name: newProjectName });
        this.closeEditProjectModal();

      }
    });
  }


  // Função de excluir projeto
  async excludeProject(column: UserProjectModel) {
    // Excluir todas as tarefas do calendário
    for (const task of column.tasks) {
      await this.removeTaskFromCalendar(task);
    }

    this.columns = this.columns.filter(c => c.name !== column.name);

    const querySnapshot = await getDocs(collection(this.firestore, 'projects'));
    querySnapshot.forEach(async (doc) => {
      const resultado = doc.data() as UserProjectModel;
      if (resultado.name === column.name) {
        await deleteDoc(doc.ref);
      }
    });
  }

  // Função de adicionar tarefa no projeto
  async addTask(column: UserProjectModel) {
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

      if (title && description && startDate && startDateTime && endDateTime) {

        const querySnapshot = await getDocs(collection(this.firestore, 'projects'));
        let projectDocRef: any;

        querySnapshot.forEach((doc) => {
          const data = doc.data() as UserProjectModel;
          if (data.name === column.name) {
            projectDocRef = doc.ref;
          }
        });

        if (projectDocRef) {
          if (typeof localStorage !== "undefined") {
            let email = localStorage.getItem('email');
            const newTask: UserProjectTaskModel = { id: uuidv4(), task_name: title, description: description, startDate: startDateTime!.getTime(), endDate: endDateTime.getTime(), username: email! };
            column.tasks.push(newTask);

            titleInput.value = '';
            startDateInput.value = '';
            endDateInput.value = '';
            startHourInput.value = '';
            endHourInput.value = '';
            descriptionInput.value = '';

            // Atualizar o documento do projeto com a nova tarefa
            await updateDoc(projectDocRef, { tasks: column.tasks });

            // Adicionar a tarefa ao calendário
            this.addTaskToCalendar(newTask);
          }
        } else {
          console.error('Projeto não encontrado para a coluna fornecida.');
        }
        modal.style.display = "none";
      }
    }
  }

  // Função de editar tarefa do projeto
  async editTask(column: UserProjectModel, task: UserProjectTaskModel) {
    this.selectedTask = task;
    this.selectedColumn = column;

    let modal = document.querySelector(".modalEditEvent") as HTMLElement
    modal.style.display = "block"
    modal.style.position = "absolute";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.zIndex = '2';
    modal.style.backgroundColor = "#fff";
    modal.style.width = "450px";
    modal.style.height = "500px";

    const editNameEventInput = document.querySelector('.modalEditEvent input#editNameEvent') as HTMLInputElement;
    const editDescriptionEventInput = document.querySelector('.modalEditEvent textarea#editDescriptionEvent') as HTMLInputElement;
    const editStartDateInput = document.querySelector('.modalEditEvent input#editStartDate') as HTMLInputElement;
    const editEndDateInput = document.querySelector('.modalEditEvent input#editEndDate') as HTMLInputElement;
    const editStartHourInput = document.querySelector('.modalEditEvent input#editStartHour') as HTMLInputElement;
    const editEndHourInput = document.querySelector('.modalEditEvent input#editEndHour') as HTMLInputElement;

    editNameEventInput.value = task.task_name;
    editDescriptionEventInput.value = task.description;

    if (task.startDate) {
      const startDate = new Date(task.startDate);
      const dia = startDate.toLocaleDateString('pt-BR', { day: '2-digit' });
      const mes = startDate.toLocaleDateString('pt-BR', { month: '2-digit' });
      const ano = startDate.toLocaleDateString('pt-BR', { year: 'numeric' });
      editStartDateInput.value = `${ano}-${mes}-${dia}`;
      editStartHourInput.value = startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    if (task.endDate) {
      const endDate = new Date(task.endDate);
      const dia = endDate.toLocaleDateString('pt-BR', { day: '2-digit' });
      const mes = endDate.toLocaleDateString('pt-BR', { month: '2-digit' });
      const ano = endDate.toLocaleDateString('pt-BR', { year: 'numeric' });
      editEndDateInput.value = `${ano}-${mes}-${dia}`;
      editEndHourInput.value = endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

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
      const taskIndex = this.selectedColumn!.tasks.findIndex(t => t.id === this.selectedTask!.id);

      const updatedTask: UserProjectTaskModel = {
        id: this.selectedTask!.id,
        task_name: newTitle,
        description: newDescription,
        startDate: newStartDateTime.getTime(),
        endDate: newEndDateTime.getTime(),
        username: localStorage.getItem("email") || ''
      };

      if (taskIndex !== -1) {
        this.selectedColumn!.tasks[taskIndex] = updatedTask;

        // Atualizar o documento do projeto com a tarefa editada
        const querySnapshot = await getDocs(collection(this.firestore, 'projects'));
        querySnapshot.forEach(async (doc) => {
          const data = doc.data() as UserProjectModel;
          if (data.name === this.selectedColumn!.name) {
            await updateDoc(doc.ref, { tasks: this.selectedColumn!.tasks });
          }
        });

        // Atualizar a tarefa no calendário
        this.updateTaskInCalendar(updatedTask);

        this.selectedTask = null;
        this.selectedColumn = null;
        this.closeModalEdit();
      }
    }
  }

  // Função que atualiza tarefa no calendário
  async updateTaskInCalendar(task: UserProjectTaskModel) {
    const taskQuery = query(
      collection(this.firestore, 'eventos'),
      where('id', '==', task.id)
    );
    const querySnapshot = await getDocs(taskQuery);
    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, {
        event_name: task.task_name,
        description: task.description,
        start_date: task.startDate,
        end_date: task.endDate,
      });
    });
  }


  openNewProjectModal() {
    this.isNewProjectModalOpen = true;
  }

  closeNewProjectModal() {
    this.isNewProjectModalOpen = false;
  }

  // Função para abrir o modal de edição de projeto
  openEditProjectModal(project: UserProjectModel) {
    this.currentProject = project;
    this.editProjectName = project.name;
    this.isEditProjectModalOpen = true;
  }

  // Função para fechar o modal de edição de projeto
  closeEditProjectModal() {
    this.isEditProjectModalOpen = false;
    this.editProjectName = '';
    this.currentProject = null;
  }

  // Função de adicionar tarefa no calendário
  addTaskToCalendar(task: UserProjectTaskModel) {

    if (typeof localStorage !== 'undefined') {

      let email = localStorage.getItem("email")
      addDoc(collection(this.firestore, 'eventos'), {

        id: task.id,
        end_date: task.endDate,
        event_name: task.task_name,
        start_date: task.startDate,
        description: task.description,
        username: email
      });

    }
  }

  // Função de remover tarefa do calendário
  async removeTaskFromCalendar(task: UserProjectTaskModel) {
    const taskQuery = query(
      collection(this.firestore, 'eventos'),
      where('id', '==', task.id)
    );
    const querySnapshot = await getDocs(taskQuery);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  // Função de excluir tarefa do projeto
  async excludeTask(column: UserProjectModel, task: UserProjectTaskModel) {
    column.tasks = column.tasks.filter(t => t.id !== task.id);

    const querySnapshot = await getDocs(collection(this.firestore, 'projects'));
    querySnapshot.forEach(async (doc) => {
      const data = doc.data() as UserProjectModel;
      if (data.name === column.name) {
        await updateDoc(doc.ref, { tasks: column.tasks });
      }
    });

    this.removeTaskFromCalendar(task);
  }

  // Função de fechar modal de adicionar tarefas
  closeModal() {
    const modalAddEvent = document.querySelector(".modalAddEvent") as HTMLElement
    modalAddEvent.style.display = "none"
  }

  // Função de fechar modal de editar tarefas
  closeModalEdit() {
    const modalAddEvent = document.querySelector(".modalEditEvent") as HTMLElement
    modalAddEvent.style.display = "none"
  }

}


