# TS-mapstruct

TS-Mapstruct is an approach of the JAVA [MapStruct](https://mapstruct.org/) addapted in  **TypeScript**.
It's a code generator that simplifies the implementation of mappings over configuration approach.

## Installation

```
npm install ts-mapstruct
```
## prerequisites

The DTO used in the mapper must have well named getters and setters in camelCase for each mapped properties.\
It is recommended that the DTO constructor can be empty for simplify the code, but it is not a problem if it cannot. 
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

  constructor() {}

  getFname(): string {
    return this.fname;
  }

  setFname(fname: string): void {
    return this.fname = fname;
  }

  // **OTHER GETTERS AND SETTERS**
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

  constructor(fullName?: string) {
    this.fullName = fullName;
  }

  // **GETTERS AND SETTERS**
}
```
### Mapper

Create a Mapper class that wrap the mapping functions.\
It is necessary to type the arguments and the return value of each function.\
This function must also return an object with the good type without which it will not work.\
That's why it simplifies the code to have an empty constructor for the DTO.\
Finally decorate your method with the **@Mappings** decorator by passing the different mapping options.

```ts
export class UserMapper {

  /*-------------------*\
     UserDto -> User
  \*-------------------*/

  @Mappings(
    { target: 'fullName', expression: 'getConcatProperties(fname, lname)' },
    { target: 'cn', source: 'fname' },
    { target: 'sn', source: 'sname' },
    { target: 'lastConnexionTime', value: Date.now()},
  )
  entityFromDto(_userDto: UserDto): UserEntity { 
    return new UserEntity;
  }

  entitiesFromDtos(userDto: UserDto[]): UserEntity[] {
    return userDto.map(this.entityFromDto);
  }

  /*-------------------*\
     Mapping methods
  \*-------------------*/
  
  getConcatProperties(...properties: [...any, string?]): string {
    ...
  }
}
```

In this case, the fullName will be computed with the expression passed in expression options.\
The porperties bdate and isMajor will automatically retrieve their match value from the DTO.\
The property lastConnexionTime is set with the value passed in the value option.\
The others are mapped with the value of the DTO's property passed to the source option.\
And the gender property is ignored.

### Mapping Options
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

**BadExpressionExceptionMapper**

**EmptySourceNameExceptionMapper**

**IllegalMappingOptionsExceptionMapper**

**IllegalObjectAccessExceptionMapper**

**IllegalPropertyKeyExceptionMapper**

**IllegalPropertyValueExceptionMapper**

**InvalidSourceNameExceptionMapper**