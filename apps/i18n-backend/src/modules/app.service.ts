import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configSvc: ConfigService) {}

  async listUsers() {
    const cognitoClient = new CognitoIdentityProviderClient({
      region: this.configSvc.get('AWS_DEFAULT_REGION'),
    })

    const response = await cognitoClient.send(
      new ListUsersCommand({
        UserPoolId: this.configSvc.get('AWS_COGNITO_USER_POOL_ID'),
      })
    )

    return response.Users
  }
}
