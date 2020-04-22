import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { pointerValue } from '../av-timeline/av-timeline.component';

@Component({
    selector: 'kui-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

    loading: boolean = true;

    @Input() video: string;
    startAt: number = 0;
    videoSrc: string;


    @ViewChild('videoEle') videoEle: ElementRef;
    @ViewChild('timeline') timeline: ElementRef;
    @ViewChild('progress') progress: ElementRef;
    @ViewChild('preview') preview: ElementRef;

    // video information
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
    previewTime: number = 0;

    // seconds per pixel to calculate preview image on timeline
    secondsPerPixel: number;

    // percent of video loaded
    currentBuffer: number;

    // status
    play: boolean = false;

    // volume
    volume: number = .75;
    muted: boolean = true;

    // video player mode
    cinemaMode: boolean = false;

    constructor(private _videoPlayer: ElementRef) { }

    ngOnInit(): void {
        if (this.video) {
            this.videoSrc = 'http://localhost:1024/images/' + this.video + '.mp4#t=' + this.startAt;
        }
    }

    /**
     * toggle play / pause
     */
    togglePlay() {

        this.play = !this.play;

        if (this.play) {
            this.videoEle.nativeElement.play();
        } else {
            this.videoEle.nativeElement.pause();
        }

    }

    toggleCinemaMode() {
        this.cinemaMode = !this.cinemaMode;
    }

    /**
     * Update of current time info and buffer state
     *
     * @param  {Event} ev
     */
    timeUpdate(ev: Event) {
        // current time
        this.currentTime = this.videoEle.nativeElement.currentTime;

        // buffer progress
        this.currentBuffer = (this.videoEle.nativeElement.buffered.end(0) / this.duration) * 100;

        let range = 0;
        let bf = this.videoEle.nativeElement.buffered;

        while (!(bf.start(range) <= this.currentTime && this.currentTime <= bf.end(range))) {
            range += 1;
        }
        let loadStartPercentage = (bf.start(range) / this.duration) * 100;
        let loadEndPercentage = (bf.end(range) / this.duration) * 100;
        let loadPercentage = (loadEndPercentage - loadStartPercentage);

        // console.log(loadPercentage);

        // console.log('position', (this.currentTime / this.secondsPerPixel))

        // this.updatePosition(Math.round(this.currentTime / this.secondsPerPixel));

    }

    /**
     * As soon as video has status "loadedmetadata" we're able to read
     * information about duration, video size and set volume
     *
     * @param  {Event} ev
     */
    loadedMetadata(ev: Event) {
        // get video duration
        this.duration = this.videoEle.nativeElement.duration;

        // calculate aspect ratio and set preview image size
        this.aspectRatio = this.videoEle.nativeElement.videoWidth / this.videoEle.nativeElement.videoHeight;

        this.frameHeight = Math.round(this.frameWidth / this.aspectRatio);
        this.preview.nativeElement.style['width'] = this.frameWidth + 'px';
        this.preview.nativeElement.style['height'] = this.frameHeight + 'px';

        // get last frame and matrix number and last matrix line
        this.lastMatrixNr = Math.floor((this.duration - 30) / 360);
        this.lastFrameNr = Math.round((this.duration - 9) / 10);
        this.lastMatrixLine = Math.ceil((this.lastFrameNr - (this.lastMatrixNr * 36)) / 6);

        // set default volume
        this.videoEle.nativeElement.volume = this.volume;

    }

    loadedVideo(ev: Event) {
        this.loading = false;
        this.play = !this.videoEle.nativeElement.paused;
        // console.log(this.videoEle);
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
    updateTimeFromSlider(time: number) {
        this.navigate(time);
    }
    /**
     * Video navigation from scroll event
     *
     * @param  {WheelEvent} ev
     */
    updateTimeFromScroll(ev: WheelEvent) {
        ev.preventDefault();
        this.navigate(this.currentTime + (ev.deltaY / 25));
    }
    /**
     * General video navigation: Update current video time from position
     *
     * @param  {number} position
     */
    private navigate(position: number) {

        this.videoEle.nativeElement.currentTime = position;
    }

    calcPreviewTime(ev: MouseEvent) {
        this.previewTime = Math.round((ev.offsetX / this.timeline.nativeElement.clientWidth) * this.duration);
        this.previewTime = this.previewTime > this.duration ? this.duration : this.previewTime;
        this.previewTime = this.previewTime < 0 ? 0 : this.previewTime;
    }

    mouseMove(ev: MouseEvent) {
        this.calcPreviewTime(ev);
        // console.log('mouse move on', this.previewTime)
    }





    sliderChange(ev: Event) {
        // console.log(ev);
        // const valueSeeked: number = parseInt(ev.target.value);

        // if (this.previewTime === valueSeeked) {
        //     console.log('preview time and slider value are correct')
        // } else {

        //     console.log('time: ', this.previewTime + ' === ' + valueSeeked + ' : ' + (this.previewTime === valueSeeked))
        // }


    }

    /**
     * Show preview image during "mousemove" on progress bar / timeline
     *
     * @param  {MouseEvent} ev
     */
    updatePreview(ev: pointerValue) {
        // console.log('update preview with', ev);

        this.previewTime = ev.time;

        // console.log('------------------------------------');
        // console.log('mousemove', (ev.offsetX / this.progress.nativeElement.clientWidth) * this.duration);

        // console.log(this.progress)

        // console.log('UpdatePreview ----------------------');
        // mouse position
        // const position: number = ev.offsetX;
        // clientX - this.progress._elementRef.nativeElement.offsetLeft;
        // console.log('mouse offset X', ev.offsetX);
        // console.log('progressEle', this.progress);
        // console.log('mouse ev', ev);
        // console.log('clientX', ev.clientX);
        // console.log('offsetLeft', this.progress._elementRef.nativeElement.offsetLeft);


        // get time of mouse position and set preview image time
        // this.previewTime = Math.round(position * this.secondsPerPixel);
        // if (this.previewTime < 0) {
        //     this.previewTime = 0;
        // }
        // if (this.previewTime > this.duration) {
        //     this.previewTime = this.duration;
        // }

        // this.calcPreviewTime(ev);

        // console.log('preview time', this.previewTime);

        // get current matrix image; one matrix contains 6 minute of the video
        let curMatrixNr: number = Math.floor(this.previewTime / 360);

        if (curMatrixNr < 0) {
            curMatrixNr = 0;
        }

        // get current matrix file url; TODO: this will be handled by sipi; no jpg extension needed
        const curMatrixFile = 'data/' + this.video + '/matrix/' + this.video + '_m_' + curMatrixNr + '.jpg';

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
        // this.preview.nativeElement.style['top'] = (this.progress.nativeElement.offsetTop - this.frameHeight - 8) + 'px';

        // position from left:

        let leftPosition: number = ev.position - this.halfFrameWidth;
        // console.log('left position of preview', leftPosition);

        if (this.cinemaMode) {
            //ev.screenX
            // prevent overflow of preview image on the left
            if (leftPosition <= 8) {
                leftPosition = 8;
            }
            // prevent overflow of preview image on the right
            if (leftPosition >= (this.progressBarWidth - this.frameWidth + 32)) {
                leftPosition = this.progressBarWidth - this.frameWidth + 32;
            }
        } else {
            // prevent overflow of preview image on the left
            if (leftPosition <= (this.halfFrameWidth)) {
                leftPosition = this.halfFrameWidth;
            }
            // prevent overflow of preview image on the right
            if (leftPosition >= (this.progressBarWidth - this.halfFrameWidth + 48)) {
                leftPosition = this.progressBarWidth - this.halfFrameWidth + 48;
            }
        }
        // set preview positon on x axis
        this.preview.nativeElement.style['left'] = leftPosition + 'px';


    }

    /**
     * Show preview image or hide it
     *
     * @param  {string} status
     */
    displayPreview(status: string) {

        // get size of progress bar / timeline to calculate seconds per pixel
        // this.progressBarWidth = this.progress.nativeElement.offsetWidth;
        // console.log('progressBarWidth', this.progressBarWidth);
        // this.secondsPerPixel = this.duration / this.progressBarWidth;


        // display preview or hide it; depending on mouse event "enter" or "leave" on progress bar / timeline
        this.preview.nativeElement.style['display'] = status;
    }

}
