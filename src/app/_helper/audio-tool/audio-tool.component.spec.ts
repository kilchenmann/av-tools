import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AudioToolComponent } from './audio-tool.component';

describe('AudioToolComponent', () => {
  let component: AudioToolComponent;
  let fixture: ComponentFixture<AudioToolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
