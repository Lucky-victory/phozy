import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPhotoPage } from './new-photo.page';

const routes: Routes = [
  {
    path: '',
    component: NewPhotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPhotoPageRoutingModule {}
