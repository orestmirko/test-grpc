export interface ISetWorkHoursParams {
  adminId: number;
  storeId: number;
  workHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[];
}
