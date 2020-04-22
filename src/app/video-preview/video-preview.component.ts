import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Video } from './../_helper/index/index.component';
import { MatrixService } from '../_helper/matrix.service';

@Component({
    selector: 'kui-video-preview',
    templateUrl: './video-preview.component.html',
    styleUrls: ['./video-preview.component.scss'],
    // animations: [
    //     trigger('focus',
    //         [
    //             state('inactive', style({
    //                 width: '100%',
    //                 height: '100%',
    //                 top: '0',
    //                 left: '0',
    //             })),
    //             state('active', style({
    //                 width: '280%',
    //                 height: '280%',
    //                 top: '-90%',
    //                 left: '-90%'
    //             })),
    //             transition('* <=> *', [
    //                 animate('500ms ease')
    //             ])
    //         ]
    //     )
    // ],
    host: {
        '(mouseenter)': 'toggleFlipbook(true)',
        '(mouseleave)': 'toggleFlipbook(false)'
    }
})
export class VideoPreviewComponent implements OnInit, AfterViewInit, OnChanges {

    /** needed video information: name and duration */
    @Input() video: Video;

    /** show frame at the corresponding time */
    @Input() time?: number;

    focusOnPreview: boolean = false;

    // video information
    aspectRatio: number;

    // preview images are organized in matrix files;
    // we need the last number of those files and the number of lines from the last matrix file
    // we need the number of these files and the number of lines of the last matrix file
    // 1. matrix file name
    matrix: string;
    // 2. matrix dimension
    matrixWidth: number;
    matrixHeight: number;
    // 3. number of matrixes and number of lines of last file and number of last possible frame
    lastMatrixNr: number;
    lastMatrixLine: number;
    lastMatrixFrameNr: number;
    // 4. dimension of one frame inside the matrix
    matrixFrameWidth: number;
    matrixFrameHeight: number;

    // size of frame to be displayed; corresponds to dimension of parent container
    frameWidth: number;
    frameHeight: number;

    // seconds per pixel to calculate preview image on timeline
    // secondsPerPixel: number;

    // proportion between matrix frame size and parent container size
    // to calculate matrix background size
    proportion: number;


    @ViewChild('frame') frame: ElementRef;

    constructor(
        private _host: ElementRef,
        private _matrix: MatrixService
    ) { }

    ngOnInit(): void {
        // this.updatePreview(this.frameWidth);
        this.time = this.time || (this.video.duration / 2);

        // this.matrix = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_0.jpg'

        this.matrix = 'http://localhost:1024/images/' + this.video.name + '_m_0.jpg';

        // youtube background of preview:
        // url("https://i9.ytimg.com/sb/QBGBj6cse1M/storyboard3_L2/M5.jpg?sqp=ovOX_wMGCIaP8a0F&sigh=rs%24AOn4CLATgVfOSX0eBDb1WCe_UHNpjqf1mQ") - 640px - 90px / 800px 270px

        // http://localhost:1024/images/one-week_m_0.jpg/320,240,160,120/full/0/default.jpg
    }

    ngOnChanges() {
        // console.log('something has changed', this.frameHeight)
        // this.calculateSizes();
        // this.frameHeight = this.element.nativeElement.clientHeight;
    }

    ngAfterViewInit() {

        this.calculateSizes(this.matrix, false);

        // this.calculateSizesWithSipi(this.matrix);
        // this.frame.nativeElement.style['background-image'] = 'url(' + this.matrix + ')';


        // this.updatePreview(42);

    }

    toggleFlipbook(active: boolean) {
        this.focusOnPreview = active;

        let i: number = 0;
        let j: number = 0;

        if (this.focusOnPreview) {
            // Variant 1: Automatic playback of individual frames
            // first try
            this.setDelay(i, j, false);

            // Variant 2: Mousemove on x-Axis to slide through the video

            // css background instead of sipi
            // this.frame.nativeElement.style['background-size'] = Math.round(((this.matrixWidth / this.proportion) * 280) / 100) + 'px ' + Math.round(((this.matrixHeight / this.proportion) * 280) / 100) + 'px';

            // this.frame.nativeElement.style['width'] = ((this.frameWidth * 280) / 100) + 'px';
            // this.frame.nativeElement.style['height'] = ((this.frameHeight * 280) / 100) + 'px';


        } else {
            i = 0;
        }

    }

    setDelay(i: number, j: number, sipi: boolean, delay: number = 250) {
        let iiifParams: string;
        let cssParams: string;
        let x: number = 0;
        let y: number = 0;

        setTimeout(() => {

            x = i * this.matrixFrameWidth;
            y = j * this.matrixFrameHeight;

            if (sipi) {
                iiifParams = x + ',' + y + ',' + this.matrixFrameWidth + ',' + this.matrixFrameHeight + '/' + this.frameWidth + ',' + this.frameHeight + '/0/default.jpg';
                const currentFrame: string = this.matrix + '/' + iiifParams;

                this.frame.nativeElement.style['background-image'] = 'url(' + currentFrame + ')';
            } else {
                cssParams = '-' + x + 'px -' + y + 'px';

                this.frame.nativeElement.style['background-position'] = cssParams;
            }

            i++;
            if (i < 6 && this.focusOnPreview) {
                this.setDelay(i, j, sipi);
            } else {
                i = 0;
                j++;
                if (j < 6 && this.focusOnPreview) {
                    this.setDelay(i, j, sipi);
                }
            }
        }, delay);
    }

    // to test the difference between sipi single image calculation and css background position,
    // this method has the additional parameter `sipi` as boolean value to switch between the two variants quite quick
    calculateSizes(image: string, sipi: boolean) {
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
            this.frameHeight = Math.round(this.matrixFrameHeight / this.proportion);

            if (sipi) {
                // calculate iiifParams / position, cutout-size (matrixFrameDimension) / display-size
                const iiifParams: string = '0,0,' + this.matrixFrameWidth + ',' + this.matrixFrameHeight + '/' + this.frameWidth + ',/0/default.jpg';
                const currentFrame: string = image + '/' + iiifParams;
                this.frame.nativeElement.style['background-image'] = 'url(' + currentFrame + ')';

                this.frame.nativeElement.style['background-size'] = this.frameWidth + 'px ' + this.frameHeight + 'px';
            } else {
                // background-image, -size
                this.frame.nativeElement.style['background-image'] = 'url(' + this.matrix + '/full/full/0/default.jpg'
                this.frame.nativeElement.style['background-size'] = Math.round(this.matrixWidth / this.proportion) + 'px ' + Math.round(this.matrixHeight / this.proportion) + 'px';
            }

            this.frame.nativeElement.style['width'] = this.frameWidth + 'px';
            this.frame.nativeElement.style['height'] = this.frameHeight + 'px';

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
        if (this.focusOnPreview) {
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
            // this.secondsPerPixel = this.video.duration / this.frameWidth;

            // get time of mouse position and set preview image time
            // this.previewTime = position * this.secondsPerPixel;

            // overflow fixes
            if (this.time < 0) {
                this.time = 0;
            }
            if (this.time > this.video.duration) {
                this.time = this.video.duration;
            }

            // get current matrix image; one matrix contains 6 minute of the video
            let curMatrixNr: number = Math.floor(this.time / 360);

            if (curMatrixNr < 0) {
                curMatrixNr = 0;
            }

            // get current matrix file url; TODO: this will be handled by sipi; no jpg extension needed
            const curMatrixFile = 'data/' + this.video.name + '/matrix/' + this.video.name + '_m_' + curMatrixNr + '.jpg';

            // the last matrix file could have another dimension size...
            if (curMatrixNr < this.lastMatrixNr) {
                this.matrixHeight = Math.round(this.frameHeight * 6);
            } else {
                this.lastMatrixFrameNr = Math.round(this.video.duration / 10);
                this.lastMatrixLine = Math.ceil((this.lastMatrixFrameNr - (this.lastMatrixNr * 36)) / 6);
                this.matrixHeight = Math.round(this.frameHeight * this.lastMatrixLine);
            }


            let curFrameNr: number = Math.floor(this.time / 10) - Math.floor(36 * curMatrixNr);
            if (curFrameNr < 0) {
                curFrameNr = 0;
            }
            if (curFrameNr > this.lastMatrixFrameNr) {
                curFrameNr = this.lastMatrixFrameNr;
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
