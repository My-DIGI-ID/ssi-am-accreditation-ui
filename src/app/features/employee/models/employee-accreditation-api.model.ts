import EmployeeApiModel from './employee-api.model';

export default class EmployeeAccreditationApiModel {
  id!: string;

  employee!: EmployeeApiModel;

  status!: string;

  invitationUrl!: string;

  invitationEmail!: string;

  invitationQrCode!: string;
}
