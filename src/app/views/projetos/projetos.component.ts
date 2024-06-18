import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule para ngModel
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { CalendarComponent } from '../calendar/calendar.component';
import { v4 as uuidv4 } from 'uuid';


interface Task {
  id: string;
  task_name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
}

interface Column {
  name: string;
  tasks: Task[];
}

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent], // Adicione CommonModule, FormsModule e CalendarComponent
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})

export class ProjetosComponent implements OnInit {
  columns: Column[] = [];
  isNewProjectModalOpen = false;
  newProjectName = '';
  firestore = inject(Firestore);
  selectedTask: Task | null = null;
  selectedColumn: Column | null = null;
  id: any


  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeKanbanBoard();
    }
  }

  async initializeKanbanBoard() {
    this.columns = [];
    const querySnapshot = await getDocs(collection(this.firestore, 'projects'));
    console.log(querySnapshot.docs);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Column;
      this.columns.push(data);
    });
  }

  openNewProjectModal() {
    this.isNewProjectModalOpen = true;
  }

  closeNewProjectModal() {
    this.isNewProjectModalOpen = false;
  }


  // Adicionando uma tarefa no projeto
  async addTask(column: Column) {
    const newTaskDescription = prompt('Digite a descrição da tarefa:');
    const newTaskStartDate = prompt('Digite a data de início (YYYY-MM-DD):');
    const newTaskEndDate = prompt('Digite a data de fim (YYYY-MM-DD):');
    const newTaskName = prompt('Digite o nome da tarefa:');

    if (newTaskDescription && newTaskStartDate && newTaskEndDate && newTaskName) {

      const querySnapshot = await getDocs(collection(this.firestore, 'projects'));
      let projectDocRef: any;

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Column;
        if (data.name === column.name) {
          projectDocRef = doc.ref;
        }
      });

      if (projectDocRef) {

        const newTask: Task = { id: uuidv4(), task_name: newTaskName, description: newTaskDescription, startDate: new Date(newTaskStartDate), endDate: new Date(newTaskEndDate) };
        column.tasks.push(newTask);

        // Atualizar o documento do projeto com a nova tarefa
        await updateDoc(projectDocRef, { tasks: column.tasks });

        // Adicionar a tarefa ao calendário
        this.addTaskToCalendar(newTask);
      } else {
        console.error('Projeto não encontrado para a coluna fornecida.');
      }
    }
  }

  // Adicionando um projeto
  async addProject() {
    if (this.newProjectName.trim()) {
      this.columns.push({ name: this.newProjectName, tasks: [] });
      await addDoc(collection(this.firestore, 'projects'), { name: this.newProjectName, tasks: [] });
      this.newProjectName = '';
      this.closeNewProjectModal();
    }

    this.newProjectName = '';
  }

  editTask(task: Task) {
    this.selectedTask = task;
  }

  // async updateTask() {
  //   if (this.selectedColumn && this.selectedTask) {
  //     const updatedTaskIndex = this.selectedColumn.tasks.findIndex(t => t.id === this.selectedTask!.id);
  //     if (updatedTaskIndex !== -1) {
  //       this.selectedColumn.tasks[updatedTaskIndex] = this.selectedTask!;
  //       await updateDoc(doc(this.firestore, 'projects', this.selectedColumn.tasks[updatedTaskIndex].id.toString()), { tasks: this.selectedColumn.tasks });

  //       this.selectedTask = null;
  //     }
  //   }
  // }


  // ***** Arrumar as datas *****
  addTaskToCalendar(task: Task) {
    addDoc(collection(this.firestore, 'eventos'), {
      end_date: task.endDate?.getTime(),
      event_name: task.task_name,
      start_date: task.startDate?.getTime(),
      description: task.description,
      username: 'email!'
    });
  }

  async removeTaskFromCalendar(task: Task) {
    const querySnapshot = await getDocs(collection(this.firestore, 'eventos'));
    querySnapshot.forEach(async (doc) => {
      const data = doc.data() as Task;
      console.log(data.id);
      if (data.id === task.id) {
        await deleteDoc(doc.ref);
      }
    });
  }

  async excludeTask(column: Column, task: Task) {
    column.tasks = column.tasks.filter(t => t.id !== task.id);

    const querySnapshot = await getDocs(collection(this.firestore, 'projects'));
    querySnapshot.forEach(async (doc) => {
      const data = doc.data() as Column;
      if (data.name === column.name) {
        await updateDoc(doc.ref, { tasks: column.tasks });
      }
    });


    this.removeTaskFromCalendar(task);
  }

  async excludeProject(column: Column) {
    this.columns = this.columns.filter(c => c.name !== column.name);
    const querySnapshot = await getDocs(collection(this.firestore, 'projects'));
    querySnapshot.forEach(async (doc) => {
      const resultado = doc.data() as Column;
      if (resultado.name === column.name) {
        await deleteDoc(doc.ref);
      }
    });
  }
}


