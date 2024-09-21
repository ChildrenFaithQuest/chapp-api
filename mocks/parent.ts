import { UserGender } from '@app-types/module.types';
import { Parent } from '@app-modules/user/entities/parent.entity';
import { mockChildren } from './child';
import { mockClass } from './class';

export const mockParentData = {
  gender: UserGender.FEMALE,
  firstName: 'John',
  lastName: 'Doe',
  contact: {
    phoneNumber: '+1234567890',
    address: '788 Elm St, Springfield',
  },
  children: [],
};

export const mockParents: Parent[] = [
  {
    id: 'parent_001',
    gender: UserGender.FEMALE,
    firstName: 'John',
    lastName: 'Doe',
    contact: {
      phoneNumber: '+1234567890',
      address: '788 Elm St, Springfield',
    },
    children: [],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_002',
    gender: UserGender.MALE,
    firstName: 'David',
    lastName: 'Johnson',

    contact: {
      phoneNumber: '+0987654321',
      address: '456 Oak Ave, Riverdale',
    },
    children: [
      {
        id: 'child_002',
        gender: UserGender.MALE,
        firstName: 'Liam',
        lastName: 'Smith',
        class: mockClass.LOVE,
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
        // parent: mockParents[1],
      },
    ],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_003',
    gender: UserGender.FEMALE,
    firstName: 'Sarah',
    lastName: 'Taylor',
    contact: {
      phoneNumber: '+1122334455',
      address: '123 Maple St, Greenfield',
    },
    children: [mockChildren[2]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_004',
    gender: UserGender.MALE,
    firstName: 'Daniel',
    lastName: 'Johnson',
    contact: {
      phoneNumber: '+5566778899',
      address: '321 Pine St, Rivertown',
    },
    children: [mockChildren[3]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_005',
    gender: UserGender.FEMALE,
    firstName: 'Laura',
    lastName: 'Davis',
    contact: {
      phoneNumber: '+2233445566',
      address: '654 Birch St, Lakewood',
    },
    children: [mockChildren[4]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_006',
    gender: UserGender.MALE,
    firstName: 'Thomas',
    lastName: 'Wilson',
    contact: {
      phoneNumber: '+6677889900',
      address: '987 Cedar St, Hilltown',
    },
    children: [mockChildren[5]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_007',
    gender: UserGender.FEMALE,
    firstName: 'Jessica',
    lastName: 'Martinez',
    contact: {
      phoneNumber: '+3344556677',
      address: '852 Walnut St, Brookside',
    },
    children: [mockChildren[6]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_008',
    gender: UserGender.MALE,
    firstName: 'Noah',
    lastName: 'Garcia',
    contact: {
      phoneNumber: '+9988776655',
      address: '741 Spruce St, Meadowbrook',
    },
    children: [mockChildren[7]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_009',
    gender: UserGender.FEMALE,
    firstName: 'Amanda',
    lastName: 'Rodriguez',
    contact: {
      phoneNumber: '+2233445566',
      address: '963 Fir St, Grandview',
    },
    children: [mockChildren[8]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'parent_010',
    gender: UserGender.MALE,
    firstName: 'Elijah',
    lastName: 'Hernandez',
    contact: {
      phoneNumber: '+4455667788',
      address: '159 Elm St, Crestwood',
    },
    children: [mockChildren[9]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
];
