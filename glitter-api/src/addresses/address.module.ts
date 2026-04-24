import { Module } from '@nestjs/common';
import { AddressesController } from './address.controller';
import { AddressesService } from './address.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { AddressEntity } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, UserEntity])],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
