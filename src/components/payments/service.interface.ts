import { CreateMerchantDto, CreatePaymentDto, UpdateStatusDto } from '@dtos';
import { ICommission, IMerchant, IPayment, IPayoutResult } from '@interfaces';

export interface IPaymentsService {
  setAggregatorCommissions(commissionData: ICommission): Promise<ICommission>;
  createMerchant(merchantData: CreateMerchantDto): Promise<IMerchant>;
  createPayment(paymentData: CreatePaymentDto): Promise<IPayment>;
  markPaymentsProcessed(data: UpdateStatusDto): Promise<void>;
  markPaymentsCompleted(data: UpdateStatusDto): Promise<void>;
  payoutMerchant(merchantId: number): Promise<IPayoutResult>;
  getMerchant(merchantId: number): Promise<IMerchant | null>;
} 