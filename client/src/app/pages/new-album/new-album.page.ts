import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/services/api.service';
import { INewAlbumForm } from '../../interfaces/new-album.interface';

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.page.html',
  styleUrls: ['./new-album.page.scss'],
})
export class NewAlbumPage {
  isSending: boolean;
  isChecked = false;
  newAlbumForm: FormGroup<INewAlbumForm>;
  infoMessage: string;
  constructor(private formBuilder: FormBuilder, private apiService: ApiService,) {
    
    this.newAlbumForm = this.formBuilder.group({
      privacy: [false],
      description: [''],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
    })
  }
  
  addNewAlbum(event: Event) {
    this.isSending = true
    event.preventDefault();
    const privacy = this.newAlbumForm.get('privacy').value;
    const title = this.newAlbumForm.get('title').value;
    const description = this.newAlbumForm.get('description').value;
    this.apiService.createNewAlbum(title, description, privacy).subscribe((res) => {
      this.isSending = false;
      this.infoMessage = 'Album successfully added';
     
    }, (error) => {
      
      this.isSending = false;
      this.infoMessage = 'An error occured couldn\'t create album'
    })
    setTimeout(() => {
      this.newAlbumForm.reset()
      this.infoMessage = undefined
    }, 2000)
  }
}

