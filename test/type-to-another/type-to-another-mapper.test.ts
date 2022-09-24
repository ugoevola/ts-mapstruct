import { TypeToAnotherMapper } from './type-to-another.mapper'
import { TypeDto } from './type.dto'
import { TypeEntity } from './type.entity'

describe('TypeToAnotherMapperTest', () => {
  let mapper: TypeToAnotherMapper
  let typeDto: TypeDto
  let typeEntity: TypeEntity

  beforeAll(() => {
    mapper = new TypeToAnotherMapper()
    typeDto = new TypeDto()

    const object = { a: 'test', b: { c: 42 } }
    const array = [false, 8, 'test']
    const date = new Date()
    const map = new Map()
    map.set('a', 42)
    map.set('b', true)
    map.set('c', object)
    map.set('array', array)

    typeDto.booleanToString = true
    typeDto.numToString = 42
    typeDto.dateToString = date
    typeDto.stringToNumber = '18'
    typeDto.booleanToNumber = false
    typeDto.anyToNumber = object
    typeDto.stringToBoolean = 'false'
    typeDto.numToBoolean = 1
    typeDto.anyToBoolean = object
    typeDto.stringToDate = '01 Jan 1970 00:00:00 GMT'
    typeDto.stringToDate2 = '01 Jan 1970 00:00:00 GMT'
    typeDto.arrayToString = array
    typeDto.arrayToStringArray = array
    typeDto.arrayToNumberArray = array
    typeDto.mapToString = map
    typeDto.mapToStringMap = map
    typeDto.objectToString = object

    typeEntity = new TypeEntity()

    typeEntity.booleanToString = 'true'
    typeEntity.numToString = '42'
    typeEntity.dateToString = Intl.DateTimeFormat('Fr-fr', {
      dateStyle: 'full',
      timeStyle: 'long'
    }).format(date)
    typeEntity.stringToNumber = 18
    typeEntity.booleanToNumber = 0
    typeEntity.anyToNumber = NaN
    typeEntity.stringToBoolean = false
    typeEntity.numToBoolean = true
    typeEntity.anyToBoolean = true
    typeEntity.stringToDate = new Date('01 Jan 1970 00:00:00 GMT')
    typeEntity.stringToDate2 = new Date('01 Jan 1970 00:00:00 GMT')
    typeEntity.arrayToString = array.toString()
    typeEntity.arrayToStringArray = array.map(v => String(v))
    typeEntity.arrayToNumberArray = array.map(v => Number(v))
    typeEntity.mapToString = map.toString()
    typeEntity.mapToStringMap = map.toString()
    typeEntity.objectToString = object.toString()
  })

  it('Type test entityFromDto', () => {
    expect(mapper.entityFromDto(typeDto)).toEqual(typeEntity)
  })
})
