import { AttendanceStatus } from '@app-types/module.types';
import { mockClass } from './class';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { mockChildren } from './child';

export const mockAttendance: Attendance = {
  id: '1234765',
  status: AttendanceStatus.ABSENT,
  date: '2021-10-12',
  createdAt: new Date('2021-10-12T22:45:00Z'),
  updatedAt: new Date('2021-10-12T22:45:00Z'),
  child: mockChildren[0],
  class: mockClass.FAITHFULNESS,
};

export const mockAttendances: Attendance[] = [
  {
    id: '4b684f87-a165-4904-af21-3871a3dc5f09',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[1],
    class: mockClass.GENTLENESS,
  },
  {
    id: '115c4186-fa0a-4962-8218-75e09bdba93e',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[2],
    class: mockClass.GOODNESS,
  },
  {
    id: 'bf4fd12d-34b0-4a65-95ce-6da38474b86c',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[1],
    class: mockClass.GOODNESS,
  },
  {
    id: '03532ccf-d917-481c-aebc-e000ef1836e7',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[1],
    class: mockClass.JOY,
  },
  {
    id: 'd46c0651-1a79-4a5a-a764-ac227839c2b2',
    status: AttendanceStatus.ABSENT,
    date: '2021-11-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[2],
    class: mockClass.GOODNESS,
  },
  {
    id: '4368d3bb-fb6d-43b6-b26d-fc3018ad4d9e',
    status: AttendanceStatus.ABSENT,
    date: '2021-09-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[5],
    class: mockClass.LOVE,
  },
];
