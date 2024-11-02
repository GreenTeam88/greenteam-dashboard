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

// export type Client = {
//   id: string;
//   Fullname: string;
//   ClientType: string;
//   Address: string;
//   // Extraaddressinfo?: string;
//   Housenumber: string;
//   // Postalcode: string;
//   City: string;
//   Country: string;
//   Email: string;
//   Telephone: string;
// };
export type Client = {
  id: string;
  FullName: string;
  ClientType: string; // Limit values to 'Private' or 'Business Client' 'Private' | 'Business Client'
  Address: string;
  HouseNumber: string;
  City: string;
  Country: string;
  Email: string;
  Telephone: string;
  Telephone2?: string;

  // Fields for Private clients
  ExtraAddressInfo?: string;
  PreferredLanguage?: string;
  PostalCode?: string;

  // Fields for Business clients
  CompanyName?: string;
  ClientNumber?: string;
  ChamberOfCommerceNumber?: string;
  VATTaxNumber?: string;
  BusinessAddress?: string;
  ExtraBusinessAddressInfo?: string;
};

export type newClient = {
  id: string;
  firstName: string;
  lastName: string;
  clientType: string;
  adress: string;
  houseNumber: string;
  extraAddressInfo: string;
  preferedLanguege: string;
  postalCde: string;
  City: string;
  country: string;
  email: string;
  telephone1: string;
  telephone2: string;
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

// Pricelist Needed Types :

export interface SubcontractorPrice {
  id: string;
  name: string;
  prices: Float[];
}

// export interface Subservice {
//   name: string;
//   price: Float;
//   unit: string;
// }
export interface Service {
  name: string;
  subservices: Subservice[];
  subcontractors: SubcontractorPrice[];
}

export interface Subservice {
  id: string;
  name: string;
  price: number;
  unit: string;
}
