import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Note} from '../modal/Note';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  public title = "Lista de Jogadores";

  private notes: Observable<Note[]>;
  
  constructor(
    private fbService: FirebaseService) {}

  ngOnInit(): void {
    this.notes = this.fbService.getNotes();
  }

}
