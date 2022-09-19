import { BadExpressionExceptionMapper } from '../../src/exceptions/bad-expression.exception'
import { IllegalArgumentNameExceptionMapper } from '../../src/exceptions/illegal-argument-name.exception'
import { InvalidMappingTargetExceptionMapper } from '../../src/exceptions/invalid-mapping-target.exception'
import { InvalidSourceExceptionMapper } from '../../src/exceptions/invalid-source.exception'
import { InvalidTargetExceptionMapper } from '../../src/exceptions/invalid-target.exception'
import { UserMapper } from './user.mapper'
import { Friend, GenderEnum, UserDto } from './user.dto'
import { UserEntity } from './user.entity'

describe('UserMapperTest', () => {
  let userMapper: UserMapper
  let userDto: UserDto
  let userEntity: UserEntity
  let natacha: Friend
  let brian: Friend

  beforeAll(() => {
    userMapper = new UserMapper()

    natacha = { friendlyPoints: 10, fname: 'Natacha' }
    brian = { friendlyPoints: 2, fname: 'Brian' }
    const friends = [natacha, brian]

    userDto = new UserDto()
    userDto.fname = 'Ugo'
    userDto.lname = 'Evola'
    userDto.bdate = 810926874
    userDto.isMajor = true
    userDto.gender = GenderEnum.M
    userDto.friends = friends

    userEntity = new UserEntity()
    userEntity.fullName = 'Ugo Evola'
    userEntity.cn = 'Ugo'
    userEntity.sn = 'Evola'
    userEntity.bdate = 810926874
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
    const userEntity = new UserEntity()
    userEntity.cn = 'Ugo'
    userEntity.sn = 'Ugo'
    userEntity.bestFriend = brian
    userEntity.isMajor = true
    expect(userMapper.entityFromArgs('Ugo', 'Evola', brian))
      .toEqual(userEntity)
    userEntity.cn = ''
    delete userEntity.sn
    expect(userMapper.entityFromArgs(undefined, 'Evola', brian))
      .toEqual(userEntity)
  })

  it('test BeforeMapping', () => {
    const userDtoCopy = { ...userDto }
    delete userDtoCopy.fname
    expect(() => userMapper.entityFromDto(userDtoCopy))
      .toThrow('1: The commonName and secondName must be defined')
    expect(() => userMapper.entityFromArgs('Ugo', undefined, natacha))
      .toThrow('2: The commonName and secondName must be defined')
  })

  it('test MappingTarget BeforeMapping', () => {
    const userEntityCopy = new UserEntity()
    expect(() => userMapper.entityFromEntityAndDto(userEntityCopy, userDto))
      .toThrow('4: The commonName and secondName must be defined')
  })

  it('test MappingTarget Mappings', () => {
    const userEntitySource = new UserEntity()
    userEntitySource.cn = 'Ugo'
    userEntitySource.sn = 'Evola'
    const userEntityResult = {... userEntity}
    delete userEntityResult.bestFriend
    expect(userMapper.entityFromEntityAndDto(userEntitySource, userDto))
      .toEqual(userEntityResult)
  })

  it('test BadExpressionExceptionMapper', () => {
    expect(() => userMapper.badExpressionExceptionMapper(userDto))
      .toThrow(BadExpressionExceptionMapper)
  })

  it('test IllegalArgumentNameExceptionMapper', () => {
    expect(() => userMapper.illegalArgumentNameExceptionMapper(userDto))
      .toThrow(IllegalArgumentNameExceptionMapper)
  })

  it('test InvalidSourceExceptionMapper', () => {
    expect(() => userMapper.invalidSourceExceptionMapper(userDto))
      .toThrow(InvalidSourceExceptionMapper)
    expect(() => userMapper.invalidSourceExceptionMapper2(userDto))
      .toThrow(InvalidSourceExceptionMapper)
  })

  it('test InvalidTargetExceptionMapper', () => {
    expect(() => userMapper.invalidTargetExceptionMapper(userDto))
      .toThrow(InvalidTargetExceptionMapper)
  })

  it('test InvalidMappingTargetExceptionMapper', () => {
    expect(() => userMapper.invalidMappingTargetExceptionMapper(userDto))
      .toThrow(InvalidMappingTargetExceptionMapper)
  })
})
