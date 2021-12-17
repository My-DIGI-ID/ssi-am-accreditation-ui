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

/**
 * Subset data model that represents an asset as it seen in the back-end
 * Root cause: separation of BE asset model and view model (transfer model) is reality that reflects current requirements
 * Thus currently conversion is already done in arbitrary places (even given builder pattern)
 * So the goal is to provide a generic way of converting and composing data structures
 * and make sure conversion logic lives in one place and is predictable.
 * Should not contain anything other than interface implementation or factory methods
 */
export default class EmployeeApiModel {
  id: string;

  firstName!: string;

  lastName!: string;

  primaryPhoneNumber: string;

  secondaryPhoneNumber?: string;

  title?: string;

  email?: string;

  employeeState: string;

  position?: string;

  employeeId?: string;

  companyName?: string;

  companyStreet?: string;

  companyPostalCode?: string;

  companyCity?: string;

  companyReference?: string;
}
