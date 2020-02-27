import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../modal/Note';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from '@angular/fire/firestore';
import {map, take} from 'rxjs/operators';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
//import { finalize, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  private notes: Observable<Note[]>;
  private noteCollection: AngularFirestoreCollection<Note>;
  
  //public images: Observable<MyData[]>;
  //private imageCollection: AngularFirestoreCollection<MyData>;
  
  // Upload Task 
  public task: AngularFireUploadTask;

  // Progress in percentage
  public percentage: Observable<number>;

  // Snapshot of uploading file
  public snapshot: Observable<any>;

  // Uploaded File URL
  public UploadedFileURL: Observable<string>;

  
  //File details  
  public fileName: string;
  public fileSize: number;

  //Status check 
  public isUploading: boolean;
  public isUploaded: boolean;


  constructor(
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private afs: AngularFirestore 
    ) {
    this.noteCollection = this.afs.collection<Note>('notes');
    this.notes = this.noteCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
    );

    this.isUploading = false;
    this.isUploaded = false;

    //Definir coleção onde as informações de nossos documentos / imagens serão salvas
    this.noteCollection =  afs.collection<Note>('notes');

    //this.images = this.noteCollection.valueChanges();

  }

  getNotes(): Observable<Note[]> {
    return this.notes;
  }

  getNote(id: string): Observable<Note> {
    return this.noteCollection.doc<Note>(id).valueChanges().pipe(
        take(1),
        map(note => {
          note.id = id;
          return note;
        })
    );
  }

  addNote(note: Note): Promise<DocumentReference> {
    return this.noteCollection.add(note);
  }

  updateNote(note: Note): Promise<void> {
    return this.noteCollection.doc(note.id).update({ title: note.title, content: note.content });
  }

  deleteNote(id: string): Promise<void> {
    return this.noteCollection.doc(id).delete();
  }

  /*-------------------------------------------------------------------------------------------------

  uploadFile(event: FileList) {

    // O objeto File
    const file = event.item(0)

    // Validação apenas para imagens
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // O caminho de armazenamento
    const path = `freakyStorage/${new Date().getTime()}_${file.name}`;

    // Metadados totalmente opcionais
    const customMetadata = { app: 'Freaky Image Upload Demo' };

    //Referência de arquivo
    const fileRef = this.storage.ref(path);

    // A tarefa principal
    this.task = this.storage.upload(path, file, { customMetadata });

    //Obter porcentagem de progresso do arquivo
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Obter o caminho de armazenamento de arquivos enviados
        this.UploadedFileURL = fileRef.getDownloadURL();



        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        })
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    )
  }

  addImagetoDB(image: Note) {
    //Crie um ID para o documento
    const id = this.database.createId();

    //Definir identificação do documento com valor no banco de dados
    this.noteCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }
 */

}
