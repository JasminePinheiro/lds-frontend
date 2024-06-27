import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../../controllers/models/note';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent {
  notes: Note[] = [];
  newNote: Note = { title: '', content: '', email: '', uuid: '' };
  editingNote: Note | null = null;
  firestore = inject(Firestore);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadNotes();
    }
  }

  async loadNotes() {
    const userEmail = localStorage.getItem('email');
    if (!userEmail) return;

    this.notes = [];

    const q = query(
      collection(this.firestore, 'notes'),
      where('email', '==', userEmail),
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      this.notes.push({ ...(doc.data() as Note), uuid: doc.id });
    });
  }

  async addNote() {
    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail || !this.newNote.title || !this.newNote.content) return;

      const noteToAdd: Note = {
        ...this.newNote,
        email: userEmail,
        uuid: uuidv4(),
      };
      const docRef = await addDoc(
        collection(this.firestore, 'notes'),
        noteToAdd,
      );
      this.notes.push({ ...noteToAdd, uuid: docRef.id });

      this.newNote = { title: '', content: '', email: '', uuid: '' };
    } catch (error) {
      console.error('Erro ao adicionar nota:', error);
    }
  }

  async deleteNote(note: Note) {
    try {
      if (confirm('Tem certeza que deseja excluir esta nota?')) {
        await deleteDoc(doc(this.firestore, 'notes', note.uuid));
        this.notes = this.notes.filter((n) => n.uuid !== note.uuid);
      }
    } catch (error) {
      console.error('Erro ao excluir nota:', error);
    }
  }

  startEditing(note: Note) {
    this.editingNote = { ...note };
  }

  async saveEdit() {
    try {
      if (this.editingNote && this.editingNote.uuid) {
        await updateDoc(
          doc(this.firestore, 'notes', this.editingNote.uuid),
          this.editingNote as { [x: string]: any },
        );
        const index = this.notes.findIndex(
          (n) => n.uuid === this.editingNote?.uuid,
        );
        if (index !== -1) {
          this.notes[index] = this.editingNote;
        }
        this.editingNote = null;
      }
    } catch (error) {
      console.error('Erro ao salvar nota editada:', error);
    }
  }

  cancelEdit() {
    this.editingNote = null;
  }
}


