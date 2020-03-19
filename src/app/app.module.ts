import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material-module';

import { AppComponent } from './app.component';

import { AudioToolComponent } from './audio-tool/audio-tool.component';
import { AudioComponent } from './audio/audio.component';
import { VideoToolComponent } from './video-tool/video-tool.component';
import { VideoComponent } from './video/video.component';
import { TimePipe } from './_helper/time.pipe';
import { DisableContextMenuDirective } from './_helper/disable-context-menu.directive';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { IndexComponent } from './_helper/index/index.component';

@NgModule({
    declarations: [
        AppComponent,
        VideoComponent,
        AudioComponent,
        VideoToolComponent,
        AudioToolComponent,
        TimePipe,
        DisableContextMenuDirective,
        VideoPreviewComponent,
        IndexComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        RouterModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
