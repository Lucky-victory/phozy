import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],standalone:true,imports:[CommonModule,IonicModule]
})
export class SearchBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
  onSearchChange(event) {
  
}
}
