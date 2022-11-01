import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { userLogout } from 'src/app/state/auth/auth.actions';
@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, RouterModule],
})
export class PopoverComponent implements OnInit {
    constructor(
        private store: Store<AppState>,
        private navCtrl: NavController
    ) {}

    ngOnInit() {}

    logout() {
        this.store.dispatch(userLogout());
    }
}
