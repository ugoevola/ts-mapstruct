import { Expose } from "class-transformer";

export class Infra {
  @Expose() rules: Rules[]
}

export class Rules {
  @Expose() contactList: ContactCO[]
}

export class ContactCO {
  @Expose() countryCode: string;
  @Expose() cityCode: string;
  @Expose() phone: string;
  @Expose() extensionNo: string;
}