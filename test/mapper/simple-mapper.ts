import { Mappings } from '../..'
import { Mapper } from '../../src/decorators/mapper.decorator'
import { SimpleDto } from '../models/simple.dto'
import { Simple } from '../models/simple.entity'

@Mapper()
export class SimpleMapper {
  @Mappings()
  getSimpleFromSampleDto (_simpleDto: SimpleDto): Simple {
    return new Simple()
  }
}
