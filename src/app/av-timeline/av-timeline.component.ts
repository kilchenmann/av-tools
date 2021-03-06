import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChange, ViewChild } from '@angular/core';

export interface PointerValue {
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
        // '(mousedown)': '_onMousemove($event)',
        '(mouseup)': '_onMouseup($event)',
        '(window:resize)': '_onWindowResize($event)'
    }
})
export class AvTimelineComponent implements OnChanges {

    /** current time value */
    @Input() value: number;

    /** start time value */
    @Input() min? = 0;

    /** end time value: Normally this is the duration */
    @Input() max: number;

    /** in case parent resized: Will be used in video player when switching between cinema and default view  */
    @Input() resized: boolean;

    /** send click position to parent */
    @Output() changed = new EventEmitter<number>();

    /** send mouse position to parent */
    @Output() move = new EventEmitter<PointerValue>();

    /** timeline element: main container */
    @ViewChild('timeline') timelineEle: ElementRef;
    /** progress element: thin bar line */
    @ViewChild('progress') progressEle: ElementRef;
    /** thumb element: current postion pointer */
    @ViewChild('thumb') thumbEle: ElementRef;

    dragging = false;

    /** size of timeline; will be used to calculate progress position in pixel corresponding to time value */
    timelineDimension: ClientRect | null = null;

    // dragEvent: any;
    // dragging: (event: any) => void;

    constructor() {
        // this.dragging = this.unboundDragging.bind(this);
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (!this.timelineEle && !this.progressEle) {
            return;
        }

        if (!this.timelineDimension) {
            // calculate timeline dimension if it doesn't exist
            this.timelineDimension = this.getTimelineDimensions();
        } else {
            // recalculate timeline dimension because resized parameter has changed
            if (changes.resized) {
                this.timelineDimension = this.getResizedTimelineDimensions();
            }
        }

        // update pointer position from time
        this.updatePositionFromTime(this.value);
    }

    updatePositionFromTime(time: number) {
        // calc position on the x axis from time value
        const percent: number = (time / this.max);

        const pos: number = this.timelineDimension.width * percent;

        this.updatePosition(pos);
    }

    updatePosition(pos: number) {
        // already played time
        const fillPos = (pos / this.timelineDimension.width);

        // background (timeline fill) start position
        const bgPos = (1 - fillPos);

        if (!this.dragging) {
            // update thumb position if not dragging
            this.thumbEle.nativeElement.style.transform = 'translateX(' + pos + 'px) scale(.7)';
        }
        // adjust progress width / fill already played time
        this.progressEle.nativeElement.children[0].style.transform = 'translateX(0px) scale3d(' + bgPos + ', 1, 1)';
        // adjust progress width / progress background
        this.progressEle.nativeElement.children[2].style.transform = 'translateX(0px) scale3d(' + fillPos + ', 1, 1)';
    }

    toggleDragging() {
        this.dragging = !this.dragging;
    }

    dragAction(ev: CdkDragMove) {
        const pos: number = (ev.pointerPosition.x - this.timelineDimension.left);
        this.updatePosition(pos);
    }

    /** mouse enters timeline */
    _onMouseenter(ev: MouseEvent) {
        this.timelineDimension = this.getTimelineDimensions();
    }

    /** mouse moves on timeline */
    _onMousemove(ev: MouseEvent) {

        const pos: number = ev.clientX - this.timelineDimension.left;

        const percent: number = pos / this.timelineDimension.width;

        let time: number = (percent * this.max);

        if (time < 0) {
            time = 0;
        } else if (time > this.max) {
            time = this.max;
        }

        this.move.emit({ position: ev.clientX, time });
    }

    _onMouseup(ev: MouseEvent) {

        const pos: number = (ev.clientX - this.timelineDimension.left);

        this.updatePosition(pos);

        // const pos: number = ((ev.clientX - this.timelineDimension.left) / this.timelineDimension.width);

        const percentage: number = (pos / this.timelineDimension.width);

        // // calc time value to submit to parent
        const time: number = (percentage * this.max);

        this.changed.emit(time);
    }

    /** event listener on window resize */
    _onWindowResize(ev: Event) {
        this.timelineDimension = this.getResizedTimelineDimensions();
    }

    /**
     * Get the bounding client rect of the slider track element.
     * The track is used rather than the native element to ignore the extra space that the thumb can
     * take up.
     */
    private getTimelineDimensions(): ClientRect | null {
        return this.timelineEle ? this.timelineEle.nativeElement.getBoundingClientRect() : null;
    }

    private getResizedTimelineDimensions(): ClientRect | null {
        // recalculate timeline dimension
        const newDimension: ClientRect = this.getTimelineDimensions();

        if (this.timelineDimension.width !== newDimension.width) {
            return newDimension;
        } else {
            return;
        }

    }

}
