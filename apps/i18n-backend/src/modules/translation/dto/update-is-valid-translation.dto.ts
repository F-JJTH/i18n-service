import { UpdateIsValidTranslationRequest } from "@kizeo/i18n/data-access";
import { BooleanField } from "../../../decorators/field.decorators";

export class UpdateIsValidTranslationDto implements UpdateIsValidTranslationRequest {
  @BooleanField()
  isValid: boolean
}
