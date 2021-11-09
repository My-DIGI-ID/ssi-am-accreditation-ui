export default class GuestApiModel {
  id: string;

  title?: string;

  firstName: string;

  lastName: string;

  email: string;

  primaryPhoneNumber?: string;

  secondaryPhoneNumber?: string;

  companyName: string;

  typeOfVisit: string;

  location: string;

  validFrom: string;

  validUntil: string;

  issuedBy?: string; // alias: issuedBy

  createdBy?: string;

  createdAt?: string;
}
