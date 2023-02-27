import { UpdateLinkForDefinitionRequest } from "@kizeo/i18n/data-access";
import { StringFieldOptional } from "../../../decorators/field.decorators";

export class UpdateLinkTranslationDto implements UpdateLinkForDefinitionRequest {
  @StringFieldOptional()
  link: string | null
}
