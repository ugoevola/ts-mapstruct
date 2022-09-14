import { BadExpressionExceptionMapper } from "../src/exceptions/bad-expression.exception";
import { IllegalArgumentNameExceptionMapper } from "../src/exceptions/illegal-argument-name.exception";
import { InvalidMappingOptionsExceptionMapper } from "../src/exceptions/invalid-mapping-options.exception";
import { InvalidSourceExceptionMapper } from "../src/exceptions/invalid-source.exception";
import { InvalidTargetExceptionMapper } from "../src/exceptions/invalid-target.exception";
import { UserMapper } from "./mapper/user.mapper";
import { Friend, GenderEnum, UserDto } from "./models/user.dto";
import { UserEntity } from "./models/user.entity";


describe('MappingTest', () => {
  let
  userMapper: UserMapper,
  userDto: UserDto,
  userEntity: UserEntity,
  natacha: Friend,
  brian: Friend;
  
  beforeAll(() => {
    userMapper = new UserMapper();

    natacha = { friendlyPoints: 10, fname: 'Natacha' } as Friend;
    brian =  { friendlyPoints: 2, fname: 'Brian' } as Friend;
    let friends = [natacha, brian]

    userDto = new UserDto()
    userDto.fname = 'Ugo';
    userDto.lname = 'Evola';
    userDto.bdate = 810926874;
    userDto.isMajor = true;
    userDto.gender = GenderEnum.M;
    userDto.friends = friends

    userEntity = new UserEntity();
    userEntity.fullName = 'Ugo Evola';
    userEntity.cn = 'Ugo';
    userEntity.sn = 'Evola';
    userEntity.bdate = 810926874;
    userEntity.bestFriend = natacha
    userEntity.friends = friends
    userEntity.lastConnexionTime = 1663180781624
    userEntity.isMajor = true
  })

  it('test entityFromDto & getConcatProperties', () => {
    expect(userMapper.entityFromDto(userDto))
    .toEqual(userEntity)
  })

  it('test entitiesFromDtos', () => {
    expect(userMapper.entitiesFromDtos([userDto]))
    .toEqual([userEntity])
  })

  it('test entityFromArgs && MapingTarget AfterMapping', () => {
    let userEntity = new UserEntity()
    userEntity.cn = 'Ugo'
    userEntity.sn = 'Ugo'
    userEntity.bestFriend = brian
    userEntity.isMajor = true
    expect(userMapper.entityFromArgs('Ugo', 'Evola', brian))
    .toEqual(userEntity)
  })

  it('test BeforeMapping', () => {
    let userDtoCopy = { ... userDto }
    delete userDtoCopy.fname
    expect(() => userMapper.entityFromDto(userDtoCopy))
    .toThrow("1: The commonName and secondName must be defined");
    expect(() => userMapper.entityFromArgs(undefined, 'Evola', natacha))
    .toThrow("2: The commonName and secondName must be defined");
  })

  it('test MappingTarget BeforeMapping', () => {
    let userEntityCopy = new UserEntity()
    expect(() => userMapper.entityFromEntityAndDto(userEntityCopy, userDto))
    .toThrow("4: The commonName and secondName must be defined")
  })

  it('test MappingTarget Mappings', () => {
    let userEntityCopy = new UserEntity()
    userEntityCopy.cn = 'Ugo'
    userEntityCopy.sn = 'Evola'
    let userEntityResult = new UserEntity()
    userEntityResult.cn = 'Ugo'
    userEntityResult.sn = 'Evola'
    userEntityResult.fullName = 'Ugo Evola'
    userEntityResult.lastConnexionTime = 1663180781624
    expect(userMapper.entityFromEntityAndDto(userEntityCopy, userDto))
    .toEqual(userEntityResult)
  })

  it('test BadExpressionExceptionMapper', () => {
    expect(() => userMapper.badExpressionExceptionMapper(userDto))
    .toThrow(BadExpressionExceptionMapper);
  })

  it('test IllegalArgumentNameExceptionMapper', () => {
    expect(() => userMapper.illegalArgumentNameExceptionMapper(userDto))
    .toThrow(IllegalArgumentNameExceptionMapper);
  })

  it('test InvalidMappingOptionsExceptionMapper', () => {
    expect(() => userMapper.invalidMappingOptionsExceptionMapper(userDto))
    .toThrow(InvalidMappingOptionsExceptionMapper);
  })

  it('test InvalidSourceExceptionMapper', () => {
    expect(() => userMapper.invalidSourceExceptionMapper(userDto))
    .toThrow(InvalidSourceExceptionMapper);
  })

  it('test InvalidTargetExceptionMapper', () => {
    expect(() => userMapper.invalidTargetExceptionMapper(userDto))
    .toThrow(InvalidTargetExceptionMapper);
  })
});