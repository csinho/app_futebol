import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Note } from '../modal/Note';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit {

  public title = "Novo Jogador";
  public mes = [];

  public note: Note;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fbService: FirebaseService,
    private toastCtrl: ToastController,
    private router: Router
  ) {

  }

  ngOnInit() {
    var arrayMes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    var data = new Date();

    for (let i = 0, x = data.getMonth() - 1; i < 13; i++) {
      this.mes.push(arrayMes[++x % 12].toUpperCase());
    }

    this.note = {
      title: '',
      content: '',
      createdAt: new Date().getTime(),
      image: '',
      status_jogador: '',
      meses: {
        mes: {
          nome: '',
          valor: '',
          status: false,
        }
      }
    }
  }

  addNote() {
    console.log(this.note)

    this.fbService.addNote(this.note).then(() => {
      this.router.navigateByUrl('/list');
    }, err => {
    });
  }


}
