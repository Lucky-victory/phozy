import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss'],
})
export class PhotoModalComponent implements OnInit,DoCheck {
 @Input() isModalOpen: boolean=false;
  @Output() onModalClose = new EventEmitter<boolean>();
  @Input() photo: any;
  photoUrl: string;
  photoOwner: string;
  photoUploadDate: string;
  constructor() { }

  ngOnInit(photo=this.photo) {
    this.photoUrl = photo?.url;
this.photoOwner = this.photo?.user?.fullname;
    this.photoUploadDate=this.photo?.created_at
  }
  ngDoCheck(): void {
    this.photoUrl = this.photo?.url;
    this.photoOwner = this.photo?.user?.fullname;
    this.photoUploadDate=this.photo?.created_at
  }
  setOpen(isOpen:boolean) {
  
    this.onModalClose.emit(isOpen)
}
}
