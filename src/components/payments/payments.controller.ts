import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMerchantDto, CreatePaymentDto, SetCommissionsDto, UpdateStatusDto } from '@dtos';
import { ICreateMerchantResponse, ISetCommissionResponse, ICreatePaymentResponse, IPaymentStatusResponse, IPayoutResponse } from '@interfaces';
import { IPaymentsService } from './service.interface';
import { Throttle } from '@decorators';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: IPaymentsService) {}

  @Post('commissions')
  async setCommissions(@Body() dto: SetCommissionsDto): Promise<ISetCommissionResponse> {
    const result = await this.paymentsService.setAggregatorCommissions(dto);
    return { message: 'Aggregator commissions updated', data: result };
  }

  @Post('merchants')
  async createMerchant(@Body() dto: CreateMerchantDto): Promise<ICreateMerchantResponse> {
    const merchant = await this.paymentsService.createMerchant(dto);
    return { message: 'Merchant created', merchantId: merchant.id };
  }

  @Throttle(5, 60)
  @Post('create-payment')
  async createPayment(@Body() dto: CreatePaymentDto): Promise<ICreatePaymentResponse> {
    const payment = await this.paymentsService.createPayment(dto);
    return { message: 'Payment created', paymentId: payment.id };
  }

  @Patch('mark-processed')
  async markProcessed(@Body() dto: UpdateStatusDto): Promise<IPaymentStatusResponse> {
    await this.paymentsService.markPaymentsProcessed(dto);
    return { message: 'Payments marked as PROCESSED' };
  }

  @Patch('mark-completed')
  async markCompleted(@Body() dto: UpdateStatusDto): Promise<IPaymentStatusResponse> {
    await this.paymentsService.markPaymentsCompleted(dto);
    return { message: 'Payments marked as COMPLETED' };
  }

  @Throttle(2, 60)
  @Post('payout/:merchantId')
  async payoutMerchant(
    @Param('merchantId') merchantId: number
  ): Promise<IPayoutResponse> {
    const result = await this.paymentsService.payoutMerchant(merchantId);
    return {
      message: 'Payout finished',
      totalPaid: result.totalPayout,
      payments: result.payments,
    };
  }
}
