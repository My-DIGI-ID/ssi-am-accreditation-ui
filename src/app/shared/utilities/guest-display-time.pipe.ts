/*
 * Copyright 2021 Bundesrepublik Deutschland
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
