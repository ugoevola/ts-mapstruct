import { Expose } from "class-transformer";

export class InfraEntity {
  @Expose() rules: RulesEntity[]
}

export class RulesEntity {
  @Expose() contactNumbers: ContactNumber[]
}

export class ContactNumber {
  @Expose() countryCode?: string;
  @Expose() areaCode?: string;
  @Expose() main?: string;
  @Expose() extension?: string;
  @Expose() phone?: string;
}