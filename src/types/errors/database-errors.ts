import { StatusCodes } from "../enums"
import { CaughtError, HttpStatusCodeSpecified } from "."


export class DatabaseError extends CaughtError {
  constructor(message: string) {
    super(message)
  }
}

export class IdNotFoundError
  extends DatabaseError
  implements HttpStatusCodeSpecified {
  statusCode: StatusCodes = StatusCodes.NOT_FOUND;
  constructor(model: string, id: string) {
    super(`${model} with id ${id} is not found`)
  }
}

export class AlreadyExistsError
  extends DatabaseError
  implements HttpStatusCodeSpecified {
  statusCode: StatusCodes = StatusCodes.CONFLICT;
  constructor(model: string, id: string) {
    super(`${model} with id ${id} is not found`)
  }
}

export class DatabaseCorruptionError extends DatabaseError {
  constructor(message: string) {
    super(message)
  }
}

export class AuthorizationFailedError
  extends DatabaseError
  implements HttpStatusCodeSpecified {
  statusCode: StatusCodes = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message)
  }
}
