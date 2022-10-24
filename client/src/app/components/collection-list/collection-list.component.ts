import { CommonModule } from '@angular/common';
import { Component, OnInit,Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PHOTO_TO_VIEW } from 'src/app/interfaces/photo.interface';
import { CollectionItemComponent } from '../collection-item/collection-item.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],standalone:true,imports:[CommonModule,IonicModule,CollectionItemComponent]
})
export class CollectionListComponent implements OnInit {
  @Input() photo!: PHOTO_TO_VIEW;
  @Input() album
  constructor() { }

  ngOnInit() {
    console.log(this.photo);
    
  }

}
