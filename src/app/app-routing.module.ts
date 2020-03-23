import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './_helper/index/index.component';
import { AudioToolComponent } from './audio-tool/audio-tool.component';
import { VideoToolComponent } from './video-tool/video-tool.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: IndexComponent
    },
    {
        path: 'audio',
        component: AudioToolComponent
    },
    {
        path: 'video',
        component: IndexComponent
    },
    {
        path: 'video/:name',
        component: VideoToolComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
