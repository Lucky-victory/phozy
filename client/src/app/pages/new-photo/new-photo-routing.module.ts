import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';

import { NewPhotoPage } from './new-photo.page';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: NewPhotoPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewPhotoPageRoutingModule {}
