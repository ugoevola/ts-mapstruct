import { Mapper } from '../../src/decorators/mapper.decorator'
import { Mappings } from '../../src/decorators/mappings.decorator'
import {
  ImplicitEntity,
  SubImplicitEntity,
  SubSubImplicitEntity
} from './implicit.entity'
import { ImplicitDto } from './implicit.dto'

@Mapper()
export class ImplicitMapper {
  @Mappings(
    { target: 'dtoClassInstanceProp', type: SubImplicitEntity },
    { target: 'booleanToString', type: String },
    { target: 'numToString', type: String },
    { target: 'dateToString', type: String },
    { target: 'objectToString', type: String },
    { target: 'arrayToString', type: 'string' },
    { target: 'stringToDate', type: Date },
    { target: 'dtoClassInstanceProp.subSubImplicit', type: SubSubImplicitEntity }
  )
  entityFromDto(_implicitDto: ImplicitDto): ImplicitEntity {
    return new ImplicitEntity()
  }

  @Mappings()
  entityFromDtos(
    _implicitDto1: ImplicitDto,
    _implicitDto2: ImplicitDto
  ): ImplicitEntity {
    return new ImplicitEntity()
  }

  @Mappings()
  entityFromDtoAndData(
    _implicitDto1: ImplicitDto,
    _dateProp: Date,
    _stringProp: string
  ): ImplicitEntity {
    return new ImplicitEntity()
  }
}
