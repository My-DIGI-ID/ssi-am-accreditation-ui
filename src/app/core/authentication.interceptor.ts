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
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export default class AuthenticationInterceptor implements HttpInterceptor {
  /**
   *
   * @param req
   * @param next
   * @returns
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //   once there is an auth service:
    // const TOKEN = this.authService.getToken();
    const TOKEN = localStorage.getItem('actionToken');
    let request = req;

    if (TOKEN) {
      request = request.clone({ headers: request.headers.set('Authorization', `${TOKEN}`) });
    }

    if (!req.headers.has('Content-Type') && !(req.body instanceof FormData)) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden)
        ) {
          /*
           * @todo: add redirect to login
           */
        }

        return throwError(error);
      })
    );
  }
}
