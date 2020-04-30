import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { AudioToolComponent } from './_helper/audio-tool/audio-tool.component';
import { DisableContextMenuDirective } from './_helper/disable-context-menu.directive';
import { IndexComponent } from './_helper/index/index.component';
import { ProgressIndicatorComponent } from './_helper/progress-indicator/progress-indicator.component';
import { TimePipe } from './_helper/time.pipe';
import { VideoToolComponent } from './_helper/video-tool/video-tool.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { AvTimelineComponent } from './av-timeline/av-timeline.component';
import { MaterialModule } from './material-module';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoPreviewComponent } from './video-preview/video-preview.component';

@NgModule({
    declarations: [
        IndexComponent,
        AppComponent,
        TimePipe,
        AvTimelineComponent,
        AudioPlayerComponent,
        AudioToolComponent,
        VideoPlayerComponent,
        VideoToolComponent,
        VideoPreviewComponent,
        DisableContextMenuDirective,
        ProgressIndicatorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MaterialModule,
        RouterModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
