import { Cached, ClearCache } from '@decorators';
import { MerchantEntity, PaymentEntity } from '@entities';
import { PaymentStatus } from '@enums';
import { ICommission } from '@interfaces';
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { CreateMerchantDto, CreatePaymentDto, UpdateStatusDto } from '@dtos';
import { IPaymentsService } from './service.interface';
import { AggregatorCommissionsRepository, MerchantRepository, PaymentRepository } from '@repositories';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentsService implements IPaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly commissionsRepository: AggregatorCommissionsRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly dataSource: DataSource,
  ) {}

  async setAggregatorCommissions(commissionData: ICommission): Promise<ICommission> {
    let record = await this.commissionsRepository.findOne();
    if (!record) {
      record = await this.commissionsRepository.create(commissionData);
    } else {
      Object.assign(record, commissionData);
    }
    return this.commissionsRepository.save(record);
  }

  @ClearCache('merchant')
  async createMerchant(merchantData: CreateMerchantDto): Promise<MerchantEntity> {
    return this.merchantRepository.create(merchantData);
  }

  async createPayment(paymentData: CreatePaymentDto): Promise<PaymentEntity> {
    const merchant = await this.merchantRepository.findById(paymentData.merchantId);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    const globalCommissions = await this.commissionsRepository.findOne();
    if (!globalCommissions) {
      throw new BadRequestException('Global aggregator commissions not set yet');
    }

    const { fixedFee, percentFee, holdPercent } = globalCommissions;

    const totalFee =
      Number(fixedFee) +
      (Number(percentFee) / 100) * paymentData.amount +
      (Number(merchant.commissionPercent) / 100) * paymentData.amount;

    const netAmount = paymentData.amount - totalFee;
    if (netAmount < 0) {
      throw new BadRequestException(`Payment amount is too small to cover fees`);
    }

    const holdAmount = (Number(holdPercent) / 100) * paymentData.amount;

    return this.paymentRepository.create({
      merchant,
      amount: paymentData.amount,
      status: PaymentStatus.ACCEPTED,
      netAmount,
      holdAmount,
    });
  }

  async markPaymentsProcessed(data: UpdateStatusDto): Promise<void> {
    if (!data.paymentIds?.length) return;
    await this.paymentRepository.updateStatus(data.paymentIds, PaymentStatus.PROCESSED);
  }

  async markPaymentsCompleted(data: UpdateStatusDto): Promise<void> {
    if (!data.paymentIds?.length) return;
    await this.paymentRepository.updateStatus(data.paymentIds, PaymentStatus.COMPLETED);
  }

  async payoutMerchant(merchantId: number) {
    this.logger.log(`Starting payout for merchant ${merchantId}`);
    
    return this.dataSource.transaction(async (transactionManager) => {
      const merchant = await this.merchantRepository.findById(merchantId);
      if (!merchant) {
        throw new NotFoundException('Merchant not found');
      }

      const candidates = await this.paymentRepository.findByMerchantAndStatus(
        merchantId,
        [PaymentStatus.PROCESSED, PaymentStatus.COMPLETED]
      );

      if (!candidates.length) {
        return { totalPayout: 0, payments: [] };
      }

      const prepared = candidates.map((p) => ({
        payment: p,
        availableForPayout:
          p.status === PaymentStatus.PROCESSED
            ? Number(p.netAmount) - Number(p.holdAmount)
            : Number(p.netAmount),
      }));

      const fullNeeded = prepared.reduce((sum, item) => sum + item.availableForPayout, 0);
      let remaining = fullNeeded;
      const paidPayments: Array<{ id: number; paidAmount: number }> = [];

      for (const item of prepared) {
        if (item.availableForPayout <= remaining) {
          paidPayments.push({
            id: item.payment.id,
            paidAmount: item.availableForPayout,
          });
          remaining -= item.availableForPayout;
        }
      }

      const totalPayout = paidPayments.reduce((sum, payment) => sum + payment.paidAmount, 0);

      await this.paymentRepository.updateStatus(
        paidPayments.map(p => p.id),
        PaymentStatus.PAID
      );

      this.logger.log(`Completed payout for merchant ${merchantId}: ${totalPayout}`);

      return {
        totalPayout,
        payments: paidPayments,
      };
    });
  }

  @Cached('merchant', 3600)
  async getMerchant(merchantId: number) {
    return this.merchantRepository.findById(merchantId);
  }
}
