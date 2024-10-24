// import { subcontractors } from './subcontractorsPageDatas';

export const servicesData = [
  {
    id: '1',
    name: 'Parket zonder behandeling',
    subservices: [{ id: '1', name: 'Schuren en polijsten fijn', price: 15, unit: 'm2' }],
    subcontractors: [
      {
        id: '1',
        name: 'B.Demir',
        prices: [434.0],
      },
      {
        id: '2',
        name: 'Naim',
        prices: [434.0],
      },
    ],
  },

  {
    id: '2',
    name: 'Parket Olie & Hardwax (Inclusief materiaal en afwerking)',
    subservices: [
      { id: '1', name: 'Schuren en polijsten fijn', price: 15, unit: 'm2' },
      { id: '2', name: 'Schuren polsten en eerste laag olie', price: 15, unit: 'm2' },
      { id: '3', name: 'Schuren polsten en 2 lagen hardwax', price: 15, unit: 'm2' },
    ],
    subcontractors: [
      {
        id: '1',
        name: 'B.Demir',
        prices: [434.0, 434.0, 434.0],
      },
      {
        id: '2',
        name: 'Naim',
        prices: [434.0, 434.0, 434.0],
      },
      {
        id: '3',
        name: 'Parketherstel',
        prices: [434.0, 434.0, 434.0],
      },
    ],
  },
  {
    id: '3',
    name: 'Parket Olie & Hardwax (Inclusief materiaal en afwerking ) ',
    subservices: [
      { id: '1', name: 'Schuren en polijsten fijn', price: 15, unit: 'm2' },
      { id: '2', name: 'Schuren polsten en eerste laag olie', price: 15, unit: 'm2' },
      { id: '3', name: 'Schuren polsten en 2 lagen hardwax', price: 15, unit: 'm2' },
      { id: '4', name: 'Schuren polsten en 2 lagen hardwax', price: 15, unit: 'm2' },
      { id: '5', name: 'Schuren polsten en 2 lagen hardwax', price: 15, unit: 'm2' },
      { id: '6', name: 'Schuren polsten en 2 lagen hardwax', price: 15, unit: 'm2' },
    ],
    subcontractors: [
      {
        id: '1',
        name: 'B.Demir',
        prices: [434.0, 434.0, 434.0, 203.2, 1003, 100],
      },
      {
        id: '2',
        name: 'Naim',
        prices: [434.0, 434.0, 434.0, 203.2, 1003, 100],
      },
      {
        id: '3',
        name: 'Parketherstel',
        prices: [434.0, 434.0, 434.0, 203.2, 1003, 100],
      },
    ],
  },
];
