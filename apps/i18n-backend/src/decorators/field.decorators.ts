import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';

interface IStringFieldOptions {
  minLength?: number;
  maxLength?: number;
  swagger?: boolean;
  array?: boolean;
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [IsNotEmpty()];

  if (options?.swagger !== false) {
    if (options?.array) {
      decorators.push(ApiProperty({ type: [String], ...options }));
    } else {
      decorators.push(ApiProperty({ type: String, ...options }));
    }
  }

  if (options?.minLength) {
    decorators.push(MinLength(options.minLength));
  }

  if (options?.maxLength) {
    decorators.push(MaxLength(options.maxLength));
  }

  if (options?.array) {
    decorators.push(IsArray());
  } else {
    decorators.push(IsString());
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringField({ required: false, ...options }),
  );
}

export function BooleanField(
  options: Omit<ApiPropertyOptions, 'type'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  const decorators = [IsBoolean()];

  if (options?.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }));
  }

  return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: boolean }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    BooleanField({ required: false, ...options }),
  );
}