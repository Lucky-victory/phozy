import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./pages/home/home.module').then((m) => m.HomePageModule),
    },
    {
        path: 'sign-in',
        loadChildren: () =>
            import('./pages/sign-in/sign-in.module').then(
                (m) => m.SignInPageModule
            ),
    },

    {
        path: 'profile/:username',
        loadChildren: () =>
            import('./pages/user-profile/user-profile.module').then(
                (m) => m.UserProfilePageModule
            ),
    },

    {
        path: 'create',
        children: [
            {
                path: 'album',
                loadChildren: () =>
                    import('./pages/new-album/new-album.module').then(
                        (m) => m.NewAlbumPageModule
                    ),
            },
            {
                path: 'photo',
                loadChildren: () =>
                    import('./pages/new-photo/new-photo.module').then(
                        (m) => m.NewPhotoPageModule
                    ),
            },
        ],
    },
    {
        path: 'sign-up',
        loadChildren: () =>
            import('./pages/sign-up/sign-up.module').then(
                (m) => m.SignUpPageModule
            ),
    },

    {
        path: 'photo',
        loadChildren: () =>
            import('./pages/photo-view/photo-view.module').then(
                (m) => m.PhotoViewPageModule
            ),
    },

    {
        path: 'search/:query',

        loadChildren: () =>
            import('./pages/search/search.module').then(
                (m) => m.SearchPageModule
            ),
    },
    {
        path: '**',
        loadChildren: () =>
            import('./pages/not-found/not-found.module').then(
                (m) => m.NotFoundPageModule
            ),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
