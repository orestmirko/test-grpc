import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AggregatorCommissionsEntity, MerchantEntity, PaymentEntity } from '@entities';
import { AggregatorCommissionsRepository, MerchantRepository, PaymentRepository } from '@repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AggregatorCommissionsEntity,
      MerchantEntity,
      PaymentEntity,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    AggregatorCommissionsRepository,
    MerchantRepository,
    PaymentRepository,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
