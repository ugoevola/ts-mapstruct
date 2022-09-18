import { Mapper } from '../../src/decorators/mapper.decorator'
import { Mappings } from '../../src/decorators/mappings.decorator'
import { UserDto } from '../models/user.dto'
import { UserEntity } from '../models/user.entity'

@Mapper()
export class InvalidOptionsMapper {
  @Mappings(
    { target: 'cn', value: 'Ugo', source: 'userDto.fname' }
  )
  invalidMappingOptionsExceptionMapper (_userDto: UserDto): UserEntity {
    return new UserEntity()
  }
}
