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
 * Main data model for a view.
 * This root model OPTIONALLY may implement data structure interfaces of all subset models
 * Or may implement limited set of properties that views are intersted in
 * "golden source" for a view
 */
export default class EmployeeViewModel {
  firstName!: string;

  lastName!: string;

  employeeId?: string;

  email?: string;

  firmName?: string;

  firmSubject?: string;

  firmStreet?: string;

  firmPostalCode?: string;

  firmCity?: string;
}
