import { Expose } from 'class-transformer'
import { Friend } from './user.dto'

export class UserEntity {
  @Expose() fullName: string
  @Expose() cn: string
  @Expose() sn: string
  @Expose() bdate: number
  @Expose() isMajor: boolean
  @Expose() lastConnexionTime: number
  @Expose() bestFriend: Friend
  @Expose() friends: Friend[]
}
