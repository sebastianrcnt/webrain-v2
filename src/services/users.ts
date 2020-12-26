import db from "../database";
import { InternalException } from "../types/errors";
import { ModelName, PrimaryKey, User } from "../types/interfaces/models";

export class EmailAlreadyExistsException extends InternalException {}
export class PasswordMismatchException extends InternalException {}

export function getAll(): User[] {
  return db.get(ModelName.USER).value();
}

export function getOneById(email: PrimaryKey): User {
  return db.get(ModelName.USER).find({ email }).value();
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
    throw new EmailAlreadyExistsException(email);
  } else {
    db.get(ModelName.USER)
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
      throw new PasswordMismatchException(password);
    }
  } else {
    throw new EmailAlreadyExistsException(email);
  }
}
