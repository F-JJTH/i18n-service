import { MemberAuthorizationDto } from './add-member.dto';
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsObject } from 'class-validator'
import { UpdateMemberRequest } from '@kizeo/i18n/data-access';

export class UpdateMemberDto implements UpdateMemberRequest{
  @ApiProperty({type: () => MemberAuthorizationDto})
  @IsObject()
  @ValidateNested()
  authorizations: MemberAuthorizationDto
}
