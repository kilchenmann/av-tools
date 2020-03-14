import { element } from 'protractor';
import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
    selector: 'kui-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewChecked {

    @Input() file: string;

    @ViewChild('video') video: ElementRef;
    @ViewChild('progress') progress: ElementRef;
    @ViewChild('preview') preview: ElementRef;

    videoWidth: number = 1280;
    videoHeight: number;
    aspectRatio: number;

    currentTime: number = 0;
    previewTime: number;
    duration: number;

    currentBuffer: number;

    play: boolean = false;

    volume: number = .5;
    muted: boolean = false;

    cinemaView: boolean = false;

    constructor() { }

    ngOnInit(): void {

    }

    ngAfterViewChecked(): void {
        // console.log('buffered start', this.video.nativeElement.buffered.start(0));
        // console.log('buffered end', this.video.nativeElement.buffered.end(0));
    }

    togglePlay() {

        this.play = !this.play;

        if (this.play) {
            this.video.nativeElement.play();
        } else {
            this.video.nativeElement.pause();
        }

    }

    timeUpdate(ev: Event) {
        // current time
        this.currentTime = this.video.nativeElement.currentTime; // (<HTMLVideoElement>ev.target).currentTime;

        // buffer progress
        this.currentBuffer = (this.video.nativeElement.buffered.end(0) / this.duration) * 100;
    }

    statusUpdate(ev: Event) {
        this.duration = this.video.nativeElement.duration;
        this.video.nativeElement.volume = this.volume;
        // calc aspect ratio; will be used for preview
        this.aspectRatio = this.video.nativeElement.videoWidth / this.video.nativeElement.videoHeight;
    }

    updateTimeFromButton(range: number) {
        this.navigate(this.currentTime + range);
    }

    updateTimeFromSlider(ev: MatSliderChange) {
        this.navigate(ev.value);
    }

    updateTimeFromScroll(ev: WheelEvent) {
        this.navigate(this.currentTime + (ev.deltaY / 25));
    }

    private navigate(position: number) {

        this.video.nativeElement.currentTime = position;
    }

    onResize(event) {
        // console.log('width on resize', this.player.nativeElement.offsetWidth);
    }

    updatePreview(ev: MouseEvent) {

        // TODO: move to top
        const frameWidth: number = 160;
        const frameHeight: number = Math.round(frameWidth / this.aspectRatio);

        this.preview.nativeElement.style['width'] = frameWidth + 'px';
        this.preview.nativeElement.style['height'] = frameHeight + 'px';

        const progressBarWidth: number = this.progress.nativeElement.offsetWidth - 32 - 16;
        const secondsPerPixel = this.duration / progressBarWidth;

        // End of TODO;

        const position: number = ev.clientX - this.progress.nativeElement.offsetLeft - 16 - 7;
        this.previewTime = position * secondsPerPixel;

        if (this.previewTime < 0) {
            this.previewTime = 0;
        }
        if (this.previewTime > this.duration) {
            this.previewTime = this.duration;
        }

        let curMatrixNr: number = Math.floor(this.previewTime / 360);

        if (curMatrixNr < 0) {
            curMatrixNr = 0;
        }

        const lastMatrixNr = Math.floor((this.duration - 30) / 360);

        // this will be handled by sipi; no jpg extension needed
        const curMatrixFile = 'data/' + this.file + '/matrix/' + this.file + '_m_' + curMatrixNr + '.jpg';

        const matrixWidth: number = Math.round(frameWidth * 6);
        let matrixHeight: number;
        let lastFrameNr: number;
        let lastMatrixLine: number;

        // the last matrix file could have another dimension size...
        if (curMatrixNr < lastMatrixNr) {
            matrixHeight = Math.round(frameHeight * 6);
        } else {
            lastFrameNr = Math.round((this.duration - 9) / 10);
            lastMatrixLine = Math.ceil((lastFrameNr - (lastMatrixNr * 36)) / 6);
            matrixHeight = Math.round(frameHeight * lastMatrixLine);
        }
        const matrixSize = matrixWidth + 'px ' + matrixHeight + 'px';

        let curFrameNr: number = Math.floor(this.previewTime / 10) - Math.floor(36 * curMatrixNr);
        if (curFrameNr < 0) {
            curFrameNr = 0;
        }
        if (curFrameNr > lastFrameNr) {
            curFrameNr = lastFrameNr;
        }

        const curLineNr: number = Math.floor(curFrameNr / 6);
        const curColNr: number = Math.floor(curFrameNr - (curLineNr * 6));
        const curFramePos: string = '-' + (curColNr * frameWidth) + 'px -' + (curLineNr * frameHeight) + 'px';

        // manipulate css on the fly
        this.preview.nativeElement.style['background-image'] = 'url(' + curMatrixFile + ')';
        this.preview.nativeElement.style['background-size'] = matrixSize;
        this.preview.nativeElement.style['background-position'] = curFramePos;
        this.preview.nativeElement.style['top'] = (this.video.nativeElement.offsetTop + this.video.nativeElement.offsetHeight - frameHeight - 8) + 'px';
        this.preview.nativeElement.style['left'] = (ev.clientX - Math.floor(frameWidth / 2)) + 'px';

    }

    displayPreview(status: string) {
        this.preview.nativeElement.style['display'] = status;
    }

}
