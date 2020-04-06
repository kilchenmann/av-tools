# AvTools

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.5.

It's the developing environment and playground for the A/V tools in [Knora](https://knora.org) and [Sipi](https://sipi.io).

The app starts with a kind of index of test videos (and later additionally with audio documents). It simulates the view of search results - "how it could look like". The main important part is the dynamic video preview container based on the mouse movement.

A click on a certain object, opens the video player. An own designed html5 video player with the following functionallity:

- Toggle Play/Pause on button, on video itself and on timecode.
- Scrolling through the video step by step to quickly find a desired scene. This scroll event is enabled on the timecode.
- Frame and time preview while moving with the mouse on the progress bar
- Jump to position by clicking on the timeline
- Toggle view mode default/cinema. Cinema view mode resizes the video to 100% of window width (or height; depending on aspect ratio of video and window) with dark background around the video player
- Toggle Volume on/off. The volume inside the video player is not necessary. It can be changed using the volume control on the computer. The video player itself sets a default volume for each video.

- Action buttons
  - Play/Pause
  - 10 seconds back, 10 seconds forward
  - Volume on/off
  - Cinema mode

---

## Development server

Install the necessary packages with `yarn install`.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
