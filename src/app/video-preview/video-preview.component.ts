import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Video } from './../_helper/index/index.component';

@Component({
    selector: 'kui-video-preview',
    templateUrl: './video-preview.component.html',
    styleUrls: ['./video-preview.component.scss'],
    animations: [
        trigger('focus',
            [
                state('inactive', style({
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                })),
                state('active', style({
                    width: '256px',
                    height: '{{varHeight}}px',
                    top: '-72px',
                    left: '-24px'
                }), { params: { varHeight: 0 } }),
                transition('* <=> *', [
                    animate('500ms ease')
                ])
            ]
        )
    ]
})
export class VideoPreviewComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() video: Video;

    @ViewChild('matrixEle') matrixEle: ElementRef;
    @ViewChild('flipbook') flipbook: ElementRef;

    preview: boolean = false;
    focusOnPreview: string = 'inactive';

    // video information
    aspectRatio: number;

    // preview image information
    frameWidth: number = 256;
    halfFrameWidth: number = Math.round(this.frameWidth / 2);
    // default frame height
    frameHeight: number = 0;
    lastFrameNr: number;

    // preview images are organized in matrix files; we'll need the last number of those files
    matrix: string;
    matrixWidth: number = Math.round(this.frameWidth * 6);
    matrixHeight: number;
    lastMatrixNr: number;
    lastMatrixLine: number;

    // size of progress bar / timeline
    progressBarWidth: number

    // time information
    currentTime: number = 0;
    previewTime: number = 5;

    // seconds per pixel to calculate preview image on timeline
    secondsPerPixel: number;

    time: boolean = false;

    constructor() { }

    ngOnInit(): void {
        // this.updatePreview(this.frameWidth);
        this.previewTime = this.video.duration / 2;

        this.matrix = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_0.jpg'
    }

    ngOnChanges() {
        // console.log('something has changed', this.frameHeight)
        // this.calculateSizes();
        // this.frameHeight = this.element.nativeElement.clientHeight;
    }

    ngAfterViewInit() {
        this.calculateSizes();

        this.updatePreview(42);

    }

    toggleFlibbook() {
        this.preview = !this.preview;

        this.focusOnPreview = (this.preview ? 'active' : 'inactive');

        if (this.preview) {
            this.calculateSizes();
        }

    }

    calculateSizes() {
        // get width and height of matrix file
        // if duration > 60s
        // if duration >= 360s (first matrix has full size)
        this.matrixWidth = this.matrixEle.nativeElement.width;
        this.matrixHeight = this.matrixEle.nativeElement.height;

        // how many lines does the matrix have? in case of smaller matrix files (duration < 360) the first matrix doesn't have 6 lines
        const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

        // ratio between matrix file and css frame width
        const ratio: number = (this.frameWidth * 6) / this.matrixWidth;

        // to calculate frame height, we need the aspect ratio
        if (this.preview && this.focusOnPreview === 'active') {
            this.frameHeight = Math.round(this.matrixHeight / lines * ratio);
            // video aspect ratio
            this.aspectRatio = this.frameWidth / this.frameHeight;

            // set correct background size for matrix file and flipbook
            this.flipbook.nativeElement.style['background-size'] = Math.round(this.matrixWidth * ratio) + 'px ' + Math.round(this.matrixHeight * ratio) + 'px';
        }
    }

    updatePreview(position: number) {

        // const position: number = ev.offsetX;

        // one frame per 6 pixels
        if (Number.isInteger(position / 6)) {

            // calculate seconds per pixel
            this.secondsPerPixel = this.video.duration / this.frameWidth;

            // get time of mouse position and set preview image time
            this.previewTime = position * this.secondsPerPixel;

            // overflow fixes
            if (this.previewTime < 0) {
                this.previewTime = 0;
            }
            if (this.previewTime > this.video.duration) {
                this.previewTime = this.video.duration;
            }

            // get current matrix image; one matrix contains 6 minute of the video
            let curMatrixNr: number = Math.floor(this.previewTime / 360);

            if (curMatrixNr < 0) {
                curMatrixNr = 0;
            }

            // get current matrix file url; TODO: this will be handled by sipi; no jpg extension needed
            const curMatrixFile = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_' + curMatrixNr + '.jpg';

            // the last matrix file could have another dimension size...
            if (curMatrixNr < this.lastMatrixNr) {
                this.matrixHeight = Math.round(this.frameHeight * 6);
            } else {
                this.lastFrameNr = Math.round(this.video.duration / 10);
                this.lastMatrixLine = Math.ceil((this.lastFrameNr - (this.lastMatrixNr * 36)) / 6);
                this.matrixHeight = Math.round(this.frameHeight * this.lastMatrixLine);
            }


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
            this.flipbook.nativeElement.style['background-image'] = 'url(' + curMatrixFile + ')';
            this.flipbook.nativeElement.style['background-position'] = curFramePos;
        }



    }



}
