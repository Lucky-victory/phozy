import { Component,  DoCheck,  OnInit, } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { IAlbumResult } from 'src/app/interfaces/albums.interface';
import { IResponseResult } from 'src/app/interfaces/common';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { INewPhotoForm } from '../../interfaces/new-photo.interface';

@Component({
  selector: 'app-new-photo',
  templateUrl: './new-photo.page.html',
  styleUrls: ['./new-photo.page.scss'],
})
export class NewPhotoPage implements OnInit{
  isSending: boolean = false;
  photosToPreview: string[] = [];
  photosToUpload: File[] = [];
  userAlbums: IAlbumResult[] = [];
  maxPhotoCount = 10;
  newPhotoForm!: FormGroup<INewPhotoForm>;
  infoMessage!: string;

  constructor(private formBuilder: FormBuilder,private apiService:ApiService,private authService:AuthService) {
    this.newPhotoForm = this.formBuilder.group({
      photosUpload:['',Validators.required],prevAlbums:['',Validators.required]
    })
   }

  ngOnInit() {
    this.fetchUserAlbums()
  }
  fetchUserAlbums() {
    const user = this.authService.getUser();
    this.apiService.getUserAlbums(user?.username as string).subscribe((res) => {
      this.userAlbums = res.data as IAlbumResult[];
      
      
    });
    
  }
  ionViewDidEnter(): void{
    this.fetchUserAlbums()

  }

  addNewPhoto() {
    const albumId = this.newPhotoForm.get('prevAlbums').value;
    this.isSending = true;
    this.apiService.uploadPhotosToAlbum(albumId, this.photosToUpload).subscribe((res) => {
  
      this.isSending = false;
      this.newPhotoForm.reset();
      this.photosToPreview = [];
      this.infoMessage='Photos uploaded successfully'
    }, (error) => {
      this.isSending = false;
      this.infoMessage='Sorry, an error occurred please try again'
    })
  }
  loadImageFromDevice(event) {
    this.photosToPreview = [];
    const files = (event.target as HTMLInputElement).files;
    const filesArray = Array.from(files);
    if (filesArray.length > this.maxPhotoCount) {
      this.infoMessage=`You have chosen more than ${this.maxPhotoCount} images`
      return 
    }
    if (files.length > 0) {
      for (const file of filesArray) {
        this.photosToUpload.push(file);
        
        const reader = new FileReader(); 
      reader.onload = () => {
        
        this.photosToPreview.push(reader.result as string);
       
      }
      reader.readAsDataURL(file);
        
      }
    }

  }
}


