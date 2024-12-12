export interface ISetWorkHoursParams {
  adminId: number;
  storeId: number;
  workHours: {
    dayOfWeek: number;
    isWorkingDay: boolean;
    openTime?: string;
    closeTime?: string;
  }[];
}
