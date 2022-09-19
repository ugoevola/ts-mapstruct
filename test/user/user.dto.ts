import { Expose } from 'class-transformer'

export class UserDto {
  @Expose() fname?: string
  @Expose() lname?: string
  @Expose() bdate?: number
  @Expose() isMajor?: boolean
  @Expose() gender?: GenderEnum
  @Expose() friends?: Friend[]
}

export class Friend extends UserDto {
  @Expose() friendlyPoints: number
}

export enum GenderEnum {
  M, F
}
