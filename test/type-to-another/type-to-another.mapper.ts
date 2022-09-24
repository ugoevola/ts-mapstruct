import { Mappings } from '../../src/decorators/mappings.decorator'
import { Mapper } from '../../src/decorators/mapper.decorator'
import { TypeEntity } from './type.entity'
import { TypeDto } from './type.dto'

@Mapper()
export class TypeToAnotherMapper {
  @Mappings(
    { target: 'booleanToString', type: String },
    { target: 'numToString', type: String },
    {
      target: 'dateToString',
      type: String,
      dateFormat: ['Fr-fr', { dateStyle: 'full', timeStyle: 'long' }]
    },
    { target: 'stringToNumber', type: Number },
    { target: 'booleanToNumber', type: Number },
    { target: 'anyToNumber', type: 'number' },
    { target: 'stringToBoolean', type: 'boolean' },
    { target: 'numToBoolean', type: Boolean },
    { target: 'anyToBoolean', type: Boolean },
    { target: 'stringToDate', type: Date },
    { target: 'stringToDate2', type: 'date' },
    { target: 'arrayToString', type: 'string' },
    { target: 'arrayToStringArray', type: String },
    { target: 'arrayToNumberArray', type: Number },
    { target: 'mapToString', type: String },
    { target: 'mapToStringMap', type: 'string' },
    { target: 'objectToString', type: 'string' }
  )
  entityFromDto(_typeDto: TypeDto): TypeEntity {
    return new TypeEntity()
  }
}
