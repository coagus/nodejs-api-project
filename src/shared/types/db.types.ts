export interface BaseEntity {
  id: number;
  active: boolean;
}

export interface AuditFields extends BaseEntity {
  createAt: Date;
  updateAt: Date | null;
  deleteAt: Date | null;
  createBy: number;
  updateBy: number | null;
  deleteBy: number | null;
}