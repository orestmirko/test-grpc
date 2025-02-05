export interface IMerchant {
  id: number;
  name: string;
  commissionPercent: number;
}

export interface ICreateMerchantResponse {
  message: string;
  merchantId: number;
} 