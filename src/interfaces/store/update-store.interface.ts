import { UpdateStoreDto } from "@dtos";

export interface IUpdateStoreParams {
  adminId: number;
  storeId: number;
  updateData: UpdateStoreDto;
} 