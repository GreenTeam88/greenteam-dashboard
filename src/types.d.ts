export type Option = {
  value: string;
  label: string;
};
export type Project = {
  id: string;
  'Project number': string;
  Date: string;
  Category: string;
  Details: string;
  Name: string;
  Address: string;
  City: string;
  Telephone: string;
  Status: 'FINISHED' | 'APPROVED' | 'PENDING' | 'ON HOLD' | 'DECLINED';
};

export type Client = {
  id: string;
  'Full name': string;
  'Client Type': string;
  Address: string;
  'Extra address info'?: string;
  'House number': string;
  'Postal code': string;
  City: string;
  Country: string;
  Email: string;
  'Telephone 1': string;
  'Telephone 2': string;
};

export interface FaqQuestion {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface Quotation {
  id: number;
  quotationNumber: string;
  category: string;
  details: string;
  date: string;
  name: string;
  address: string;
  city: string;
  amount: number;
  telephone: string;
  status: 'SEND' | 'DRAFT';
}
export interface QuotationPrice {
  id: string;
  quantity: number;
  description: string;
  price: number;
  discount: number;
  tax: number;
  priceInclTax: number;
}
export interface Subcontractor {
  companyName: string;
  commerceNumber: string;
  vatTaxNumber: string;
  businessAddress: string;
  city: string;
  country: string;
  email: string;
  telephone: string;
}
export interface Invoice {
  projectNumber: string;
  category: string;
  date: string;
  client: string;
  subcontractor: string;
  totalAmount: number;
  status: 'FINISHED' | 'APPROVED' | 'PENDING' | 'DECLINED' | 'UNPAID';
}
type SidebarDataType<T> = {
  [key in keyof T]: {
    text: string;
    value: string;
  };
};
