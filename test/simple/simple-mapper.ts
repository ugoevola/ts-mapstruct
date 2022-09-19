import { Mappings } from '../..'
import { Mapper } from '../../src/decorators/mapper.decorator'
import { SimpleDto } from './simple.dto'
import { Simple } from './simple.entity'

@Mapper()
export class SimpleMapper {
  @Mappings()
  getSimpleFromSampleDto (_simpleDto: SimpleDto): Simple {
    return new Simple()
  }

  @Mappings()
  getSimple(): Simple {
    return new Simple()
  }
}
