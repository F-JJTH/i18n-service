import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiHeader } from "@nestjs/swagger";

export function ApiFileUpload(options: {
  name: string;
  description?: string;
  required?: boolean;
}): PropertyDecorator {
  const decorators = [
    ApiBody({
      schema: {
        properties: {
          [options.name]: {
            type: 'string',
            format: 'binary',
          },
        }
      }
    }),
  ]

  return applyDecorators(...decorators);
}