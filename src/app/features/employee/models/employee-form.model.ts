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
 * Model containing the employee form attributes
 */
export default class EmployeeFormModel {
  firstName!: string;

  lastName!: string;

  primaryPhone: string;

  secondaryPhone?: string;

  title?: string;

  email?: string;

  employeeStatus: string;

  employeeRole: string;

  employeeId?: string;

  firmName?: string;

  firmSubject?: string;

  firmStreet?: string;

  firmPostalCode?: string;

  firmCity?: string;

  firmReference?: string;
}
