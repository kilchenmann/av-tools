import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { AvTimelineComponent } from './av-timeline/av-timeline.component';
import { MaterialModule } from './material-module';
import { VideoFrameComponent } from './video-frame/video-frame.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { VideoPreviewComponent } from './video-preview/video-preview.component';
import { AudioToolComponent } from './_helper/audio-tool/audio-tool.component';
import { DisableContextMenuDirective } from './_helper/disable-context-menu.directive';
import { IndexComponent } from './_helper/index/index.component';
import { ProgressIndicatorComponent } from './_helper/progress-indicator/progress-indicator.component';
import { ResizedDirective } from './_helper/resized.directive';
import { TimePipe } from './_helper/time.pipe';
import { VideoToolComponent } from './_helper/video-tool/video-tool.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        IndexComponent,
        AppComponent,
        TimePipe,
        AvTimelineComponent,
        VideoFrameComponent,
        AudioPlayerComponent,
        AudioToolComponent,
        VideoPlayerComponent,
        VideoToolComponent,
        VideoPreviewComponent,
        DisableContextMenuDirective,
        ResizedDirective,
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
