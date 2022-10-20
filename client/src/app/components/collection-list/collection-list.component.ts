import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CollectionItemComponent } from '../collection-item/collection-item.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],standalone:true,imports:[CommonModule,IonicModule,CollectionItemComponent]
})
export class CollectionListComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
