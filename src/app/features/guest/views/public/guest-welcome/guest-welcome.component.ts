import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationURL } from '../../../../../shared/utilities/application-url';

@Component({
  selector: 'app-welcome',
  templateUrl: './guest-welcome.component.html',
  styleUrls: ['./guest-welcome.component.scss'],
})
export default class GuestWelcomeComponent {
  public isFirstStepActive: boolean = true;

  public isConfirmCheckboxChecked: boolean = false;

  public guestId: string;

  public constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {
    // TODO: where is from the ID?
    this.guestId = this.activatedRoute.snapshot.params.id;
  }

  public nextStep(): void {
    this.isFirstStepActive = false;
  }

  public changeQRCodeVisibility(value: boolean): void {
    this.isConfirmCheckboxChecked = value;
  }

  public goToAccreditation(): void {
    this.router.navigate([ApplicationURL.GuestAccreditation, this.guestId]);
  }
}
