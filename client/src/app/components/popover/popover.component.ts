import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { userLogout } from 'src/app/state/auth/auth.actions';
import { selectUser } from 'src/app/state/auth/auth.selectors';
import { USER_RESULT } from 'src/app/interfaces/user.interface';
import { Subscription } from 'rxjs'
@Component({
    selector: 'app-popover',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, RouterModule],
})
export class PopoverComponent implements OnInit,OnDestroy {
    currentUser: USER_RESULT;
    userSub: Subscription;
    constructor(
        private store: Store<AppState>,
        
        ) {}
        
        ngOnInit() {
         this.userSub=   this.store.select(selectUser).subscribe((user) => {
                this.currentUser = user;
    })
    
    }

    logout() {
        this.store.dispatch(userLogout());
    }
    ngOnDestroy(): void {
        this.userSub?.unsubscribe()
    }
}
