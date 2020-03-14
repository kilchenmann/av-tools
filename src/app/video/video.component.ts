import { element } from 'protractor';
import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
    selector: 'kui-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewChecked {

    @Input() src: string;

    @ViewChild('video') video: ElementRef;
    @ViewChild('progress') progress: ElementRef;

    videoWidth: number = 1280;
    videoHeight: number;
    aspectRatio: number;

    currentTime: number = 0;
    duration: number;

    currentBuffer: number;

    play: boolean = false;

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
    }

    updateTimeFromButton(range: number) {
        this.navigate(this.currentTime + range);
    }

    updateTimeFromSlider(ev: MatSliderChange) {
        this.navigate(ev.value);
    }

    updateTimeFromScroll(ev: WheelEvent) {
        console.log(ev.deltaY / 25);
        this.navigate(this.currentTime + (ev.deltaY / 25));
    }

    private navigate(position: number) {

        this.video.nativeElement.currentTime = position;
    }


    onResize(event) {
        // console.log('width on resize', this.player.nativeElement.offsetWidth);
    }

    preview(ev: MouseEvent) {
        console.log(ev);
        const progressBarWidth: number = this.progress.nativeElement.offsetWidth;
        const position: number = ev.offsetX;

        // calc time
        const secondsPerPixel = this.duration / progressBarWidth;

        // console.log('progressBarWidth?', progressBarWidth)
        // console.log('duration?', this.duration)
        // console.log('secondsPerPixel?', secondsPerPixel)
        // console.log('position?', position)
        console.log('seconds?', position * secondsPerPixel);
        console.log('===============================================');


    }
}
