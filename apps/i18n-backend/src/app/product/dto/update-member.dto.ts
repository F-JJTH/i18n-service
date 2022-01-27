import { MemberAuthorizationDto } from './add-member.dto';
import { ApiProperty } from "@nestjs/swagger"
import { ValidateNested, IsObject } from 'class-validator'

export class UpdateMemberDto {
  @ApiProperty({type: () => MemberAuthorizationDto})
  @IsObject()
  @ValidateNested()
  authorizations: MemberAuthorizationDto
}
