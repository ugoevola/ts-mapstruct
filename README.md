# ts-mapstruct

TS-Mapstruct is an approach of the JAVA [MapStruct](https://mapstruct.org/) addapted in  **TypeScript**.
It's a code generator that simplifies the implementation of mappings over configuration approach.
## Table of contents
- [Installation](#installation)
- [Recommendations](#recommendations)
- [Usage](#usage)
  - [Classes](#classes)
  - [Mapper](#mapper)
  - [Usage](#usage-1)
  - [Type conversion](#type-conversion)
  - [Implicit Mapping](#implicit-mapping)
  - [@BeforeMapping / @AfterMapping](#beforemapping--aftermapping)
  - [@MappingTarget](#mappingtarget)
  - [MappingOptions](#mapping-options)
  - [Supplied Mapping Functions](#supplied-mapping-functions)
- [Exceptions thrown](#exceptions-thrown)

## Installation

```
npm install ts-mapstruct
```
## Recommendations

It is recommended that the DTO constructor can be empty for simplify the code, but it is not a problem if this is not the case.

This is a library that is designed to go hand in hand with [Nestjs](https://nestjs.com/). It fits well with its layered architecture, and can be used in an Injectable. This can make dependency injection easier if you need other services to make your mapping.<br>
But it can be used in any typescript project.
## Usage
For the exemple, I will take a **UserMapper** that maps a **UserDto** into **UserEntity**.
### Classes
You must expose the properties of the target class by using an apropriate decorator.<br>
Otherwise, you will retrieve an empty Object, and probably have MapperExceptions. <br>
In this example, I'm using @Expose() decorator of the [class-tranformer library](https://www.npmjs.com/package/class-transformer#enforcing-type-safe-instance)
```ts
export class UserDto {
  @Expose() private fname: string;
  @Expose() private lname: string;
  @Expose() private bdate: number;
  @Expose() private isMajor: boolean;
  @Expose() private gender: GenderEnum;
  @Expose() private friends: FriendDto[];
}

export class FriendDto {
  @Expose() private friendlyPoints: number;
  @Expose() private bdate: string;

  public toString(): string {
    return 'FriendDtoToString'
  }
}

```
```ts
export class UserEntity {
  @Expose() private fullName: string;
  @Expose() private cn: string;
  @Expose() private sn: string;
  @Expose() private bdate: number;
  @Expose() private isMajor: boolean;
  @Expose() private lastConnexionTime: number;
  @Expose() private bestFriend: FriendEntity;
  @Expose() private friends: FriendEntity[];

  constructor(fullName?: string) {
    this.fullName = fullName;
  }
}

export class FriendEntity {
  @Expose() private friendlyPoints: number;
  @Expose() private bdate: Date;

  public toString(): string {
    return 'FriendEntityToString'
  }
}
```
### Mapper

```ts
@Mapper()
export class UserMapper {

  /*-------------------*\
     UserDto -> User
  \*-------------------*/

  @Mappings(
    { target: 'fullName', expression: 'getConcatProperties(userDto.fname, userDto.lname)' },
    { target: 'cn', source: 'userDto.fname' },
    { target: 'sn', source: 'userDto.lname' },
    { target: 'lastConnexionTime', value: Date.now() },
    { target: 'bestFriend', expression: 'getBestFriend(userDto.friends)' }
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    // good practice: allways return an empty typed Object
    // if you don't want expose the properties of the targeted object's class
    // you must return here an object with the property to map
    return new UserEntity;
  }

  entitiesFromDtos(userDto: UserDto[]): UserEntity[] {
    return userDto.map(userDto => this.entityFromDto(userDto));
  }

  /*-------------------*\
     Mapping methods
  \*-------------------*/
  
  getBestFriend(friends: FriendDto[]): FriendDto {
    return friends.reduce((acc: FriendDto, cur: FriendDto) => {
      return acc.friendlyPoints > cur.friendlyPoints ? acc : cur;
    })
  }
}
```
### Usage
```ts
@Mapper()
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
### Type conversion
The TS code is trans-compiled in JS before being executed, so the types of the source objects are kept on the end object.

In the previous example, the friends and bestFriends properties will remain FriendDto and not FriendEntity, and the same for the methods, they will be those of FrienDto.

The library allows you  to define the targeted type for each property:
```ts
@Mappings(
    { 
      target: 'bestFriend',
      expression: 'getBestFriend(userDto.friends)',
      type: FriendEntity
    },
    { target: 'friends', type: FriendEntity }
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    return new UserEntity;
  }
```

If you have multiple depths in your object, you can target the right property with the right type like this:
```ts
@Mappings(
    { 
      target: 'bestFriend',
      expression: 'getBestFriend(userDto.friends)',
      type: FriendEntity
    },
    { target: 'friends', type: FriendEntity },
    { target: 'friends.bdate', type: Date },
    { target: 'bestFriend.bdate', type: Date }
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    return new UserEntity;
  }
```
Below are examples of options that may exist:

```ts
  // Below are good to iterate on each properties of iterable
  { target: 'prop', type: Date }
  { target: 'prop', type: String }
  { target: 'prop', type: Boolean }
  { target: 'prop', type: Number }
  // Below are good to take the whole of the iterable object
  { target: 'prop', type: 'string' }
  { target: 'prop', type: 'boolean' } // force the String 'false' to false
  { target: 'prop', type: 'number' }
  { target: 'prop', type: 'date' }
  // used to convert Date to string with a specific format
  // cf. Intl.DateTimeFormat for more informations
  {
    target: 'prop',
    type: String,
    dateFormat: ['Fr-fr', { dateStyle: 'full', timeStyle: 'long' }]
  }
```
### @BeforeMapping / @AfterMapping
These decorators are to be placed on internal methods of the mapper. They allow to execute them before or after the mapping.<br>
The method invocation is only generated if all parameters can be assigned by the available source of the mapping method.

**The recovery of the sources is done on the name of the arguments and not on the type. If you do not name the argument at the same way, the method will not be invoked.** 

```ts
@Mapper()
export class UserMapper {

  /*-------------------*\
     UserDto -> User
  \*-------------------*/

  @Mappings(
    { target: 'fullName', expression: 'getConcatProperties(userDto.fname, userDto.lname)' },
    { target: 'cn', source: 'userDto.fname' },
    { target: 'sn', source: 'userDto.lname' },
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
    if (userDto.fname === undefined || userDto.lname === undefined)
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
  logAfterMapping(): void {
    console.log('Mapping is finished.');
  }
  

}
```

Note: if you return object from your @AfterMapping or @BeforeMapping function, it will not be considered.

### @MappingTarget
The MappingTarget allows you to pass the resulting object throw the methods to perform some actions on it.

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
  entityFromDto(@MappingTarget() _user: UserEntity, _userDto: UserDto): UserEntity {
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
  overrideUser(@MappingTarget(UserEntity) user: UserEntity): void {
    user.isMajor = true;
  }

}
```
> **Notes**: @MappingTarget is not used in the same way depending on the type of method in which it is used:
> - In an @BeforeMapping method, the argument bound to the @MappingTarget decorator must also be found in the mapping method. Otherwise @BeforeMapping will not be invoked.
> - In an @AfterMapping method, the argument bound to the @MappingTarget does not have to be in the mapping method. However, you must provide the return type of the mapping method for the @AfterMapping method to be invoked.


### Mapping Options
MappingOptions is the object that you have to pass throw the @Mappings decorator. This is what it looks like:
| Properties  | Description |  Required |
| ----------- | ----------- | ------------ |
| target      | The target name property | true |
| source      | The source name property       | false |
| value      | A direct value       | false |
| expression   | A JS expression        | false |
| type   | The type of the targeted property        | false |
| dateFormat   | Used to convert a Date to a String <br> Array with the locale in 1st pos. and the options in 2nd. pos. (cf. Intl.DateTimeFormat for more informations)       | false |

If a MappingOptions is not correctly filled, an error will be generated when instantiating the Mapper.<br>
At least one of these fields must be completed: source, value, expression, type.<br>
At most one of these fields must be completed: source, value, expression.

### Supplied Mapping Functions
The mapper provides some functions to pass via the "expression" property to facilitate the mapping:
```ts
/**
*  concatenates each property provided in the running order.
*  The last argument is the separator
*  @params properties: properties to concat and the separator
*  @return string: the concatenation of each properties
*  @required each property must be a string
*/
getConcatProperties(...properties: [...string, string]): string
```
```ts
/**
*  return an empty string if the value is undefined or null
*/
getOrEmptyString(value: any): any | string
```
## Exceptions thrown

The thrown exceptions are extends of the HttpException of nestjs/common. 

**BadExpressionExceptionMapper**

```ts
Injectable()
export class UserMapper {
  
  // this will throw a BadExpressionExceptionMapper because the expression for fullName can't be evaluated (unknownMethod does not exist)
  @Mappings(
    { target: 'fullName', expression: 'unknownMethod()' }
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
  // this exception is thrown as soon as there is an expression in one provided MappingOptions
  @Mappings(
    { target: 'cn', expression: 'getConcatProperties(getConcatProperties.fname)' }
  )
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
    { target: 'cn', value: 'Ugo', source: 'userDto.fname' }
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    return new UserEntity;
  }
}
```

**InvalidMappingTargetExceptionMapper**

```ts
Injectable()
export class UserMapper {
  
  // this will throw an InvalidMappingTargetExceptionMapper because
  // the provided @MappingTarget object does not have the type of the returned mapping function
  @Mappings()
  invalidMappingTargetExceptionMapper (@MappingTarget() _userDto: UserDto): UserEntity {
    return new UserEntity()
  }
}
```

**InvalidSourceExceptionMapper**

```ts
Injectable()
export class UserMapper {
  
  // this will throw an InvalidSourceExceptionMapper because userDto.unknownProperty does not exist
  @Mappings(
    { target: 'cn', source: 'userDto.unknownProperty' }
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
    { target: 'unknown', source: 'userDto.fname' }
  )
  entityFromDto(_userDto: UserDto): UserEntity {
    return new UserEntity;
  }
}
```