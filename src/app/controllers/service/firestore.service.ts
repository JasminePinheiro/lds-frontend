import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { UserProjectModel } from '../../controllers/models/user-project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private firestore: Firestore) {}

  async getProjectsByUsername(username: string): Promise<UserProjectModel[]> {
    const projects: UserProjectModel[] = [];
    const projectsQuery = query(collection(this.firestore, 'projects'), where('username', '==', username));
    const querySnapshot = await getDocs(projectsQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data() as UserProjectModel;
      projects.push(data);
    });
    return projects;
  }
}
