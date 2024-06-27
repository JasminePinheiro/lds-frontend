import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserProjectModel } from '../../controllers/models/user-project';
import { ProjectService } from '../../controllers/service/firestore.service';
import { TaskService } from '../../controllers/service/task.service';
import { NoteService } from '../../controllers/service/notes.service';
import { Note } from '../../controllers/models/note';
import { Task } from '../../controllers/models/task';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  projects: UserProjectModel[] = [];
  totalProjects: number = 0;
  totalTasks: number = 0;
  upcomingTasks: Task[] = [];
  recentNotes: Note[] = [];
  loading: boolean = true; // Propriedade para controlar o carregamento

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private projectService: ProjectService,
    private taskService: TaskService, 
    private noteService: NoteService  
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  async loadDashboardData() {
    const username = localStorage.getItem('email');
    if (!username) {
      console.error('Usuário não encontrado');
      this.loading = false;
      return;
    }

    this.projects = await this.projectService.getProjectsByUsername(username);
    this.totalProjects = this.projects.length;
    this.totalTasks = this.projects.reduce((sum, project) => sum + project.tasks.length, 0);

    await this.loadUpcomingTasks(username);
    await this.loadRecentNotes(username);
    this.loading = false; // Dados carregados, desative o indicador de carregamento
  }

  async loadUpcomingTasks(username: string) {
    this.upcomingTasks = await this.taskService.getUpcomingTasks(username);
  }

  async loadRecentNotes(username: string) {
    this.recentNotes = await this.noteService.getRecentNotes(username); 
  }
}