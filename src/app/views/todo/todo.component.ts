import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../../controllers/models/task';



@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {

  
  tasks: Task[] = [];
  newTask: Task = { title: '', completed: false }; 
  showTaskForm = false;
  firestore = inject(Firestore); 
  
  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTasks(); 
    }
  }

  async loadTasks() {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) return;

    this.tasks = []; // Limpa a lista antes de carregar

    const q = query(collection(this.firestore, 'tasks'), where('id', '==', userEmail));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc)
      this.tasks.push({ email: doc.id, ...(doc.data() as Task) });
   
    });
  }

  async addTask() {
    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail || !this.newTask.title) return; 

      const taskToAdd: Task = { ...this.newTask, email: userEmail, uuid:  uuidv4()}; 
      const docRef = await addDoc(collection(this.firestore, 'tasks'), taskToAdd);
      this.tasks.push({ email: docRef.id, ...taskToAdd });

      // Limpa o formulário após adicionar
      this.newTask = { title: '', completed: false };
      this.showTaskForm = false; 
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  }

  async deleteTask(task: Task) {
    try {
      if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
        const taskQuery = query(
          collection(this.firestore, 'tasks'),
          where('uuid', '==', task.uuid)
        );

        const querySnapshot = await getDocs(taskQuery);
        const taskDoc = querySnapshot.docs[0];
        if (!taskDoc) {
          console.error('Tarefa não encontrada:', task);
          return;
        }

        await deleteDoc(doc(this.firestore, 'tasks', taskDoc.id));
        this.tasks = this.tasks.filter((t) => t.uuid !== task.uuid);

        console.log('Tarefa excluída:', task);

        }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  }

  async toggleTaskCompletion(task: Task) {
    console.log('Tarefa:', task);
    console.log('Tarefa:', task.completed);
    console.log(!task.completed);

    try {
      const taskQuery = query(
        collection(this.firestore, 'tasks'),
        where('uuid', '==', task.uuid)
      );
      const querySnapshot = await getDocs(taskQuery);
      const taskDoc = querySnapshot.docs[0];
      if (!taskDoc) {
        console.error('Tarefa não encontrada:', task);
        return;
      }

      await updateDoc(doc(this.firestore, 'tasks', taskDoc.id), {
        completed: task.completed
      });

      console.log('Tarefa atualizada:', task);
    } catch (error) {
      console.error('Erro ao atualizar o status da tarefa:', error);
    }
  }

}


