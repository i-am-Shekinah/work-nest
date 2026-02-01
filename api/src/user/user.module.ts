import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  exports: [],
  providers: [UserService],
})
export class UserModule {}
