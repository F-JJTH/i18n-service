import { BooleanField } from "../../../decorators/field.decorators";

export class UpdateIsValidTranslationDto {
  @BooleanField()
  isValid: boolean
}
