export interface ICommission {
  fixedFee: number;
  percentFee: number;
  holdPercent: number;
}

export interface ISetCommissionResponse {
  message: string;
  data: ICommission;
} 