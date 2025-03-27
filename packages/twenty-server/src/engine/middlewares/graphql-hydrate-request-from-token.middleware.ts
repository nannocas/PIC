import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { GraphQLFieldResolver } from 'graphql';
import { UserInputError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { MiddlewareService } from 'src/engine/middlewares/middleware.service';

//PIC: Use middleware to intercept and validate inputs globally before they reach resolvers
const validateNonNullableFields: GraphQLFieldResolver<any, any> = (resolve, parent, args, context, info) => {
  const { fieldName } = info;
  const fieldValue = args[fieldName];
  if (fieldValue === null) {
    throw new UserInputError(`Field "${fieldName}" cannot be null.`);
  }
  return resolve(parent, args, context, info);
};
//PIC: Use middleware to intercept and validate inputs globally before they reach resolvers

@Injectable()
export class GraphQLHydrateRequestFromTokenMiddleware
  implements NestMiddleware
{
  constructor(private readonly middlewareService: MiddlewareService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (this.middlewareService.checkUnauthenticatedAccess(req)) {
      return next();
    }

    try {
      //PIC: Use middleware to intercept and validate inputs globally before they reach resolvers
      await this.middlewareService.authenticateGraphqlRequest(req);

      // Validate non-nullable fields in the request body
      const body = req.body;
      if (body && body.variables) {
        for (const [key, value] of Object.entries(body.variables)) {
          if (value === null) {
            throw new UserInputError(
              `Field "${key}" cannot be null. Please provide a valid value.`,
            );
          }
        }
      }
      //PIC: Use middleware to intercept and validate inputs globally before they reach resolvers
    } catch (error) {
      this.middlewareService.writeGraphqlResponseOnExceptionCaught(res, error);
      return;
    }

    next();
  }
}