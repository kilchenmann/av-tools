import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, SimpleChange, Renderer2 } from '@angular/core';

export interface pointerValue {
    position: number;
    time: number;
}

@Component({
    selector: 'kui-av-timeline',
    templateUrl: './av-timeline.component.html',
    styleUrls: ['./av-timeline.component.scss'],
    host: {
        '(focus)': '_onFocus()',
        '(blur)': '_onBlur()',
        '(keydown)': '_onKeydown($event)',
        '(keyup)': '_onKeyup()',
        '(mouseenter)': '_onMouseenter($event)',
        '(mousemove)': '_onMousemove($event)',
        '(mousedown)': '_onMousemove($event)',
        '(mouseup)': '_onMouseup($event)',
        '(window:resize)': '_onWindowResize($event)'
    }
})
export class AvTimelineComponent implements OnInit, OnChanges {

    /** current time value */
    @Input() value: number;

    /** start time value */
    @Input() min?: number = 0;

    /** end time value: Normally this is the duration */
    @Input() max: number;

    /** in case parent resized: Will be used in video player when changed view mode to cinema and return  */
    @Input() resized: boolean;

    /** send click position to parent */
    @Output() change = new EventEmitter<number>();

    /** send mouse position to parent */
    @Output() move = new EventEmitter<pointerValue>();

    /** timeline element: main container */
    @ViewChild('timeline') _timeline: ElementRef;
    /** progress element: thin bar line */
    @ViewChild('progress') _progress: ElementRef;
    /** thumb element: current postion pointer */
    @ViewChild('thumb') _thumb: ElementRef;

    /** size of timeline; will be used to calculate progress position in pixel corresponding to time value */
    timelineDimension: ClientRect | null = null;

    // dragEvent: any;
    // dragging: (event: any) => void;

    constructor(private _renderer: Renderer2) {
        // this.dragging = this.unboundDragging.bind(this);
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (!this._timeline && !this._progress) {
            return;
        }

        if (!this.timelineDimension) {
            // calculate timeline dimension if it doesn't exist
            this.timelineDimension = this.getTimelineDimensions();
        } else {
            // recalculate timeline dimension because resized parameter has changed
            if (changes['resized']) {
                this.timelineDimension = this.getResizedTimelineDimensions();
            }
        }

        // update pointer position
        this.updateThumbPosition(this.value);
    }
    /** mouse enters the timeline */
    _onMouseenter(ev: MouseEvent) {
        this.timelineDimension = this.getTimelineDimensions();
    }
    /** mouse leaves the timeline */
    _onMousemove(ev: MouseEvent) {
        const pos: number = ((ev.clientX - this.timelineDimension.left) / this.timelineDimension.width);

        let time: number = (pos * this.max);

        if (time < 0) {
            time = 0;
        } else if (time > this.max) {
            time = this.max;
        }

        this.move.emit({ position: ev.clientX, time: time })
    }

    /** event listener on window resize */
    _onWindowResize(ev: Event) {
        this.timelineDimension = this.getResizedTimelineDimensions();
        console.log('updated?', this.timelineDimension);
    }

    updateThumbPosition(time: number) {
        // calc position on the x axis from time value
        const percent: number = (time / this.max);
        // this.timelineDimension = this.getTimelineDimensions();
        // console.log(this.timelineDimension);
        const pos: number = this.timelineDimension.width * percent;

        this.updatePosition(pos);

    }

    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    private getTimelineDimensions(): ClientRect | null {
        return this._timeline ? this._timeline.nativeElement.getBoundingClientRect() : null;
    }

    private getResizedTimelineDimensions(): ClientRect | null {
        // recalculate timeline dimension
        let newDimension: ClientRect = this.getTimelineDimensions();

        if (this.timelineDimension.width !== newDimension.width) {
            return newDimension;
        } else {
            return;
        }

    }


    updatePosition(pos: number) {

        // const pos: number = (posX); // - this.timelineDimension.left);

        // already played time
        const fillPos = (pos / this.timelineDimension.width);

        // background start position
        const bgPos = (1 - fillPos);


        this._thumb.nativeElement.style['transform'] = 'translateX(' + pos + 'px) scale(.7)';

        // adjust progress width / fill already played time
        this._progress.nativeElement.children[0].style['transform'] = 'translateX(0px) scale3d(' + bgPos + ', 1, 1)';
        // adjust progress width / progress background
        this._progress.nativeElement.children[2].style['transform'] = 'translateX(0px) scale3d(' + fillPos + ', 1, 1)';


    }

    dragStart(ev: DragEvent) {

        console.log('dragStart', ev);
    }
    //     ev.preventDefault();
    //     console.log(ev);

    //     let posX: number;

    //     if (ev.type == 'touchstart') {
    //         // posX = ev.touches[0].clientX;
    //     } else {
    //         posX = ev.clientX;
    //         // console.log(this._onMousemove);
    //         if (this.dragEvent) {
    //             this.dragEvent();
    //         }

    //         this.dragEvent = this._renderer.listen('host', 'mousemove', this.dragging);

    //         console.log(this.dragEvent);
    //         // this._onMousemove(ev);
    //         // if (this._onMousemove) {
    //         //     console.log('drag n move');
    //         // }
    //         // if (this._onMouseup) {
    //         //     console.log('drag end')
    //         // }
    //     }

    // }

    dragAction(ev: DragEvent) {
        console.log('dragAction', ev);
        this.updatePosition(ev.clientX);

        this.change.emit

    }

    dragEnd(ev: DragEvent) {

        console.log('dragEnd', ev);


    }

    _onMouseup(ev: MouseEvent) {

        const pos: number = ((ev.clientX - this.timelineDimension.left) / this.timelineDimension.width);

        // calc time value to submit to parent
        const time: number = (pos * this.max);
        this.change.emit(time)
    }

    mouseUp(ev: MouseEvent) {
        // this.calcPreviewTime(ev);
        // console.log(this.timeline);
        // console.log(this.progress);

        // this.updatePosition(ev.offsetX);

        // send value to parent


        //  .nativeElement.lastElementChild.nativeElement.style('left') = ev.offsetX + 'px';

        // console.log('mouse up on', this.previewTime)
        // this.navigate(this.previewTime);
    }

    // unboundDragging(event: MouseEvent) {
    //     console.log('unboundDragging ', event)
    //     // const pos = this.xStartElementPoint + (event.pageX - this.xStartMousePoint);
    //     // this.curY = this.yStartElementPoint + (event.pageY - this.yStartMousePoint);
    // }

}
