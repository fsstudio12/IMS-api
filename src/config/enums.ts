export enum QuantityMetric {
  GRAM = 'gm',
  KILOGRAM = 'kg',
  MILLILITER = 'ml',
  LITER = 'l',
  PLATE = 'plate',
  HALF_PLATE = 'half_plate',
  EACH = 'each',
  PIECE = 'pcs',
  PACKET = 'pkt',
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export enum CustomerType {
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organization',
}

export enum RegistrationType {
  PAN = 'PAN',
  VAT = 'VAT',
}

export enum PaymentStatus {
  PAID = 'paid',
  NOT_PAID = 'not_paid',
  PARTIAL_PAID = 'partial_paid',
  RETURNED = 'returned',
  PARTIAL_RETURNED = 'partial_returned',
}

export enum PaymentMethod {
  CASH = 'cash',
}

export enum SortType {
  ASC = 'ascending',
  DESC = 'descending',
}

export enum EnrollmentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
}

export enum PaySchedule {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi-weekly',
  MONTHLY = 'monthly',
}

export enum WageType {
  HOURLY = 'hourly',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  FIXED = 'fixed',
}
