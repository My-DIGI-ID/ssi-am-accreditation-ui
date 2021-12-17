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

// import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Base class for every store service created in a feature module
 * Purpose: generalize init and subscription
 * Purpose: create common signature for every store
 * @TODO - all abstractions to be moved into Patmos
 */
export default abstract class AbstractStore<T> {
  /**
   * Private subject - public observable pattern
   * Provides a public observable to an interested views
   * While keeping subject itself private, so that .next() can be called only from within service
   * BehaviorSubject in order to hold last and initial value
   */
  protected storeSubject: BehaviorSubject<T>;

  protected store: Observable<T>;

  constructor() {
    // ToDo: strict complains without non-null assertion operator
    this.storeSubject = new BehaviorSubject<T>(null!);
    this.store = this.storeSubject.asObservable().pipe(filter((initialStore) => !!initialStore));
  }

  /**
   * Shared implementation for public subscription
   * @TODO - consider different naming or restrict modifier for this.config
   */
  connect(): Observable<T> {
    return this.store;
  }

  /**
   * Provides a common way of store initialization and first value emit
   * @param ...args - might contain any number of arguments,
   * buildStore() method implementation have to handle this respectively
   */
  init(...args: any): void {
    this.buildStore(args).subscribe(
      (store) => {
        this.storeSubject.next(store);
      },
      (error) => console.error(error)
    );
  }

  /**
   * Reset the store subject
   */
  reset(): void {
    this.storeSubject.next(null!); // ToDo: strict complains without non-null assertion operator
  }

  /**
   * To implement exact initialization build logic
   * @param ...args - might contain any arguments, method implementation have to handle this respectively
   */
  // eslint-disable-next-line no-unused-vars
  protected abstract buildStore(...args: any): Observable<T>;

  /*
  protected getStoreCopy(): T {
    return cloneDeep(this.storeSubject.value) as T;
  }
  */

  protected publish(storeCopy: T) {
    this.storeSubject.next(storeCopy);
  }
}
