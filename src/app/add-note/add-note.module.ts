import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { AddNotePageRoutingModule } from './add-note-routing.module';
import { FileSizeFormatPipe } from '../file-size-format.pipe';

import { AddNotePage } from './add-note.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddNotePageRoutingModule
  ],
  declarations: [AddNotePage,FileSizeFormatPipe]
})
export class AddNotePageModule {}
