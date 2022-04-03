import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  encodePassword(password: string) {
    return hash(password, 10);
  }

  verifyPassword(input: string, hash: string) {
    return compare(input, hash);
  }
}
