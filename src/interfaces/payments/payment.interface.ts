import { PaymentStatus } from '@enums';
import { IMerchant } from './merchant.interface';

export interface IPayment {
  id: number;
  merchant: IMerchant;
  amount: number;
  status: PaymentStatus;
  netAmount: number;
  holdAmount: number;
}

export interface ICreatePaymentResponse {
  message: string;
  paymentId: number;
}

export interface IPaymentStatusResponse {
  message: string;
}

export interface IPaidPayment {
  id: number;
  paidAmount: number;
}

export interface IPayoutResult {
  totalPayout: number;
  payments: IPaidPayment[];
}

export interface IPayoutResponse {
  message: string;
  totalPaid: number;
  payments: IPaidPayment[];
} 