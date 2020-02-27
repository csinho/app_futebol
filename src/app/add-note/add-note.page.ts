import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Note, IMAGE } from '../modal/Note';

import { FormBuilder, Validators } from '@angular/forms';


import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';


@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit {

  public title = "Novo Jogador";
  public mes = [];
  public meses = [{ nome: "", valor: 0, status: false }];

  public note: Note;



  // Upload Task 
  public task: AngularFireUploadTask;

  // Progress in percentage
  public percentage: Observable<number>;

  // Snapshot of uploading file
  public snapshot: Observable<any>;

  // Uploaded File URL
  public UploadedFileURL: Observable<string>;

  //Uploaded Image List
  public images: Observable<IMAGE[]>;

  public filepath: string;

  //File details  
  public fileName: string;
  public fileSize: number;

  //Status check 
  public isUploading: boolean;
  public isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<IMAGE>;

  get nome() {
    return this.registrationForm.get('nome');
  }
  get apelido() {
    return this.registrationForm.get('apelido');
  }

  public errorMessages = {
    nome: [
      { type: 'required', message: 'Nome é requerido!' },
      { type: 'maxlength', message: "O tamanho máximo para o nome é de 50 caracteres" }
    ],
    apelido: [
      { type: 'required', message: 'Apelido é requerido!' },
      { type: 'maxlength', message: "O tamanho máximo para o apelido é de 500 caracteres" }
    ]
  };

  registrationForm = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.maxLength(50)]],
    apelido: ['', [Validators.required, Validators.maxLength(50)]],
  });


  constructor(
    private activatedRoute: ActivatedRoute,
    private fbService: FirebaseService,
    private toastCtrl: ToastController,
    private router: Router,

    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private database: AngularFirestore
  ) {

    this.isUploading = false;
    this.isUploaded = false;
    //Definir coleção onde as informações de nossos documentos / imagens serão salvas
    this.imageCollection = database.collection<IMAGE>('infoJogadores');

    this.images = this.imageCollection.valueChanges();

  }

  public submit() {
    this.note.title = this.registrationForm.value.nome;
    this.note.content = this.registrationForm.value.apelido;
    // this.addNote();
  }


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
    const path = `infoJogadores/${new Date().getTime()}_${file.name}`;

    // Metadados totalmente opcionais
    const customMetadata = { app: 'Demonstração de Upload de Imagens Muito Louca' };

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
            id: '',
            title: this.registrationForm.value.nome, // nome
            content: this.registrationForm.value.apelido, //descrição
            createdAt: new Date().getTime(), //data de criação
            image: {
              name: file.name,
              filepath: resp,
              size: this.fileSize,
            },
            status_jogador: 0,
            meses: this.meses
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

  addImagetoDB(image: IMAGE) {

    //Crie um ID para o documento
    const id = this.database.createId();

    this.addNote(image, id);
    //Definir identificação do documento com valor no banco de dados
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }




  ngOnInit() {
    var arrayMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    var data = new Date();

    for (let i = 0, x = data.getMonth() - 1; i < 13; i++) {
      this.mes.push(arrayMes[++x % 12].toUpperCase());
    }

    this.mes.forEach(item => {
      this.meses.push({ nome: item, valor: 0, status: false })
    });

    this.meses = this.meses.filter(function (obj) {
      return obj.nome != "";
    });


    this.note = {
      title: '',
      content: '',
      createdAt: new Date().getTime(),
      image: {
        name: this.fileName,
        filepath: this.filepath,
        size: this.fileSize,
      },
      status_jogador: 0,
      meses: this.meses
    }

  }

  addNote(image, id) {

    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });

    console.log(this.note)
    /*  this.fbService.addNote(this.note).then(() => {
        this.router.navigateByUrl('/list');
      }, err => {
      }); */
  }

}
