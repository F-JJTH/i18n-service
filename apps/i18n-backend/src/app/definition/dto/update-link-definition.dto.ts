import { StringFieldOptional } from "../../../decorators/field.decorators";

export class UpdateLinkTranslationDto {
  @StringFieldOptional()
  link: string | null
}
