import { AddMemberRequest, MemberAuthorization } from "@kizeo/i18n/data-access"
import { StringField, BooleanField } from "../../../decorators/field.decorators"
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsObject, IsArray } from 'class-validator'

export class MemberAuthorizationDto implements MemberAuthorization {
  @BooleanField()
  definitions: boolean

  @BooleanField()
  settings: boolean

  @BooleanField()
  deploy: boolean

  @BooleanField()
  validator: boolean

  @StringField({array: true})
  translations: string[]
}

export class AddMemberDto implements AddMemberRequest {
  @StringField()
  memberId: string

  @StringField()
  memberEmail: string

  @ApiProperty({type: () => MemberAuthorizationDto})
  @IsObject()
  @ValidateNested()
  authorizations: MemberAuthorizationDto
}
