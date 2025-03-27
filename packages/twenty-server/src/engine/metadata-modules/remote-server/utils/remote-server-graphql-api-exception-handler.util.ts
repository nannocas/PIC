import {
  ConflictError,
  ForbiddenError,
  InternalServerError,
  UserInputError
} from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  RemoteServerException,
  RemoteServerExceptionCode,
} from 'src/engine/metadata-modules/remote-server/remote-server.exception';

export const remoteServerGraphqlApiExceptionHandler = (error: any) => {
  if (error instanceof RemoteServerException) {
    switch (error.code) {
      //PIC: Update the remoteServerGraphqlApiExceptionHandler to handle cases where null values are passed to non-nullable fields.
      case RemoteServerExceptionCode.INVALID_REMOTE_SERVER_INPUT:
        if (error.message.includes('null value')) {
          throw new UserInputError('Null value provided for a non-nullable field.');
        }
        throw new UserInputError(error.message);
      //PIC  
      case RemoteServerExceptionCode.INVALID_REMOTE_SERVER_INPUT:
        throw new UserInputError(error.message);
      case RemoteServerExceptionCode.REMOTE_SERVER_MUTATION_NOT_ALLOWED:
        throw new ForbiddenError(error.message);
      case RemoteServerExceptionCode.REMOTE_SERVER_ALREADY_EXISTS:
        throw new ConflictError(error.message);
      default:
        throw new InternalServerError(error.message);
    }
  }

  throw error;
};
