import { SimpleMapper } from './mapper/simple-mapper'
import { SimpleDto } from './models/simple.dto'
import { plainToClass } from 'class-transformer'
import { Simple } from './models/simple.entity'

describe('SimpleMapperTest', () => {
  let simpleMapper: SimpleMapper
  let simpleDto: SimpleDto

  beforeAll(() => {
    simpleMapper = new SimpleMapper()
    simpleDto = new SimpleDto()
    simpleDto.setProperty1('test')
    simpleDto.setProperty2({ a: 'b', c: true, d: 42 })
  })

  it('test getSimpleFromSampleDto', () => {
    const simple = plainToClass(Simple, { property1: 'test', property2: { a: 'b', c: true, d: 42 } })
    expect(simpleMapper.getSimpleFromSampleDto(simpleDto))
      .toEqual(simple)
  })
})
