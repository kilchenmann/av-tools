import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild, HostListener } from '@angular/core';

@Component({
    selector: 'kui-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewChecked {

    @Input() src: string;

    @ViewChild('video') video: ElementRef;

    videoWidth: number = 1280;
    videoHeight: number;
    aspectRatio: number;

    currentTime: number = 0;
    duration: number;

    currentBuffer: number;

    play: boolean = false;

    muted: boolean = false;

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
        console.log(this.currentTime);

        // buffer progress
        this.currentBuffer = (this.video.nativeElement.buffered.end(0) / this.duration) * 100;

    }

    navigate(range: number) {

        this.video.nativeElement.currentTime = this.currentTime + range;
    }

    statusUpdate(ev: Event) {
        this.duration = this.video.nativeElement.duration;
    }

    goto(ev: any) {
        this.video.nativeElement.currentTime = ev.value;
    }

    onResize(event) {
        // console.log('width on resize', this.player.nativeElement.offsetWidth);
    }
}
