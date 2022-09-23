import { Expose } from 'class-transformer'

export class FriendEntity {
  @Expose() friendlyPoints: number
  @Expose() fname: string
  @Expose() bdate: Date
}

export class UserEntity {
  @Expose() fullName: string
  @Expose() cn: string
  @Expose() sn: string
  @Expose() bdate: number
  @Expose() isMajor: boolean
  @Expose() lastConnexionTime: number
  @Expose() bestFriend: FriendEntity
  @Expose() friends: FriendEntity[]
}
