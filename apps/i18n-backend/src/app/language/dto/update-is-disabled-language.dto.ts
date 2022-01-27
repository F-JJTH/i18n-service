import { UpdateIsDisabledLanguageRequest } from "@kizeo/i18n/data-access";
import { BooleanField } from "../../../decorators/field.decorators";

export class UpdateIsDisabledLanguageDto implements UpdateIsDisabledLanguageRequest {
  @BooleanField()
  isDisabled: boolean
}
