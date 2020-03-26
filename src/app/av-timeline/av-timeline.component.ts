import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';

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
        '(mouseenter)': '_onMouseenter()',
        '(mousemove)': '_onMousemove($event)',
        '(mouseup)': '_onMouseup($event)'
    }
})
export class AvTimelineComponent implements OnInit, OnChanges {

    @Input() value?: number;
    @Input() min?: number = 0;
    @Input() max: number;

    // send click position value to parent
    @Output() change = new EventEmitter<number>();

    // send mouse position value to parent
    @Output() move = new EventEmitter<pointerValue>();

    @ViewChild('timeline') _timeline: ElementRef;
    @ViewChild('progress') _progress: ElementRef;
    @ViewChild('thumb') _thumb: ElementRef;

    timelineDimension: ClientRect | null = null;

    constructor() { }

    ngOnInit(): void {
    }

    ngOnChanges() {
        if (!this._timeline && !this._progress) {
            return;
        }

        if (!this.timelineDimension) {
            this.timelineDimension = this.getTimelineDimensions();
        }

        this.updateThumbPosition(this.value);
    }

    _onMouseenter() {
        this.timelineDimension = this.getTimelineDimensions();
    }
    _onMousemove(ev: MouseEvent) {
        const pos: number = ((ev.clientX - this.timelineDimension.left) / this.timelineDimension.width);

        let time: number = (pos * this.max);

        if (time < 0) {
            time = 0;
        } else if (time > this.max) {
            time = this.max;
        }

        this.move.emit({ position: ev.clientX, time: time })
        // console.log(this.timeline);
        // this._getSliderDimensions();
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
    private getTimelineDimensions() {
        return this._timeline ? this._timeline.nativeElement.getBoundingClientRect() : null;
    }


    updatePosition(posX: number) {

        const pos: number = (posX); // - this.timelineDimension.left);

        // already played time
        const fillPos = (pos / this.timelineDimension.width);

        // background start position
        const bgPos = (1 - fillPos);

        // adjust progress width / fill already played time
        this._progress.nativeElement.children[0].style['transform'] = 'translateX(0px) scale3d(' + bgPos + ', 1, 1)';
        // adjust progress width / progress background
        this._progress.nativeElement.children[2].style['transform'] = 'translateX(0px) scale3d(' + fillPos + ', 1, 1)';

        this._thumb.nativeElement.style['transform'] = 'translateX(' + pos + 'px)';

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

}
