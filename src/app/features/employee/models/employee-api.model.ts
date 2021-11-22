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
