import { AppError } from "../../errors/app.error.js";


export class UserUnauthrized extends AppError {
  constructor() {
    super('Unauthorized',401,'USER_UNAUTHRIZED' );
  }
}