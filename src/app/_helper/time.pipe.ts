import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'kuiTime'
})
export class TimePipe implements PipeTransform {

    transform(value: number): string {

        const dateObj: Date = new Date(value * 1000);
        const hours: number = dateObj.getUTCHours();
        const minutes = dateObj.getUTCMinutes();
        const seconds = dateObj.getSeconds();

        const time: string = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');

        return time;

    }

}
