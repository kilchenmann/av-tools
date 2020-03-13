import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoToolComponent } from './video-tool/video-tool.component';
import { AudioToolComponent } from './audio-tool/audio-tool.component';

const routes: Routes = [
    {
        path: 'audio',
        component: AudioToolComponent
    },
    {
        path: 'video',
        component: VideoToolComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
