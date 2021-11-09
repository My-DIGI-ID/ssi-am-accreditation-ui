import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
// eslint-disable-next-line import/prefer-default-export
export class ConfirmationComponent {
  @Input() accreditationAccepted = false;
}
