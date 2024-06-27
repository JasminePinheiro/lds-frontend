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
import { Note } from '../models/note';


@Injectable({
  providedIn: 'root',
})
export class NoteService {
  firestore = inject(Firestore);

  constructor() {}

  async getRecentNotes(username: string, limitTo: number = 5): Promise<Note[]> {
    const notes: Note[] = [];

    const q = query(
      collection(this.firestore, 'notes'),
      where('email', '==', username),
      limit(limitTo)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      notes.push({ ...(doc.data() as Note), uuid: doc.id });
    });
    console.log(notes);
    return notes;
  }
}