import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import { UserService } from '@/modules/user/user.service';
import { UserResolver } from '@/modules/user/user.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
