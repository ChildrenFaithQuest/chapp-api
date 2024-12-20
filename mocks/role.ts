import { Role } from '@app-modules/role/entities/role.entity';
import { Permission, RoleType } from '@app-types/role.types';

export const mockRoles: Role[] = [
  {
    id: 'b6f8dfec-3e6d-4cb1-8c70-3adad9f12d67',
    name: RoleType.ADMIN,
    permissions: [
      Permission.MANAGE_USERS,
      Permission.VIEW_REPORTS,
      Permission.EDIT_CLASSES,
      Permission.ASSIGN_ROLES,
      Permission.MANAGE_PERMISSIONS,
      Permission.VIEW_ALL_ATTENDANCE,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  {
    id: '1a5d7df9-75c1-42e3-8fd1-d7746347db59',
    name: RoleType.TEACHER,
    permissions: [
      Permission.VIEW_CLASSES,
      Permission.EDIT_ATTENDANCE,
      Permission.MANAGE_HOMEWORK,
      Permission.VIEW_STUDENTS,
      Permission.CREATE_MATERIALS,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  {
    id: '3cf33bc9-01f8-4d19-830b-fc579e53c3de',
    name: RoleType.PARENT,
    permissions: [
      Permission.VIEW_HOMEWORK,
      Permission.VIEW_ATTENDANCE,
      Permission.MESSAGE_TEACHER,
      Permission.VIEW_CLASS_SCHEDULE,
      Permission.VIEW_PROGRESS_REPORTS,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  {
    id: 'a073cfeb-8a9b-451e-8c12-933c25e8ae19',
    name: RoleType.SUPER_ADMIN,
    permissions: [
      Permission.MANAGE_EVERYTHING,
      Permission.VIEW_REPORTS,
      Permission.EDIT_SETTINGS,
      Permission.MANAGE_ROLES,
      Permission.VIEW_AUDIT_LOGS,
      Permission.CONFIGURE_SYSTEM,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  {
    id: '7fc24d3b-c769-4e5e-961b-b3123f158d56',
    name: RoleType.TEACHER,
    permissions: [
      Permission.VIEW_CLASSES,
      Permission.EDIT_ATTENDANCE,
      Permission.ASSIST_WITH_HOMEWORK,
      Permission.VIEW_STUDENTS,
      Permission.ASSIST_MATERIALS_PREPARATION,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  {
    id: 'c3c0d3b1-9a0d-4d29-81d5-70215a1734f8',
    name: RoleType.CHILD,
    permissions: [
      Permission.VIEW_HOMEWORK,
      Permission.VIEW_CLASS_SCHEDULE,
      Permission.VIEW_ATTENDANCE,
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockRole = {
  ADMIN: {
    id: 'b6f8dfec-3e6d-4cb1-8c70-3adad9f12d67',
    name: RoleType.ADMIN,
    permissions: [
      Permission.MANAGE_USERS,
      Permission.VIEW_REPORTS,
      Permission.EDIT_CLASSES,
      Permission.ASSIGN_ROLES,
      Permission.MANAGE_PERMISSIONS,
      Permission.VIEW_ALL_ATTENDANCE,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  TEACHER: {
    id: '1a5d7df9-75c1-42e3-8fd1-d7746347db59',
    name: RoleType.TEACHER,
    permissions: [
      Permission.VIEW_CLASSES,
      Permission.EDIT_ATTENDANCE,
      Permission.MANAGE_HOMEWORK,
      Permission.VIEW_STUDENTS,
      Permission.CREATE_MATERIALS,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  PARENT: {
    id: '3cf33bc9-01f8-4d19-830b-fc579e53c3de',
    name: RoleType.PARENT,
    permissions: [
      Permission.VIEW_HOMEWORK,
      Permission.VIEW_ATTENDANCE,
      Permission.MESSAGE_TEACHER,
      Permission.VIEW_CLASS_SCHEDULE,
      Permission.VIEW_PROGRESS_REPORTS,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  SUPER_ADMIN: {
    id: 'a073cfeb-8a9b-451e-8c12-933c25e8ae19',
    name: RoleType.SUPER_ADMIN,
    permissions: [
      Permission.MANAGE_EVERYTHING,
      Permission.VIEW_REPORTS,
      Permission.EDIT_SETTINGS,
      Permission.MANAGE_ROLES,
      Permission.VIEW_AUDIT_LOGS,
      Permission.CONFIGURE_SYSTEM,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  ASST_TEACHER: {
    id: '7fc24d3b-c769-4e5e-961b-b3123f158d56',
    name: RoleType.TEACHER,
    permissions: [
      Permission.VIEW_CLASSES,
      Permission.EDIT_ATTENDANCE,
      Permission.ASSIST_WITH_HOMEWORK,
      Permission.VIEW_STUDENTS,
      Permission.ASSIST_MATERIALS_PREPARATION,
    ],
    createdAt: new Date('2023-10-17T10:00:00Z'),
    updatedAt: new Date('2023-10-17T10:00:00Z'),
  },
  CHILD: {
    id: 'c3c0d3b1-9a0d-4d29-81d5-70215a1734f8',
    name: RoleType.CHILD,
    permissions: [
      Permission.VIEW_HOMEWORK,
      Permission.VIEW_CLASS_SCHEDULE,
      Permission.VIEW_ATTENDANCE,
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
