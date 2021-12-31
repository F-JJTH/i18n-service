import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';

enum ApiErrors {
  ERROR_403 = 'User does not have permissions to perform administrative tasks'
}

@Injectable({providedIn: 'root'})
export class AdminQueriesService {
  
  async listUsers() {
    return API.get('AdminQueries', '/listUsers', {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
      }
    })
    .then(response => {
      return response.Users
    })
    .catch((err: Error) => {
      if (err.message.includes('403')) {
        this.logError('listUsers', ApiErrors.ERROR_403)
        return []
      }
      throw err
    })
  }

  private logError(functionName: string, errorMessage: string) {
    console.warn(`AdminQueriesService.${functionName}() - ${errorMessage}`)
  }
}