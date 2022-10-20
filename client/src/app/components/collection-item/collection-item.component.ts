import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-collection-item',
  templateUrl: './collection-item.component.html',
  styleUrls: ['./collection-item.component.scss'],standalone:true,imports:[CommonModule,IonicModule]
})
export class CollectionItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
