import { ArrayMapper } from "./array.mapper"
import { ContactCO, Infra, Rules } from "./dto"
import { ContactNumber, InfraEntity, RulesEntity } from "./entity"

describe('ArrayMapperTest', () => {
  let mapper: ArrayMapper
  let dto: Infra
  let entity: InfraEntity

  beforeAll(() => {
    mapper = new ArrayMapper()
    dto = new Infra()
    entity = new InfraEntity()

    const phone = '*******'
    const countryCode = 'FR'
    const cityCode = '1254'
    const date = new Date('December 17, 1995 03:24:00')

    let contactCo = new ContactCO
    contactCo.cityCode = cityCode
    contactCo.countryCode = countryCode
    contactCo.phone = phone

    let rules = new Rules()
    rules.contactList = [ contactCo, contactCo, contactCo ]

    dto.rules = [ rules, rules ]

    let contactNumber = new ContactNumber()
    contactNumber.phone = phone
    contactNumber.main = phone
    contactNumber.countryCode = countryCode

    let rulesEntity = new RulesEntity()
    rulesEntity.contactNumbers = [ contactNumber, contactNumber, contactNumber ]

    entity.rules = [ rulesEntity, rulesEntity ]

  })

  it('Array Mapper test entity from dto', () => {
    expect(mapper.entityFromDto(dto)).toEqual(entity)
  })
})