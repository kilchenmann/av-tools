import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
    selector: 'kui-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    @Input() file: string;

    @ViewChild('video') video: ElementRef;
    @ViewChild('progress') progress: ElementRef;
    @ViewChild('preview') preview: ElementRef;

    // video information
    videoWidth: number = 1280;
    videoHeight: number;
    aspectRatio: number;

    // preview image information
    frameWidth: number = 160;
    halfFrameWidth: number = Math.round(this.frameWidth / 2);
    frameHeight: number;
    lastFrameNr: number;

    // preview images are organised in matrix files; we'll need the last number of those files
    matrixWidth: number = Math.round(this.frameWidth * 6);
    matrixHeight: number;
    lastMatrixNr: number;
    lastMatrixLine: number;

    // size of progress bar / timeline
    progressBarWidth: number

    // time information
    duration: number;
    currentTime: number = 0;
    previewTime: number;

    // seconds per pixel to calculate preview image on timeline
    secondsPerPixel: number;

    // percent of video loaded
    currentBuffer: number;

    // status
    play: boolean = false;

    // volume
    volume: number = .5;
    muted: boolean = false;

    // video player mode
    cinemaMode: boolean = false;

    constructor() { }

    ngOnInit(): void {

    }

    /**
     * toggle play / pause
     */
    togglePlay() {

        this.play = !this.play;

        if (this.play) {
            this.video.nativeElement.play();
        } else {
            this.video.nativeElement.pause();
        }

    }

    /**
     * Update of current time info and buffer state
     *
     * @param  {Event} ev
     */
    timeUpdate(ev: Event) {
        // current time
        this.currentTime = this.video.nativeElement.currentTime;

        // buffer progress
        this.currentBuffer = (this.video.nativeElement.buffered.end(0) / this.duration) * 100;
    }

    /**
     * As soon as video has status "loadedmetadata" we're able to read
     * information about duration, video size and set volume
     *
     * @param  {Event} ev
     */
    loadedMetadata(ev: Event) {
        // get video duration
        this.duration = this.video.nativeElement.duration;

        // calculate aspect ratio and set preview image size
        this.aspectRatio = this.video.nativeElement.videoWidth / this.video.nativeElement.videoHeight;
        this.frameHeight = Math.round(this.frameWidth / this.aspectRatio);
        this.preview.nativeElement.style['width'] = this.frameWidth + 'px';
        this.preview.nativeElement.style['height'] = this.frameHeight + 'px';

        // get last frame and matrix number and last matrix line
        this.lastMatrixNr = Math.floor((this.duration - 30) / 360);
        this.lastFrameNr = Math.round((this.duration - 9) / 10);
        this.lastMatrixLine = Math.ceil((this.lastFrameNr - (this.lastMatrixNr * 36)) / 6);

        // set default volume
        this.video.nativeElement.volume = this.volume;
    }
    /**
     * Video navigation from button (-/+ 10 sec)
     *
     * @param  {number} range
     */
    updateTimeFromButton(range: number) {
        this.navigate(this.currentTime + range);
    }
    /**
     * Video naviagtion from timeline / progress bar
     *
     * @param  {MatSliderChange} ev
     */
    updateTimeFromSlider(ev: MatSliderChange) {
        this.navigate(ev.value);
    }
    /**
     * Video navigation from scroll event
     *
     * @param  {WheelEvent} ev
     */
    updateTimeFromScroll(ev: WheelEvent) {
        this.navigate(this.currentTime + (ev.deltaY / 25));
    }
    /**
     * General video navigation: Update current video time from position
     *
     * @param  {number} position
     */
    private navigate(position: number) {

        this.video.nativeElement.currentTime = position;
    }

    /**
     * toggle video size: cinema mode = almost fullscreen vs. normal size
     */
    toggleCinemaMode() {
        this.cinemaMode = !this.cinemaMode;
        // this.preview.nativeElement.style['top'] = (this.video.nativeElement.offsetTop + this.video.nativeElement.offsetHeight - frameHeight - 8) + 'px';
        console.log(this.video);
    }

    /**
     * Show preview image during "mousemove" on progress bar / timeline
     *
     * @param  {MouseEvent} ev
     */
    updatePreview(ev: MouseEvent) {
        // mouse position
        const position: number = ev.clientX - this.progress.nativeElement.offsetLeft - 16 - 7;

        // get time of mouse position and set preview image time
        this.previewTime = position * this.secondsPerPixel;

        if (this.previewTime < 0) {
            this.previewTime = 0;
        }
        if (this.previewTime > this.duration) {
            this.previewTime = this.duration;
        }

        // get current matrix image; one matrix contains 6 minute of the video
        let curMatrixNr: number = Math.floor(this.previewTime / 360);

        if (curMatrixNr < 0) {
            curMatrixNr = 0;
        }

        // get current matrix file url; TODO: this will be handled by sipi; no jpg extension needed
        const curMatrixFile = 'data/' + this.file + '/matrix/' + this.file + '_m_' + curMatrixNr + '.jpg';

        // the last matrix file could have another dimension size...
        if (curMatrixNr < this.lastMatrixNr) {
            this.matrixHeight = Math.round(this.frameHeight * 6);
        } else {
            this.matrixHeight = Math.round(this.frameHeight * this.lastMatrixLine);
        }

        // get current matrix size information
        const matrixSize = this.matrixWidth + 'px ' + this.matrixHeight + 'px';

        let curFrameNr: number = Math.floor(this.previewTime / 10) - Math.floor(36 * curMatrixNr);
        if (curFrameNr < 0) {
            curFrameNr = 0;
        }
        if (curFrameNr > this.lastFrameNr) {
            curFrameNr = this.lastFrameNr;
        }
        // calculate current line and columne number in the matrix and get current frame / preview image position
        const curLineNr: number = Math.floor(curFrameNr / 6);
        const curColNr: number = Math.floor(curFrameNr - (curLineNr * 6));
        const curFramePos: string = '-' + (curColNr * this.frameWidth) + 'px -' + (curLineNr * this.frameHeight) + 'px';

        // manipulate css of preview image on the fly
        this.preview.nativeElement.style['background-image'] = 'url(' + curMatrixFile + ')';
        this.preview.nativeElement.style['background-size'] = matrixSize;
        this.preview.nativeElement.style['background-position'] = curFramePos;
        this.preview.nativeElement.style['top'] = (this.progress.nativeElement.offsetTop - this.frameHeight - 8) + 'px';

        // position from left:
        let leftPosition: number = ev.clientX - this.halfFrameWidth;
        if (leftPosition <= (this.halfFrameWidth)) {
            leftPosition = this.halfFrameWidth;
        }
        if (leftPosition >= (this.progressBarWidth - this.halfFrameWidth)) {
            leftPosition = this.progressBarWidth - this.halfFrameWidth + 24;
        }
        this.preview.nativeElement.style['left'] = leftPosition + 'px';

    }

    /**
     * Show preview image or hide it
     *
     * @param  {string} status
     */
    displayPreview(status: string) {
        // get size of progress bar / timeline to calculate seconds per pixel
        this.progressBarWidth = this.progress.nativeElement.offsetWidth - 32 - 16;
        this.secondsPerPixel = this.duration / this.progressBarWidth;

        // display preview or hide it; depending on mouse event "enter" or "leave" on progress bar / timeline
        this.preview.nativeElement.style['display'] = status;
    }

}
