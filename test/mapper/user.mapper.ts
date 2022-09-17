/* eslint-disable curly */
import { MappingTarget } from '../../src/decorators/mapping-target.decorator'
import { AfterMapping } from '../../src/decorators/after-mapping.decorator'
import { BeforeMapping } from '../../src/decorators/before-mapping.decorator'
import { Mappings } from '../../src/decorators/mappings.decorator'
import { Friend, UserDto } from '../models/user.dto'
import { UserEntity } from '../models/user.entity'

export class UserMapper {
  /* -------------------*\
     UserDto -> User
  \*------------------- */

  @Mappings(
    { target: 'fullName', expression: 'getConcatProperties(userDto.fname, userDto.lname, " ")' },
    { target: 'cn', source: 'userDto.fname' },
    { target: 'sn', source: 'userDto.lname' },
    { target: 'lastConnexionTime', value: 1663180781624 },
    { target: 'bestFriend', expression: 'getBestFriend(userDto.friends)' }
  )
  entityFromDto (_userDto: UserDto): UserEntity {
    // good practice: allways return an empty typed Object
    return new UserEntity()
  }

  entitiesFromDtos (userDtos: UserDto[]): UserEntity[] {
    return userDtos.map(userDto => this.entityFromDto(userDto))
  }

  @Mappings(
    { target: 'cn', source: 'commonName' },
    { target: 'sn', source: 'secondName' },
    { target: 'bestFriend', source: 'bestFriend' }
  )
  entityFromArgs (
    _commonName: string,
    _secondName: string,
    _bestFriend: Friend
  ): UserEntity {
    return new UserEntity()
  }

  @Mappings(
    { target: 'fullName', expression: 'getConcatProperties(user.cn, user.sn, " ")' },
    { target: 'lastConnexionTime', value: 1663180781624 }
  )
  entityFromEntityAndDto (@MappingTarget() _user: UserEntity, _userDto: UserDto): UserEntity {
    return new UserEntity()
  }

  /* -------------------*\
     Mapping methods
  \*------------------- */

  getBestFriend (friends: Friend[]): Friend {
    return friends.reduce((acc: Friend, cur: Friend) => {
      return acc.friendlyPoints > cur.friendlyPoints ? acc : cur
    })
  }

  /* -------------------*\
      BeforeMapping
  \*------------------- */

  // called before entityFromDto
  @BeforeMapping()
  checkBeforeMappingDto (userDto: UserDto): void {
    if (userDto.fname === undefined || userDto.lname === undefined)
      throw new Error('1: The commonName and secondName must be defined')
  }

  // called before entityFromArgs
  @BeforeMapping()
  checkBeforeMappingArgs (commonName: string, secondName: string): void {
    if (commonName === undefined || secondName === undefined)
      throw new Error('2: The commonName and secondName must be defined')
  }

  // never called
  @BeforeMapping()
  checkBeforeMapping (userDto: UserDto, secondName: string): void {
    if (userDto.fname === undefined || secondName === undefined)
      throw new Error('3: The commonName and secondName must be defined')
  }

  // called only for entityFromEntityAndDto
  @BeforeMapping()
  checkBeforeMappingArgsWithMappingTarget (@MappingTarget() user: UserEntity): void {
    if (user.cn === undefined || user.sn === undefined)
      throw new Error('4: The commonName and secondName must be defined')
  }

  /* -------------------*\
      AfterMapping
  \*------------------- */

  // called for entityFromArgs
  @AfterMapping()
  overrideUser (@MappingTarget(UserEntity) user: UserEntity, commonName: string): void {
    user.isMajor = true
    user.sn = commonName
  }

  /* -------------------*\
      Exceptions
  \*------------------- */

  @Mappings(
    { target: 'fullName', expression: 'unknownMethod()' }
  )
  badExpressionExceptionMapper (_userDto: UserDto): UserEntity {
    return new UserEntity()
  }

  @Mappings(
    { target: 'cn', expression: 'getConcatProperties(getConcatProperties.fname)' }
  )
  illegalArgumentNameExceptionMapper (getConcatProperties: UserDto): UserEntity {
    return new UserEntity()
  }

  @Mappings(
    { target: 'cn', value: 'Ugo', source: 'userDto.fname' }
  )
  invalidMappingOptionsExceptionMapper (_userDto: UserDto): UserEntity {
    return new UserEntity()
  }

  @Mappings(
    { target: 'cn', source: 'userDto.unknownProperty' }
  )
  invalidSourceExceptionMapper (_userDto: UserDto): UserEntity {
    return new UserEntity()
  }

  @Mappings(
    { target: 'unknown', source: 'userDto.fname' }
  )
  invalidTargetExceptionMapper (_userDto: UserDto): UserEntity {
    return new UserEntity()
  }

  @Mappings()
  invalidMappingTargetExceptionMapper (@MappingTarget() _userDto: UserDto): UserEntity {
    return new UserEntity()
  }
}
