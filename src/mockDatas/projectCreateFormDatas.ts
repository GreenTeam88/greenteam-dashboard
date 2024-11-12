import { Quotation, Subcontractor } from '@/types';

export const clientsData = [
  {
    value: 'client1',
    label: 'Client 1',
  },
  {
    value: 'client2',
    label: 'Client 2',
  },
  {
    value: 'client3',
    label: 'Client 3',
  },
  {
    value: 'client4',
    label: 'Client 4',
  },
  {
    value: 'client5',
    label: 'Client 5',
  },
];
export const categoriesData = [
  { value: 'tech', label: 'Technology' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'sports', label: 'Sports' },
];
export const housePartsData = [
  {
    value: 'okokok ',
    label: 'Housokoke Part 1',
  },
  {
    value: 'housePart2',
    label: 'House Part 2',
  },
  {
    value: 'housePart3',
    label: 'House Part 3',
  },
  {
    value: 'housePart4',
    label: 'House Part 4',
  },
  {
    value: 'housePart5',
    label: 'House Part 5',
  },
];
export const mockFloorData = [
  { value: '1', label: 'Floor 1' },
  { value: '2', label: 'Floor 2' },
  { value: '3', label: 'Floor 3' },
  { value: '4', label: 'Floor 4' },
  { value: '5', label: 'Floor 5' },
  { value: 'B1', label: 'Basement 1' },
  { value: 'B2', label: 'Basement 2' },
];

export const quotations: Quotation[] = [
  {
    id: 1,
    quotationNumber: 'Q1001',
    category: 'Construction',
    details: 'Construction services for residential building',
    date: '2024-11-01',
    name: 'Quotation for Building A',
    address: '1234 West Street',
    city: 'Springfield',
    amount: 500000,
    telephone: '123-456-7890',
    status: 'SEND',
  },
  {
    id: 2,
    quotationNumber: 'Q1002',
    category: 'Landscaping',
    details: 'Landscaping services for corporate office grounds',
    date: '2024-11-02',
    name: 'Corporate Office Landscaping',
    address: '4321 East Street',
    city: 'Shelbyville',
    amount: 200000,
    telephone: '234-567-8901',
    status: 'DRAFT',
  },
  {
    id: 3,
    quotationNumber: 'Q1003',
    category: 'Renovation',
    details: 'Office renovation including new furniture and fixtures',
    date: '2024-11-03',
    name: 'Office Renovation Quotation',
    address: '5678 North Avenue',
    city: 'Capital City',
    amount: 300000,
    telephone: '345-678-9012',
    status: 'SEND',
  },
  {
    id: 4,
    quotationNumber: 'Q1004',
    category: 'IT Services',
    details: 'IT and network installation services',
    date: '2024-11-04',
    name: 'IT Services Quotation',
    address: '8765 South Boulevard',
    city: 'Smallville',
    amount: 150000,
    telephone: '456-789-0123',
    status: 'DRAFT',
  },
];

export const subcontractors: Subcontractor[] = [
  {
    id: 0,
    companyName: 'Green Builders Inc.',
    commerceNumber: '987654321',
    vatTaxNumber: 'GB987654321',
    businessAddress: '789 Green Lane',
    city: 'Greenfield',
    country: 'USA',
    email: 'contact@greenbuilders.com',
    telephone: '800-123-4567',
  },
  {
    id: 1,
    companyName: 'Tech Innovations LLC',
    commerceNumber: '123456789',
    vatTaxNumber: 'TI123456789',
    businessAddress: '123 Tech Park',
    city: 'Silicon Valley',
    country: 'USA',
    email: 'info@techinnovations.com',
    telephone: '800-234-5678',
  },
  {
    id: 2,
    companyName: 'Modern Landscaping Ltd.',
    commerceNumber: '567890123',
    vatTaxNumber: 'ML567890123',
    businessAddress: '456 Garden Street',
    city: 'Roseville',
    country: 'Canada',
    email: 'support@modernlandscaping.com',
    telephone: '800-345-6789',
  },
  {
    id: 3,
    companyName: 'Quality Constructions',
    commerceNumber: '234567890',
    vatTaxNumber: 'QC234567890',
    businessAddress: '234 Builder Blvd',
    city: 'Construct City',
    country: 'UK',
    email: 'services@qualityconstructions.co.uk',
    telephone: '800-456-7890',
  },
  {
    id: 4,
    companyName: 'Eco Electric',
    commerceNumber: '345678901',
    vatTaxNumber: 'EE345678901',
    businessAddress: '567 Watt Road',
    city: 'Electron',
    country: 'Germany',
    email: 'contact@ecoelectric.de',
    telephone: '800-567-8901',
  },
];
