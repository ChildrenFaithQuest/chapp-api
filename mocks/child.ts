import { Child } from '@app-modules/user/entities/child.entity';
import { UserGender } from '@app-types/module.types';
// import { mockParents } from './parent';
import { mockClass } from './class';

export const mockChildData = {
  gender: UserGender.FEMALE,
  firstName: 'Sophia',
  lastName: 'Johnson',
};

export const mockChildren: Child[] = [
  {
    id: 'child_001',
    gender: UserGender.FEMALE,
    firstName: 'Sophia',
    lastName: 'Johnson',
    class: mockClass.FAITHFULNESS,
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    // parent: mockParents[0],
  },
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
  {
    id: 'child_003',
    gender: UserGender.FEMALE,
    firstName: 'Emma',
    lastName: 'Brown',
    class: mockClass.GOODNESS,
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    // parent: mockParents[2],
  },
  {
    id: 'child_004',
    gender: UserGender.MALE,
    firstName: 'Noah',
    lastName: 'Davis',
    class: mockClass.KINDNESS,
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
    // parent: mockParents[3],
  },
  {
    id: 'child_005',
    gender: UserGender.FEMALE,
    firstName: 'Olly',
    lastName: 'Miller',
    class: mockClass.PATIENCE,
    // parent: mockParents[4],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'child_006',
    gender: UserGender.MALE,
    firstName: 'Aiden',
    lastName: 'Wilson',
    class: mockClass.GOODNESS,
    // parent: mockParents[5],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'child_007',
    gender: UserGender.FEMALE,
    firstName: 'Isabella',
    lastName: 'Taylor',
    class: mockClass.FAITHFULNESS,
    // parent: mockParents[6],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'child_008',
    gender: UserGender.MALE,
    firstName: 'Mason',
    lastName: 'Anderson',
    class: mockClass.PEACE,
    // parent: mockParents[7],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'child_009',
    gender: UserGender.FEMALE,
    firstName: 'Ava',
    lastName: 'Thomas',
    class: mockClass.KINDNESS,
    // parent: mockParents[8],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
  {
    id: 'child_010',
    gender: UserGender.MALE,
    firstName: 'Ethan',
    lastName: 'Jackson',
    class: mockClass.GENTLENESS,
    // parent: mockParents[9],
    createdAt: new Date('2021-10-12T22:45:00Z'),
    updatedAt: new Date('2021-10-12T22:45:00Z'),
  },
];
