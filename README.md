# ts-mapstruct

TS-Mapstruct is an approach of the JAVA [MapStruct](https://mapstruct.org/) addapted in  **TypeScript**.
It's a code generator that simplifies the implementation of mappings over configuration approach.

## Installation

```
npm install ts-mapstruct
```
## Recommendations

It is recommended that the DTO constructor can be empty for simplify the code, but it is not a problem if it cannot.

This is a library that is made to go hand in hand with [Nestjs](https://nestjs.com/). It goes well with its layered architecture, and can be used in an Injectable. This can facilitate dependency injection if you need other classes to do your mapping.
## Usage
For the exemple, I will take a **UserMapper** that maps a **UserDto** into **UserEntity**.
### DTO

```ts
export class UserDto {
  private fname: string;
  private lname: string;
  private bdate: number;
  private isMajor: boolean;
  private gender: GenderEnum;
  private friends: Friend[];
}

export class Friend extends UserDto {
  private friendlyPoints: number;
}

```
```ts
export class UserEntity {
  private fullName: string;
  private cn: string;
  private sn: string;
  private bdate: number;
  private isMajor: boolean;
  private lastConnexionTime: number;
  private bestFriend: Friend;
  private friends: Friend[];

  constructor(fullName?: string) {
    this.fullName = fullName;
  }
}
```
### Mapper

```ts
@Injectable()
export class UserMapper {

  /*-------------------*\
     UserDto -> User
  \*-------------------*/

  @Mappings(
    { target: 'fullName', expression: 'getConcatProperties(userDto.fname, userDto.lname)' },
    { target: 'cn', source: 'userDto.fname' },
    { target: 'sn', source: 'userDto.sname' },
    { target: 'lastConnexionTime', value: Date.now() },
    { target: 'bestFriend', expression: 'getBestFriend(userDto.friends)' }
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    // good practice: allways return an empty typed Object
    return new UserEntity;
  }

  entitiesFromDtos(userDto: UserDto[]): UserEntity[] {
    return userDto.map(this.entityFromDto);
  }

  /*-------------------*\
     Mapping methods
  \*-------------------*/
  
  getBestFriend(friends: Friend[]): Friend {
    return friends.reduce((acc: Friend, cur: Friend) => {
      return acc.friendlyPoints > cur.friendlyPoints ? acc : cur;
    })
  }
}
```
### Usage
```ts
@Injectable()
export class UserService {
  constructor(private userMapper: UserMapper) {}

  getUser(userDto: UserDto): UserEntity {
    return this.userMapper.entityFromDto(userDto);
  }

  getUsers(userDtos: UserDto[]): UserEntity[] {
    return this.userMapper.entitiesFromDtos(userDtos);
  }
}
```
### @BeforeMapping / @AfterMapping

The method invocation is only generated if all parameters can be assigned by the available source of the mapping method.

**The recovery of the sources is done on the name of the arguments and not on the type. If you do not name the argument at the same way, the method will not be invoked.** 

```ts
Injectable()
export class UserMapper {

  /*-------------------*\
     UserDto -> User
  \*-------------------*/

  @Mappings(
    { target: 'fullName', expression: 'getConcatProperties(userDto.fname, userDto.lname)' },
    { target: 'cn', source: 'userDto.fname' },
    { target: 'sn', source: 'userDto.sname' },
    { target: 'lastConnexionTime', value: Date.now() }
  )
  entityFromDto(_userDto: UserDto): UserEntity { 
    // @deprecated
    // there, you can perform of some actions before the mapping execution,
    // but this was not planned for.
    // The behavior is therefore not guaranteed.
    // use @BeforeMapping instead
    return new UserEntity;
  }

  @Mappings(
    { target: 'cn', source: 'commonName' },
    { target: 'sn', source: 'secondName' },
    { target: 'bestFriend', source: 'bestFriend' }
  )
  entityFromArgs(
    _commonName: string,
    _secondName: string,
    _bestFriend: Friend
  ): UserEntity {
    return new UserEntity;
  }

  /*-------------------*\
      BeforeMapping
  \*-------------------*/

  // called before entityFromDto
  @BeforeMapping()
  checkBeforeMappingDto(userDto: UserDto): void {
    if (userDto.fname === undefined || userDto.sname === undefined)
      throw new Error('The commonName and secondName must be defined')
  }

  // called before entityFromArgs
  @BeforeMapping()
  checkBeforeMappingArgs(commonName: string, secondName: string): void {
    if (commonName === undefined || secondName === undefined)
      throw new Error('The commonName and secondName must be defined')
  }

  // never called
  @BeforeMapping()
  checkBeforeMapping(userDto: UserDto, secondName: string): void {
    if (userDto.fname === undefined || secondName === undefined)
      throw new Error('The commonName and secondName must be defined')
  }

  /*-------------------*\
      AfterMapping
  \*-------------------*/

  // allways called
  @AfterMapping()
  logAfterMapping() {
    console.log('Mapping is finished.');
  }
  

}
```

Note: if you return object from your @AfterMapping or @BeforeMapping function, it will not be considered.

### @MappingTarget
The MappingTarget allows you to pass the resulting object throw the method to perform some actions on it.

```ts
Injectable()
export class UserMapper {

  /*-------------------*\
     UserDto -> User
  \*-------------------*/

  @Mappings(
    { target: 'fullName', expression: 'getConcatProperties(user.fn, user.sn)' },
    { target: 'lastConnexionTime', value: Date.now() }
  )
  entityFromDto(@MappingTarget() user: UserEntity, _userDto: UserDto): UserEntity {
    return new UserEntity;
  }

  @Mappings(
    { target: 'cn', source: 'commonName' },
    { target: 'sn', source: 'secondName' },
    { target: 'bestFriend', source: 'bestFriend' }
  )
  entityFromArgs(
    _commonName: string,
    _secondName: string,
    _bestFriend: Friend
  ): UserEntity {
    return new UserEntity;
  }

  /*-------------------*\
      BeforeMapping
  \*-------------------*/

  // called only for entityFromDto
  @BeforeMapping()
  checkBeforeMappingArgs(@MappingTarget() user: UserEntity): void {
    if (user.cn === undefined || user.sn === undefined)
      throw new Error('The commonName and secondName must be defined')
  }

  /*-------------------*\
      AfterMapping
  \*-------------------*/

  // called for both entityFromDto AND entityFromArgs
  @AfterMapping()
  overrideUser(@MappingTarget(User) user: UserEntity): void {
    user.isMajor = true;
  }

}
```
Notes: There are 2 differences between using **@MappingTarget** in the **@BeforeMapping** method and the **@AfterMapping** method:
- In a **@BeforeMapping**, the **@MappingTarget** argument must be part of the mapping method's arguments in order to invoke the **@BeforeMapping** method. Whereas in the **@AfterMapping** method, the **@MappingTarget** argument is not a required argument of the mapping method to invoke the **@AfterMapping** method.
- For using **@MappingTarget** in **@AfterMapping** method, you must provide the return type of the mappingMethod in **@MappingTarget** decorator.


### Mapping Options
MappingOptions is the object that you have to pass throw the @Mappings decorator. This is what it looks like:
| Properties  | Description |  Required |
| ----------- | ----------- | ------------ |
| target      | The target name property | true |
| source      | The source name property       | false |
| value      | A direct value       | false |
| expression   | A JS expression        | false |

You must provide exactly one of the non required properties in the @Mappings decorator, an Exception will be throw otherwise.

### Supplied Mapping Functions
the mapper provides some functions to pass via the "expression" property to facilitate the mapping:
```ts
/**
*  concatenates each property provided in the running order.
*  You have the possibility to define a separator passed at the last index
*  @params properties: properties to concat
*  @return string: the concatenation of each properties
*  @required each property must be a string
*/
getConcatProperties(...properties: [...string, string?]): string
```
## Exceptions thrown

The thrown exceptions are extends of the HttpException of nestjs/common. 

**BadExpressionExceptionMapper**

```ts
Injectable()
export class UserMapper {
  
  // this will throw a BadExpressionExceptionMapper because the expression for fullName can't be evaluated (unknownMethod does not exist)
  @Mappings(
    { target: 'fullName', expression: 'unknownMethod()' },
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    return new UserEntity;
  }
}
```

**IllegalArgumentNameExceptionMapper**

```ts
Injectable()
export class UserMapper {
  
  // This will throw an IllegalArgumentNameExceptionMapper because getConcatProperties is a reserved name used for supplied mapping funcions
  // All supplied mapping function name are forbidden for naming the arguments.
  // cf. Supplied Mapping Functions
  @Mappings()
  entityFromDto(getConcatProperties: UserDto): UserEntity {
    return new UserEntity;
  }
}
```

**InvalidMappingOptionsExceptionMapper**

```ts
Injectable()
export class UserMapper {
  
  // this will throw an InvalidMappingOptionsExceptionMapper because you provide multiple sources (value and source) for cn in one MappingOption
  @Mappings(
    { target: 'cn', value: 'Ugo', source: 'userDto.fname' },
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    return new UserEntity;
  }
}
```

**InvalidSourceExceptionMapper**

```ts
Injectable()
export class UserMapper {
  
  // this will throw an InvalidSourceExceptionMapper because userDto.unknownProperty does not exist
  @Mappings(
    { target: 'cn', source: 'userDto.unknownProperty' },
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    return new UserEntity;
  }
}
```

**InvalidTargetExceptionMapper**

```ts
Injectable()
export class UserMapper {
  
  // this will throw an InvalidTargetExceptionMapper because unknown does not exist on UserEntity
  @Mappings(
    { target: 'unknown', source: 'userDto.unknownProperty' },
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    return new UserEntity;
  }
}
```