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

import { Injectable } from '@angular/core';
import { SwUpdate, UnrecoverableStateEvent, UpdateActivatedEvent, UpdateAvailableEvent } from '@angular/service-worker';
import { Observable } from 'rxjs';

/**
 * Class representing the NgswService
 */
@Injectable()
export default class NgswService {
  /**
   * Instantiates the NgswService
   * @param {SwUpdate} swUpdateService - Subscribe to update notifications from the Service Worker, trigger update checks, and forcibly activate updates.
   */
  constructor(private swUpdateService: SwUpdate) {}

  /**
   * Checks if the Service Worker is enabled
   * @return {boolean} Service Worker enabled status
   */
  public isEnabled(): boolean {
    return this.swUpdateService.isEnabled;
  }

  /**
   * Checks if updates are available
   * @return {Observable<UpdateAvailableEvent>} updates available status
   */
  public isUpdateAvailable(): Observable<UpdateAvailableEvent> {
    return this.swUpdateService.available;
  }

  /**
   * Triggers the app update
   * @return {Promise<void>} promise
   */
  public activateUpdate(): Promise<void> {
    return this.swUpdateService.activateUpdate();
  }

  /**
   * Checks if update is activated
   * @return {Observable<UpdateActivatedEvent>} update active status
   */
  public isUpdateActivated(): Observable<UpdateActivatedEvent> {
    return this.swUpdateService.activated;
  }

  /**
   * Emits an UnrecoverableStateEvent event whenever the version of the app used by the service worker
   * to serve this client is in a broken state that cannot be recovered from without a full page reload.
   * @return {Observable<UnrecoverableStateEvent>} unrecoverable event
   */
  public handleUnrecoverableState(): Observable<UnrecoverableStateEvent> {
    return this.swUpdateService.unrecoverable;
  }
}
