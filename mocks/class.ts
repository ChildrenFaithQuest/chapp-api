import { Class } from '@app-modules/class/entities/class.entity';
import { mockOrg } from './organization';

type ClassName =
  | 'PATIENCE'
  | 'KINDNESS'
  | 'GOODNESS'
  | 'LOVE'
  | 'PEACE'
  | 'JOY'
  | 'FAITHFULNESS'
  | 'GENTLENESS';

export const mockClass: { [key in ClassName]: Class } = {
  KINDNESS: {
    id: 'db6a6c2d-a9df-4651-9fdc-b4c9d44c4a2a',
    name: 'KINDNESS',
    ageGroup: '9-10',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '1:00 PM',
      frequency: 'Weekly',
    },
    createdAt: new Date('2023-05-01T13:00:00Z'),
    updatedAt: new Date('2023-05-15T13:00:00Z'),
    children: [],
    organization: mockOrg.A,
  },
  GOODNESS: {
    id: '112044d4-400f-498c-b993-4b86100b111b',
    name: 'GOODNESS',
    ageGroup: '11-12',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '3:00 PM',
      frequency: 'Weekly',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-06-01T15:00:00Z'),
    updatedAt: new Date('2023-06-10T15:00:00Z'),
  },
  LOVE: {
    id: 'f4207e12-9e2d-48a9-9583-e692d0c57dde',
    name: 'LOVE',
    ageGroup: '0-2',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '10:00 AM',
      frequency: 'Weekly',
      additionalDetails: 'Starting in January',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-10T10:00:00Z'),
  },
  JOY: {
    id: 'f9b55fa4-8cb4-4c7f-a018-1ecc6b616b6f',
    name: 'LOVE',
    ageGroup: '0-2',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '10:00 AM',
      frequency: 'Weekly',
      additionalDetails: 'Starting in January',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-10T10:00:00Z'),
  },
  FAITHFULNESS: {
    id: '8eff5ffa-d12d-4b47-9af9-5b2c69d38e6e',
    name: 'FAITHFULNESS',
    ageGroup: '7-8',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '9:00 AM',
      frequency: 'Monthly',
      additionalDetails: 'Starting from March',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-04-01T09:00:00Z'),
    updatedAt: new Date('2023-04-10T09:00:00Z'),
  },
  GENTLENESS: {
    id: 'd6f6090d-3f13-4a94-9c87-6ad2316a6294',
    name: 'GENTLENESS',
    ageGroup: 'TEENS',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '5:00 PM',
      frequency: 'Weekly',
      additionalDetails: 'Starting from April',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-07-01T17:00:00Z'),
    updatedAt: new Date('2023-07-10T17:00:00Z'),
  },
  PATIENCE: {
    id: '69fcebc6-7ce8-4814-8622-45b18bbfd034',
    name: 'PATIENCE',
    ageGroup: '0-2',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '10:00 AM',
      frequency: 'Weekly',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-08-01T10:00:00Z'),
    updatedAt: new Date('2023-08-15T10:00:00Z'),
  },
  PEACE: {
    id: '57b1d09d-bd66-47d4-8780-7077ba8c7e8c',
    name: 'PEACE',
    ageGroup: '5-6',
    schedule: {
      dayOfWeek: 'Wednesday',
      time: '2:00 PM',
      frequency: 'Weekly',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-03-01T14:00:00Z'),
    updatedAt: new Date('2023-03-20T14:00:00Z'),
  },
};

export const mockClasses: Class[] = [
  mockClass.LOVE,
  mockClass.JOY,
  mockClass.PEACE,
  mockClass.FAITHFULNESS,
  mockClass.KINDNESS,
  mockClass.GENTLENESS,
  mockClass.GOODNESS,
  mockClass.PATIENCE,
  {
    id: '1136699c-88b0-4ec5-8e87-81e3a1599e13',
    name: 'PEACE',
    ageGroup: '5-6',
    schedule: {
      dayOfWeek: 'Wednesday',
      time: '2:00 PM',
      frequency: 'Weekly',
      additionalDetails: 'Summer session',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-09-01T14:00:00Z'),
    updatedAt: new Date('2023-09-15T14:00:00Z'),
  },
  {
    id: '8ab095e0-0af9-43a5-8159-e0d5e5662f25',
    name: 'JOY',
    ageGroup: '3-4',
    schedule: {
      dayOfWeek: 'Monday',
      time: '11:00 AM',
      frequency: 'Bi-weekly',
    },
    children: [],
    organization: mockOrg.A,
    createdAt: new Date('2023-10-01T11:00:00Z'),
    updatedAt: new Date('2023-10-15T11:00:00Z'),
  },
];
