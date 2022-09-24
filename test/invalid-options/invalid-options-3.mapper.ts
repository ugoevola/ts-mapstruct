import { Mapper } from '../../src/decorators/mapper.decorator'
import { Mappings } from '../../src/decorators/mappings.decorator'
import { UserDto } from '../user/user.dto'
import { UserEntity } from '../user/user.entity'

@Mapper()
export class InvalidOptionsMapper3 {
  @Mappings({ target: 'cn', type: String })
  invalidMappingOptionsExceptionMapper(_userDto: UserDto): UserEntity {
    return new UserEntity()
  }

  @Mappings({ target: 'cn', value: undefined })
  invalidMappingOptionsExceptionMapper2(_userDto: UserDto): UserEntity {
    return new UserEntity()
  }
}
