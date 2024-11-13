import { UserGender } from '@app-types/module.types';
import { Parent } from '@app-modules/user/entities/parent.entity';
import { mockChildren } from './child';
import { mockClass } from './class';
import { CreateUserDto } from '@app-modules/user/dtos/create-user.dto';

export const mockParentData: CreateUserDto = {
  gender: UserGender.FEMALE,
  firstName: 'John',
  lastName: 'Doe',
  appwriteId: '6166b3b3b5bm',
  contact: {
    phoneNumber: '+1234567890',
    address: '788 Elm St, Springfield',
  },
};

export const mockParents: Parent[] = [
  {
    id: 'a67b78bb-a9c3-4ac8-b05e-28027618db89',
    gender: UserGender.FEMALE,
    firstName: 'John',
    lastName: 'Doe',
    contact: {
      phoneNumber: '+1234567890',
      address: '788 Elm St, Springfield',
    },
    children: [],
    appwriteId: '6166b3b3b5bm',
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'febbfca1-1496-4228-b448-5ee0ffc1608b',
    gender: UserGender.MALE,
    firstName: 'David',
    lastName: 'Johnson',
    appwriteId: '6166b3b855bm',

    contact: {
      phoneNumber: '+0987654321',
      address: '456 Oak Ave, Riverdale',
    },
    children: [
      {
        id: '29c34f03-bf95-4b41-938b-fce55208a3d9',
        gender: UserGender.MALE,
        firstName: 'Liam',
        lastName: 'Smith',
        class: mockClass.LOVE,
        appwriteId: '618733b3b5b3d',
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
        // parent: mockParents[1],
      },
    ],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'b215b0d7-a9e9-4e8e-84ee-ad0e46107caa',
    gender: UserGender.FEMALE,
    firstName: 'Sarah',
    lastName: 'Taylor',
    appwriteId: '6166b3b3b5ba',
    contact: {
      phoneNumber: '+1122334455',
      address: '123 Maple St, Greenfield',
    },
    children: [mockChildren[2]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'ca3f2f5c-f2c9-46ff-a6a5-6a3adfd3765b',
    gender: UserGender.MALE,
    firstName: 'Daniel',
    lastName: 'Johnson',
    appwriteId: '6166b3b3b5bb',
    contact: {
      phoneNumber: '+5566778899',
      address: '321 Pine St, Rivertown',
    },
    children: [mockChildren[3]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '85d73f3a-6684-4d4b-8f56-11e34b9a5cd4',
    gender: UserGender.FEMALE,
    firstName: 'Laura',
    lastName: 'Davis',
    appwriteId: '6166b3b3b5bc',
    contact: {
      phoneNumber: '+2233445566',
      address: '654 Birch St, Lakewood',
    },
    children: [mockChildren[4]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'f0fce5ef-b743-4561-8968-793fe131e48f',
    gender: UserGender.MALE,
    firstName: 'Thomas',
    lastName: 'Wilson',
    appwriteId: '6166b3b3b5bd',
    contact: {
      phoneNumber: '+6677889900',
      address: '987 Cedar St, Hilltown',
    },
    children: [mockChildren[5]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'ff9d8970-e96c-4274-af76-e1ebd08db900',
    gender: UserGender.FEMALE,
    firstName: 'Jessica',
    lastName: 'Martinez',
    appwriteId: '6166b3b3b5be',
    contact: {
      phoneNumber: '+3344556677',
      address: '852 Walnut St, Brookside',
    },
    children: [mockChildren[6]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '1ef514fe-fe10-4b24-a22e-fcc015242a90',
    gender: UserGender.MALE,
    firstName: 'Noah',
    lastName: 'Garcia',
    appwriteId: '6166b3b3b5bf',
    contact: {
      phoneNumber: '+9988776655',
      address: '741 Spruce St, Meadowbrook',
    },
    children: [mockChildren[7]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '8f36f83a-8cd5-459d-a7ab-1fc00df9cc2e',
    gender: UserGender.FEMALE,
    firstName: 'Amanda',
    lastName: 'Rodriguez',
    appwriteId: '6166b3b3b5bg',
    contact: {
      phoneNumber: '+2233445566',
      address: '963 Fir St, Grandview',
    },
    children: [mockChildren[8]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: '644919c2-f208-42ce-a547-ba4075047e1e',
    gender: UserGender.MALE,
    firstName: 'Elijah',
    lastName: 'Hernandez',
    appwriteId: '6166b3b3b5bh',
    contact: {
      phoneNumber: '+4455667788',
      address: '159 Elm St, Crestwood',
    },
    children: [mockChildren[9]],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
];
