import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/common/modules/database/database.module';
import { UserService } from '@/common/modules/user/user.service';
import { UserResolver } from '@/common/modules/user/user.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
