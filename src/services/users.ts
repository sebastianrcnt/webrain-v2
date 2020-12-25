import db from "../types/database";
import {
  AlreadyExistsError,
  AuthorizationFailedError,
  IdNotFoundError
} from "../types/errors/database-errors"
import { User } from "../types/interfaces";

export function getAll(): User[] {
  return db.get("users").value();
}

export function getOneById(email: string): User {
  return db.get("users").find({ email }).value();
}

export function exists(email: string): boolean {
  return !!getOneById(email);
}

export function create(
  email: string,
  name: string,
  phone: string,
  password: string,
  level: string
) {
  if (exists(email)) {
    throw new AlreadyExistsError("User", email);
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

export function verify(email: string, password: string): User {
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
    throw new IdNotFoundError("User", email);
  }
}
