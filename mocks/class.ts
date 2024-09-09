import { Class } from '@app-modules/class/entities/class.entity';
import { mockChurch } from './church';

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
    id: 'class_005',
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
    church: mockChurch.A,
  },
  GOODNESS: {
    id: 'class_006',
    name: 'GOODNESS',
    ageGroup: '11-12',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '3:00 PM',
      frequency: 'Weekly',
    },
    children: [],
    church: mockChurch.A,
    createdAt: new Date('2023-06-01T15:00:00Z'),
    updatedAt: new Date('2023-06-10T15:00:00Z'),
  },
  LOVE: {
    id: 'class_001',
    name: 'LOVE',
    ageGroup: '0-2',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '10:00 AM',
      frequency: 'Weekly',
      additionalDetails: 'Starting in January',
    },
    children: [],
    church: mockChurch.A,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-10T10:00:00Z'),
  },
  JOY: {
    id: 'class_001',
    name: 'LOVE',
    ageGroup: '0-2',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '10:00 AM',
      frequency: 'Weekly',
      additionalDetails: 'Starting in January',
    },
    children: [],
    church: mockChurch.A,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-10T10:00:00Z'),
  },
  FAITHFULNESS: {
    id: 'class_004',
    name: 'FAITHFULNESS',
    ageGroup: '7-8',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '9:00 AM',
      frequency: 'Monthly',
      additionalDetails: 'Starting from March',
    },
    children: [],
    church: mockChurch.A,
    createdAt: new Date('2023-04-01T09:00:00Z'),
    updatedAt: new Date('2023-04-10T09:00:00Z'),
  },
  GENTLENESS: {
    id: 'class_007',
    name: 'GENTLENESS',
    ageGroup: 'TEENS',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '5:00 PM',
      frequency: 'Weekly',
      additionalDetails: 'Starting from April',
    },
    children: [],
    church: mockChurch.A,
    createdAt: new Date('2023-07-01T17:00:00Z'),
    updatedAt: new Date('2023-07-10T17:00:00Z'),
  },
  PATIENCE: {
    id: 'class_008',
    name: 'PATIENCE',
    ageGroup: '0-2',
    schedule: {
      dayOfWeek: 'Sunday',
      time: '10:00 AM',
      frequency: 'Weekly',
    },
    children: [],
    church: mockChurch.A,
    createdAt: new Date('2023-08-01T10:00:00Z'),
    updatedAt: new Date('2023-08-15T10:00:00Z'),
  },
  PEACE: {
    id: 'class_003',
    name: 'PEACE',
    ageGroup: '5-6',
    schedule: {
      dayOfWeek: 'Wednesday',
      time: '2:00 PM',
      frequency: 'Weekly',
    },
    children: [],
    church: mockChurch.A,
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
    id: 'class_009',
    name: 'PEACE',
    ageGroup: '5-6',
    schedule: {
      dayOfWeek: 'Wednesday',
      time: '2:00 PM',
      frequency: 'Weekly',
      additionalDetails: 'Summer session',
    },
    children: [],
    church: mockChurch.A,
    createdAt: new Date('2023-09-01T14:00:00Z'),
    updatedAt: new Date('2023-09-15T14:00:00Z'),
  },
  {
    id: 'class_010',
    name: 'JOY',
    ageGroup: '3-4',
    schedule: {
      dayOfWeek: 'Monday',
      time: '11:00 AM',
      frequency: 'Bi-weekly',
    },
    children: [],
    church: mockChurch.A,
    createdAt: new Date('2023-10-01T11:00:00Z'),
    updatedAt: new Date('2023-10-15T11:00:00Z'),
  },
];
