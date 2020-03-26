import { style } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

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
        '(mousemove)': '_onMousemove()'
    }
})
export class AvTimelineComponent implements OnInit {

    @Input() value?: number;
    @Input() min?: number = 0;
    @Input() max: number;

    // send click position value to parent
    @Output() change = new EventEmitter<number>();

    // send mouse position value to parent
    @Output() move = new EventEmitter<number>();


    @ViewChild('timeline') _timeline: ElementRef;
    @ViewChild('progress') _progress: ElementRef;
    @ViewChild('thumb') _thumb: ElementRef;


    timelineDimension: ClientRect | null = null;

    constructor() { }

    ngOnInit(): void {
    }

    _onMouseenter() {
        this.timelineDimension = this.getTimelineDimensions();
        console.log(this.timelineDimension);
    }
    _onMousemove() {
        // console.log(this.timeline);
        // this._getSliderDimensions();
    }

    /**
 * Get the bounding client rect of the slider track element.
 * The track is used rather than the native element to ignore the extra space that the thumb can
 * take up.
 */
    private getTimelineDimensions() {
        return this._timeline ? this._timeline.nativeElement.getBoundingClientRect() : null;
    }


    updatePosition(ev: MouseEvent) {

        const pos: number = (ev.clientX - this.timelineDimension.left);

        // already played time
        const fillPos = (pos / this.timelineDimension.width);
        // background start position
        const bgPos = (1 - fillPos);

        // adjust progress width / fill already played time
        this._progress.nativeElement.children[0].style['transform'] = 'translateX(0px) scale3d(' + bgPos + ', 1, 1)';
        // adjust progress width / progress background
        this._progress.nativeElement.children[2].style['transform'] = 'translateX(0px) scale3d(' + fillPos + ', 1, 1)';

        this._thumb.nativeElement.style['transform'] = 'translateX(' + pos + 'px)';
        // lastChild.style['transform'] = 'translateX(' + pos + 'px)';
        // this.progress.nativeElement.firstChild.style['width'] = '100%';
        // this.progress.nativeElement.firstChild.style['transform'] = 'translateX(0px) scale3d(' + posInPercent + ', 1, 1)';

        // calc time value to submit to parent
        const time: number = (fillPos * this.max);
        console.log('update', time);
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
