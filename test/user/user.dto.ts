import { Expose } from 'class-transformer'

export class FriendDto {
  @Expose() friendlyPoints: number
  @Expose() fname: string
  @Expose() bdate: string
}

export class UserDto {
  @Expose() fname?: string
  @Expose() lname?: string
  @Expose() bdate?: number
  @Expose() isMajor?: boolean
  @Expose() gender?: GenderEnum
  @Expose() friends?: FriendDto[]
}

export enum GenderEnum {
  M,
  F
}
