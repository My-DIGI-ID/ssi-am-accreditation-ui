/* eslint-disable class-methods-use-this */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'guestDisplayPipe' })
export class GuestDisplayPipe implements PipeTransform {
  public transform(input: number): string {
    const inputDate = new Date(input);
    const dateArray = inputDate.toDateString().split(' ');

    let date = dateArray[2].concat(' ', dateArray[1]);

    const today = new Date(Date.now());
    const dateTodayArray = today.toDateString().split(' ');

    if (
      dateTodayArray[1] === dateArray[1] &&
      dateTodayArray[2] === dateArray[2] &&
      dateTodayArray[3] === dateArray[3]
    ) {
      date = 'Today';
    }

    const time = inputDate.toLocaleTimeString().slice(0, 5);

    return date.concat(', ', time);
  }
}
