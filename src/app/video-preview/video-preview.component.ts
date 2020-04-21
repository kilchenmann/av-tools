import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Video } from './../_helper/index/index.component';
import { HttpClient } from '@angular/common/http';
import { MatrixService } from '../_helper/matrix.service';

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
                    width: '280%',
                    height: '280%',
                    top: '-90%',
                    left: '-90%'
                })),
                transition('* <=> *', [
                    animate('500ms ease')
                ])
            ]
        )
    ],
    host: {
        '(mouseenter)': 'toggleFlipbook()',
        '(mouseleave)': 'toggleFlipbook()'
    }
})
export class VideoPreviewComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() video: Video;

    // @ViewChild('matrixEle') matrixEle: ElementRef;
    // @ViewChild('flipbook') flipbook: ElementRef;

    preview: boolean = false;
    focusOnPreview: string = 'inactive';

    // video information
    aspectRatio: number;

    // preview image information
    // frameWidth: number = 256;
    // halfFrameWidth: number = Math.round(this.frameWidth / 2);
    // default frame height
    // frameHeight: number = 0;
    // lastFrameNr: number;

    // preview images are organized in matrix files; we'll need the last number of those files
    matrix: string;
    matrixWidth: number;
    matrixHeight: number;
    lastMatrixNr: number;
    lastMatrixLine: number;

    matrixFrameWidth: number;
    matrixFrameHeight: number;

    frameWidth: number;
    frameHeight: number;
    lastFrameNr: number;

    // time information
    currentTime: number = 0;
    previewTime: number = 5;

    // seconds per pixel to calculate preview image on timeline
    secondsPerPixel: number;

    proportion

    time: boolean = false;

    @ViewChild('frame') frame: ElementRef;

    constructor(
        private _host: ElementRef,
        private _matrix: MatrixService
    ) { }

    ngOnInit(): void {
        // this.updatePreview(this.frameWidth);
        this.previewTime = this.video.duration / 2;

        // this.matrix = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_0.jpg'

        this.matrix = 'http://localhost:1024/images/' + this.video.name + '_m_0.jpg';

        // http://localhost:1024/images/one-week_m_0.jpg/320,240,160,120/full/0/default.jpg
    }

    ngOnChanges() {
        // console.log('something has changed', this.frameHeight)
        // this.calculateSizes();
        // this.frameHeight = this.element.nativeElement.clientHeight;
    }

    ngAfterViewInit() {

        this.calculateSizesWithSipi(this.matrix);

        // this.calculateSizesWithSipi(this.matrix);
        // this.frame.nativeElement.style['background-image'] = 'url(' + this.matrix + ')';


        // this.updatePreview(42);

    }

    toggleFlipbook() {
        this.preview = !this.preview;

        // this.focusOnPreview = (this.preview ? 'active' : 'inactive');

        let iiifParams: string;
        let x: number = 0;
        let y: number = 0;
        let i: number = 0;

        if (this.preview) {
            // Variant 1: Automatic playback of individual frames
            // first try
            this.setDelay(i);

            // this.frame.nativeElement.style['background-size'] = Math.round(((this.matrixWidth / this.proportion) * 280) / 100) + 'px ' + Math.round(((this.matrixHeight / this.proportion) * 280) / 100) + 'px';

            // this.frame.nativeElement.style['width'] = ((this.frameWidth * 280) / 100) + 'px';
            // this.frame.nativeElement.style['height'] = ((this.frameHeight * 280) / 100) + 'px';


        } else {
            i = 0;
        }

    }

    setDelay(i: number, delay: number = 250) {
        let iiifParams: string;
        let x: number = 0;
        let y: number = 0;

        setTimeout(() => {
            console.log(i);
            x = i * this.matrixFrameWidth;
            iiifParams = x + ',' + y + ',' + this.matrixFrameWidth + ',' + this.matrixFrameHeight + '/' + this.frameWidth + ',' + this.frameHeight + '/0/default.jpg';
            const currentFrame: string = this.matrix + '/' + iiifParams;
            console.log(currentFrame);
            this.frame.nativeElement.style['background-image'] = 'url(' + currentFrame + ')';

            i++;
            if (i < 6 && this.preview) {
                this.setDelay(i);
                // i++;
            }
        }, delay);
    }

    calculateSizesWithSipi(image: string) {
        this._matrix.getMatrixInfo(image + '/info.json').subscribe((res: any) => {
            // console.log(res);
            // matrix dimension is:
            this.matrixWidth = res.width;
            this.matrixHeight = res.height;

            const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

            // get matrix frame dimension
            this.matrixFrameWidth = (this.matrixWidth / 6);
            this.matrixFrameHeight = (this.matrixHeight / lines);

            // host dimension
            const parentFrameWidth: number = this._host.nativeElement.offsetWidth;
            const parentFrameHeight: number = this._host.nativeElement.offsetHeight;

            this.proportion = (this.matrixFrameWidth / parentFrameWidth);

            if ((this.matrixFrameHeight / this.proportion) > parentFrameHeight) {
                this.proportion = (this.matrixFrameHeight / parentFrameHeight);
                // console.log('matrix frame height is to high', (this.proportion));
            } else {
                // console.log('matrix frame height is ok', (this.proportion));
            }

            this.frameWidth = Math.round(this.matrixFrameWidth / this.proportion);
            this.frameHeight = Math.round(this.matrixFrameHeight / this.proportion)

            // calculate iiifParams / position, cutout-size (matrixFrameDimension) / display-size
            const iiifParams: string = '0,0,' + this.matrixFrameWidth + ',' + this.matrixFrameHeight + '/' + this.frameWidth + ',' + this.frameHeight + '/0/default.jpg';
            const currentFrame: string = image + '/' + iiifParams;
            this.frame.nativeElement.style['background-image'] = 'url(' + currentFrame + ')';

            this.frame.nativeElement.style['background-size'] = this.frameWidth + 'px ' + this.frameHeight + 'px';

            this.frame.nativeElement.style['width'] = this.frameWidth + 'px';
            this.frame.nativeElement.style['height'] = this.frameHeight + 'px';

        });

    }

    calculateSizes(image: string) {

        const img = new Image();
        img.src = image;

        img.addEventListener('load', () => {
            // matrix dimension is:
            this.matrixWidth = img.naturalWidth;
            this.matrixHeight = img.naturalHeight;

            // how many lines does the matrix have? in case of smaller matrix files (duration < 360) the first matrix doesn't have 6 lines
            const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));

            // get matrix frame dimension
            const matrixFrameWidth: number = (this.matrixWidth / 6);
            const matrixFrameHeight: number = (this.matrixHeight / lines);

            // const aspectRatio: number = (matrixFrameWidth / matrixFrameHeight);
            // console.log(this.video.name)
            // console.log('Aspect ratio', aspectRatio);

            // console.log('Matrix frame size', matrixFrameWidth, matrixFrameHeight);

            // get parent element frame dimension in pixels; calculated from host, which fills the parent element by 100%
            const parentFrameWidth: number = this._host.nativeElement.offsetWidth;
            const parentFrameHeight: number = this._host.nativeElement.offsetHeight;

            // console.log('Parent frame size', parentFrameWidth, parentFrameHeight);


            // get proportion between matrix frame size and parent frame size to calculate background-size of matrix file
            this.proportion = (matrixFrameWidth / parentFrameWidth);

            if ((matrixFrameHeight / this.proportion) > parentFrameHeight) {
                this.proportion = (matrixFrameHeight / parentFrameHeight);
                // console.log('matrix frame height is to high', (this.proportion));
            } else {
                // console.log('matrix frame height is ok', (this.proportion));
            }

            this.frameWidth = Math.round(matrixFrameWidth / this.proportion);
            this.frameHeight = Math.round(matrixFrameHeight / this.proportion)

            // console.log('Preview frame size', this.frameWidth, this.frameHeight);
            // console.log('Background size   ', Math.round(this.matrixWidth / proportion) + 'px ' + Math.round(this.matrixHeight / proportion));

            // set matrix size corresponding to frame width
            this.frame.nativeElement.style['background-size'] = Math.round(this.matrixWidth / this.proportion) + 'px ' + Math.round(this.matrixHeight / this.proportion) + 'px';

            this.frame.nativeElement.style['width'] = this.frameWidth + 'px';
            this.frame.nativeElement.style['height'] = this.frameHeight + 'px';

            // console.log('- • - • - • - • - • - • - • - • - • - • - • - • ');
        });

    }


    calculateSizesDepr() {
        // get width and height of matrix file
        // if duration > 60s
        // if duration >= 360s (first matrix has full size)
        // this.matrixWidth = this.matrixEle.nativeElement.width;
        // this.matrixHeight = this.matrixEle.nativeElement.height;

        // how many lines does the matrix have? in case of smaller matrix files (duration < 360) the first matrix doesn't have 6 lines
        const lines: number = (this.video.duration > 360 ? 6 : Math.round(this.video.duration / 60));
        console.log('# lines', lines);

        // ratio between matrix file and css frame width
        const ratio: number = (this.frameWidth * 6) / this.matrixWidth;

        // to calculate frame height, we need the aspect ratio
        if (this.preview && this.focusOnPreview === 'active') {
            this.frameHeight = Math.round(this.matrixHeight / lines * ratio);
            console.log(this.frameHeight);
            // video aspect ratio
            this.aspectRatio = this.frameWidth / this.frameHeight;

            // set correct background size for matrix file and flipbook
            // this.flipbook.nativeElement.style['background-size'] = Math.round(this.matrixWidth * ratio) + 'px ' + Math.round(this.matrixHeight * ratio) + 'px';
        }
    }

    updatePreview(ev: MouseEvent) {

        console.log(ev);

        const position: number = ev.clientX;

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
            // this.flipbook.nativeElement.style['background-image'] = 'url(' + curMatrixFile + ')';
            // this.flipbook.nativeElement.style['background-position'] = curFramePos;
        }



    }



}
