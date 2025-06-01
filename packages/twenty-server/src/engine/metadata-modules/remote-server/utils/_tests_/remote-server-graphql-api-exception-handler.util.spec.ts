import { describe, expect, it } from '@jest/globals';
import { UserInputError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  RemoteServerException,
  RemoteServerExceptionCode,
} from 'src/engine/metadata-modules/remote-server/remote-server.exception';
import { remoteServerGraphqlApiExceptionHandler } from '../remote-server-graphql-api-exception-handler.util';

describe('remoteServerGraphqlApiExceptionHandler', () => {
  describe('INVALID_REMOTE_SERVER_INPUT', () => {
    it('should throw UserInputError with custom message when error includes "null value"', () => {
      const error = new RemoteServerException(
        'Invalid input: null value in column "name"',
        RemoteServerExceptionCode.INVALID_REMOTE_SERVER_INPUT,
      );

      expect(() => remoteServerGraphqlApiExceptionHandler(error)).toThrow(
        new UserInputError('Null value provided for a non-nullable field.'),
      );
    });

    it('should throw UserInputError with original message when error does not include "null value"', () => {
      const errorMessage = 'Invalid input: special characters not allowed';
      const error = new RemoteServerException(
        errorMessage,
        RemoteServerExceptionCode.INVALID_REMOTE_SERVER_INPUT,
      );

      expect(() => remoteServerGraphqlApiExceptionHandler(error)).toThrow(
        new UserInputError(errorMessage),
      );
    });
  });
}); 
