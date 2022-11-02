import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IonicModule,
    NavController,
    SearchbarCustomEvent,
} from '@ionic/angular';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, FormsModule],
})
export class SearchBarComponent implements OnInit {
    @Input() query!: string;
    @Input() canNavigate: boolean = true;
    @Output() onSubmit = new EventEmitter<string>();
    @Output() onSearch = new EventEmitter<string>();
    constructor(private navCtrl: NavController) {}

    ngOnInit() {}
    onSearchChange(event) {
        const ev = event as SearchbarCustomEvent;
        this.query = ev.detail.value;
        if (this.query.length > 3) {
            this.onSearch.emit(this.query);
        }
    }
    formSubmit() {
        if (this.canNavigate) {
            this.navCtrl.navigateForward(`/search/${this.query}`);
        }
        this.onSubmit.emit(this.query);
    }
}
