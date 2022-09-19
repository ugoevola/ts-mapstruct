import { ImplicitMapper } from './implicit.mapper'
import { ImplicitDto, SubImplicitDto, SubSubImplicitDto } from './implicit.dto'
import { ImplicitEntity, SubImplicitEntity, SubSubImplicitEntity } from './implicit.entity'
import { SubImplicit } from './sub-implicit'
import { plainToInstance } from 'class-transformer'

describe('ImplicitMapperTest', () => {
  let implicitMapper: ImplicitMapper
  let implicitDto: ImplicitDto
  let implicitEntity: ImplicitEntity

  beforeAll(() => {
    implicitMapper = new ImplicitMapper()
    implicitDto = new ImplicitDto()
    implicitEntity = new ImplicitEntity()

    const object = { k1: true, k2: 'test', k3: new Date() }
    const map = new Map<string, object>()
    map.set('key', object)
    const date = new Date()
    const subImplicitDto = new SubImplicitDto()
    subImplicitDto.boolProp = true
    subImplicitDto.numProp = 13
    subImplicitDto.subSubImplicit = new SubSubImplicitDto()
    const stringDate = '01 Jan 1970 00:00:00 GMT'
    const array = [1, 'test', true]

    implicitDto.stringProp = 'stringProp'
    implicitDto.boolProp = false
    implicitDto.numProp = 42
    implicitDto.stringArrayProp = ['fst', 'scd']
    implicitDto.booleanArrayProp = [true, false]
    implicitDto.numArrayProp = [0, 1, 56]
    implicitDto.mapProp = map
    implicitDto.objectProp = object
    implicitDto.dateProp = date
    implicitDto.nullProperty = null
    implicitDto.dtoClassInstanceProp = subImplicitDto
    implicitDto.sharedClassInstanceProp = new SubImplicit()
    implicitDto.booleanToString = true
    implicitDto.numToString = 42
    implicitDto.dateToString = date
    implicitDto.objectToString = object
    implicitDto.arrayToString = array
    implicitDto.stringToDate = stringDate

    const subImplicitEntity: SubImplicitEntity = new SubImplicitEntity()
    subImplicitEntity.boolProp = true
    subImplicitEntity.numProp = 13
    subImplicitEntity.subSubImplicit = new SubSubImplicitEntity()

    implicitEntity.stringProp = 'stringProp'
    implicitEntity.boolProp = false
    implicitEntity.numProp = 42
    implicitEntity.stringArrayProp = [ 'fst', 'scd' ]
    implicitEntity.booleanArrayProp = [ true, false ]
    implicitEntity.numArrayProp = [ 0, 1, 56 ]
    implicitEntity.mapProp = map
    implicitEntity.objectProp = object
    implicitEntity.dateProp = date
    implicitEntity.dtoClassInstanceProp = subImplicitEntity
    implicitEntity.sharedClassInstanceProp = new SubImplicit()

    implicitEntity.booleanToString = 'true'
    implicitEntity.numToString = '42'
    implicitEntity.dateToString = date.toString()
    implicitEntity.objectToString = object.toString()
    implicitEntity.arrayToString = String(array)
    implicitEntity.stringToDate = new Date(stringDate)
    
  })

  it('test entityFromDto', () => {
    const value = implicitMapper.entityFromDto(implicitDto)
    expect(value).toEqual(implicitEntity)
    expect(value.dtoClassInstanceProp.subSubImplicit.toString())
    .toEqual('SubSubImplicitEntityToString');
  })

  it('test entityFromDtos', () => {
    const implicitDto2 = new ImplicitDto()
    implicitDto2.numProp = 1
    expect(implicitMapper.entityFromDtos(implicitDto, implicitDto2).numProp)
      .toEqual(1)
  })

  it('test entityFromDtoAndData', () => {
    expect(implicitMapper.entityFromDtoAndData(implicitDto, new Date(), 'test').stringProp)
      .toEqual('test')
  })
})
