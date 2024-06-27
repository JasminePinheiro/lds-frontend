export interface Task {
    email?: string;
    uuid?: string;
    title: string;
    description?: string;
    dueDate?: Date;
    priority?: string; 
    completed: boolean;
  }