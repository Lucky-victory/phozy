import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth/auth.guard';

import { NewAlbumPage } from './new-album.page';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: NewAlbumPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewAlbumPageRoutingModule {}
