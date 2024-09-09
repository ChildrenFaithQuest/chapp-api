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
    id: '12345',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[1],
    class: mockClass.GENTLENESS,
  },
  {
    id: '12346',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[2],
    class: mockClass.GOODNESS,
  },
  {
    id: '12347',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[1],
    class: mockClass.GOODNESS,
  },
  {
    id: '12348',
    status: AttendanceStatus.ABSENT,
    date: '2021-10-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[1],
    class: mockClass.JOY,
  },
  {
    id: '12349',
    status: AttendanceStatus.ABSENT,
    date: '2021-11-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[2],
    class: mockClass.GOODNESS,
  },
  {
    id: '12340',
    status: AttendanceStatus.ABSENT,
    date: '2021-09-12',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    child: mockChildren[5],
    class: mockClass.LOVE,
  },
];
