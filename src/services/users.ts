import db from "../database";
import {
  AlreadyExistsError,
  AuthorizationFailedError,
  InvalidPrimaryKeyError,
} from "../types/errors/database-errors";
import { ModelName, PrimaryKey, User } from "../types/interfaces/models";

export function getAll(): User[] {
  return db.get("users").value();
}

export function getOneById(email: PrimaryKey): User {
  return db.get("users").find({ email }).value();
}

export function exists(email: PrimaryKey): boolean {
  return !!getOneById(email);
}

export function create(
  email: PrimaryKey,
  name: string,
  phone: string,
  password: string,
  level: number
) {
  if (exists(email)) {
    throw new AlreadyExistsError(ModelName.USER, email);
  } else {
    db.get("users")
      .push({
        email,
        name,
        phone,
        password,
        level,
      })
      .write();
  }
}

export function verify(email: PrimaryKey, password: string): User {
  const user: User = getOneById(email);
  if (user) {
    if (user.password === password) {
      return user;
    } else {
      throw new AuthorizationFailedError(
        `Authorization Failed for User ${email}: Wrong Password`
      );
    }
  } else {
    throw new InvalidPrimaryKeyError(ModelName.USER, email);
  }
}
