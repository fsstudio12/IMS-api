export enum QuantityMetric {
  GRAM = 'g',
  KILOGRAM = 'kg',
  MILLILITER = 'ml',
  LITER = 'l',
  PLATE = 'plate',
  HALF_PLATE = 'half_plate',
  EACH = 'each',
}

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
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
