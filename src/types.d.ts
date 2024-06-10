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
  'House number': string;
  City: string;
  Country: string;
  Email: string;
  Telephone: string;
};
