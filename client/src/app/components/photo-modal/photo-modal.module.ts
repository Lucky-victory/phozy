import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoModalComponent } from './photo-modal.component';



@NgModule({
  declarations: [PhotoModalComponent],
  imports: [
    CommonModule
  ],
  exports: [PhotoModalComponent
  ]
})
export class PhotoModalModule { }
