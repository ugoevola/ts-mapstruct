import { SimpleMapper } from './simple-mapper'
import { SimpleDto } from './simple.dto'
import { plainToInstance } from 'class-transformer'
import { Simple } from './simple.entity'
import { EmptyMapper } from './empty.mapper'

describe('SimpleMapperTest', () => {
  let simpleMapper: SimpleMapper
  let simpleDto: SimpleDto
  let emptyMapper: EmptyMapper

  beforeAll(() => {
    simpleMapper = new SimpleMapper()
    simpleDto = new SimpleDto()
    simpleDto.setProperty1('test')
    simpleDto.setProperty2({ a: 'b', c: true, d: 42 })
    emptyMapper = new EmptyMapper()
    emptyMapper.test()
  })

  it('test getSimpleFromSampleDto', () => {
    const simple = plainToInstance(Simple, {
      property1: 'test',
      property2: { a: 'b', c: true, d: 42 }
    })
    expect(simpleMapper.getSimpleFromSampleDto(simpleDto)).toEqual(simple)
  })

  it('test getSimple', () => {
    expect(simpleMapper.getSimple()).toEqual(new Simple())
  })
})
