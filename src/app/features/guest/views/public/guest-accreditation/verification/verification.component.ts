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

import { Component, Output, EventEmitter, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import GuestStoreService from '../../../../services/stores/guest-store.service';

/**
 * Class representing the VerificationComponent
 */
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

  /**
   * Instantiates the VerificationComponent
   * @param {GuestStoreService} guestStoreService - Guest Store Service - a service providing functions related to the guest
   * @param {ActivatedRoute} activeRoute - An observable of the URL segments matched by this route.
   */
  public constructor(private readonly guestStoreService: GuestStoreService, private activeRoute: ActivatedRoute) {}

  /**
   * Initialisation function that sets the value of the accreditation ID based on the ID used as parameter in the URL
   */
  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.accreditationId = params.id;
    });
  }

  /**
   * If the GDPR box is checked, the QR code is retrieved, otherwise no QR is shown
   * @param {boolean} value - value showing whether GDPR has already been checked or not
   */
  public onGDPRChecked(value: boolean): void {
    this.isGDPRChecked = value;

    if (value) {
      this.getQRCode();
    } else {
      this.showQRCode = false;
    }
  }

  /**
   * Retrieves QR code by subscribing to the getQRCode function from the guest storage,
   * being called with the guest accreditation ID as parameter. Then the basis ID verification is initialised.
   */
  private getQRCode(): void {
    this.guestStoreService.getQRCode(this.accreditationId).subscribe((QRCodeSVG) => {
      this.qrcode.nativeElement.innerHTML = QRCodeSVG;
      this.showQRCode = true;

      this.initializeBasisIdVerification();
    });
  }

  /**
   * Initialises the basis ID verification. If there is an accreditation ID, the basis ID processing
   * is polled, an action token is set in the local storage and an event is emitted pointing out that
   * the QR code was scanned
   */
  private initializeBasisIdVerification(): void {
    if (this.accreditationId) {
      this.guestStoreService.pollBasisIdProcessing(this.accreditationId).subscribe((value: any) => {
        localStorage.setItem('actionToken', value.actionToken);
        this.qrCodeIsScanned.emit(true);
      });
    }
  }
}
