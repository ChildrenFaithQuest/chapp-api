import { Auth } from '@app-modules/auth/entities/auth.entity';
import { UserType } from '@app-types/module.types';
import { mockParents } from './parent';
import { mockChildren } from './child';
import { mockTeachers } from './teacher';

export const mockAuths: Auth[] = [
  {
    id: 'c6614cd8-ec2b-4802-ac3e-bad94207cec3',
    email: 'john.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    parent: mockParents[0],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '1072c6b9-7c9f-474c-bb51-2661285a2f62',
    email: 'mary.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    roles: [],
    child: mockChildren[0],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '3ef1c5be-cb54-429f-b880-d8693c6e0217',
    email: 'olivia.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    roles: [],
    teacher: mockTeachers[0],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '51b174a4-8747-4182-8850-1c5e0e99cbe5',
    email: 'david.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    roles: [],
    parent: mockParents[1],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '16d8d248-e09d-4da3-bb2c-1529377298b1',
    email: 'liam.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    roles: [],
    child: mockChildren[1],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '071a4eaf-527b-40ab-9d3a-17c26d9a52fe',
    email: 'ethan.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    roles: [],
    teacher: mockTeachers[1],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'auth_007',
    email: 'sarah.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    roles: [],
    parent: mockParents[2],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'e605110f-235e-4a09-8cca-bd5fa9586866',
    email: 'emma.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    child: mockChildren[2],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '7aa5c338-372d-4213-bebb-77013b4ab05c',
    email: 'susan.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    teacher: mockTeachers[2],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '509feaa9-2162-4268-bc24-15a251202717',
    email: 'daniel.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    parent: mockParents[3],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'b7da8265-20d1-4567-a5ae-9c2e8576f746',
    email: 'noah.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    child: mockChildren[3],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'c5cfc90c-d6f0-4c3e-9a47-e80a257fd828',
    email: 'robert.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    teacher: mockTeachers[3],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'cae97d7d-78ca-4a57-9891-6f050e9edcf1',
    email: 'laura.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    parent: mockParents[4],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '9bbceba9-68a3-4f7c-ae0e-c146674aee92',
    email: 'olly.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    child: mockChildren[4],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '0b6255a0-2254-4c50-b3d1-f31e3c0f97b5',
    email: 'rachel.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    teacher: mockTeachers[4],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '1c47c2e1-ae80-4312-9444-62ce36cad843',
    email: 'thomas.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    parent: mockParents[5],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '389fef85-5af7-4758-bf1b-30109a09af06',
    email: 'aiden.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    roles: [],
    child: mockChildren[5],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '9dde622d-f19a-4b9c-aa50-fa4f6e4d44aa',
    email: 'jacob.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    teacher: mockTeachers[5],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'd2420b83-83f9-4685-bea6-19d96c597bb7',
    email: 'jessica.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    parent: mockParents[6],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'd8922362-3888-4e3b-aed3-476fff8f84d7',
    email: 'isabella.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    child: mockChildren[6],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'd2420b83-83f9-4685-bea6-19d96c597bb7',
    email: 'ava.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    teacher: mockTeachers[6],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'd8922362-3888-4e3b-aed3-476fff8f84d7',
    email: 'noah.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    parent: mockParents[7],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'auth_023',
    email: 'mason.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    child: mockChildren[7],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '4a40f431-a09d-44c3-b013-2545dcbab172',
    email: 'james.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    teacher: mockTeachers[7],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'be8a9c53-54dc-4880-95b2-c34c7e1d1ed0',
    email: 'amanda.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    parent: mockParents[8],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'cc326815-6fc9-4f12-89f8-7624143c3caf',
    email: 'ava.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    child: mockChildren[8],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'c0617194-8c57-4c27-b9b8-140db4f71167',
    email: 'mia.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    teacher: mockTeachers[8],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'f568dbfd-be08-48e2-a254-a356c0895eae',
    email: 'elijah.parent@example.com',
    password: 'password123',
    userType: UserType.PARENT,
    parent: mockParents[9],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'f7a0c1a6-0f42-4f6e-ab1f-6955dbfbf06d',
    email: 'ethan.child@example.com',
    password: 'password123',
    userType: UserType.CHILD,
    child: mockChildren[9],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '6e53f99c-0156-47f4-ba78-11f5145ae0b3',
    email: 'james.teacher@example.com',
    password: 'password123',
    userType: UserType.TEACHER,
    teacher: mockTeachers[9],
    roles: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
];
