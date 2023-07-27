import { Mapper } from '../../src/decorators/mapper.decorator'
import { Mappings } from '../../src/decorators/mappings.decorator'
import { Infra } from "./dto";
import { ContactNumber, InfraEntity, RulesEntity } from "./entity";

@Mapper()
export class ArrayMapper {

  @Mappings(
    {
      target: "rules",
      type: RulesEntity
    },
    {
      source: "infraDto.rules.contactList",
      target: "rules.contactNumbers",
      type: ContactNumber
    },
    {
      source: "infraDto.rules.contactList.phone",
      target: "rules.contactNumbers.main"
    }
  )
  entityFromDto(_infraDto: Infra): InfraEntity {
    return new InfraEntity;
  }
}
