import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { Task } from '../models/task';



@Injectable({
  providedIn: 'root',
})
export class TaskService {
  firestore = inject(Firestore);

  constructor() {}

  async getUpcomingTasks(username: string, limitTo: number = 5): Promise<Task[]> {
    const tasks: Task[] = [];
    const currentDate = new Date().getTime(); 

    const q = query(
      collection(this.firestore, 'tasks'),
      where('id', '==', username),
      where('completed', '==', false), // Somente tarefas não concluídas
      limit(limitTo) 
    );




    const querySnapshot = await getDocs(q);

        console.log(querySnapshot);

    querySnapshot.forEach((doc) => {
      const data = doc.data() as Task;
      // Converter o dueDate de timestamp para Date
      if (data.dueDate) {
        data.dueDate = new Date(data.dueDate); 
      }
      tasks.push(data);
    });

    return tasks;
  }
}