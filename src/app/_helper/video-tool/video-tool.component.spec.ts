import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VideoToolComponent } from './video-tool.component';

describe('VideoToolComponent', () => {
  let component: VideoToolComponent;
  let fixture: ComponentFixture<VideoToolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
