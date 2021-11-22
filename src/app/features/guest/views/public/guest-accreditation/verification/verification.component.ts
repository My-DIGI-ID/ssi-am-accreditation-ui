import { Component, Output, EventEmitter, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import GuestStoreService from '../../../../services/stores/guest-store.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  @Output()
  public qrCodeIsScanned: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isGDPRChecked: boolean = false;

  public showQRCode: boolean = false;

  private accreditationId: string;

  @ViewChild('qrcode') qrcode: ElementRef;

  public constructor(private readonly guestStoreService: GuestStoreService, private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.accreditationId = params.id;
    });
  }

  public onGDPRChecked(value: boolean): void {
    this.isGDPRChecked = value;

    if (value) {
      this.getQRCode();
    } else {
      this.showQRCode = false;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getQRCode(): void {
    this.guestStoreService.getQRCode(this.accreditationId).subscribe((QRCodeSVG) => {
      this.qrcode.nativeElement.innerHTML = QRCodeSVG;
      this.showQRCode = true;

      this.initializeBasisIdVerification();
    });
  }

  private initializeBasisIdVerification(): void {
    if (this.accreditationId) {
      this.guestStoreService.pollBasisIdProcessing(this.accreditationId).subscribe((value: any) => {
        localStorage.setItem('actionToken', value.actionToken);
        this.qrCodeIsScanned.emit(true);
      });
    }
  }
}
