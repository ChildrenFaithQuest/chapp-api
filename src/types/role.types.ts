export enum Permission {
  // Admin & SuperAdmin Permissions
  MANAGE_USERS = 'manage_users',
  VIEW_REPORTS = 'view_reports',
  EDIT_CLASSES = 'edit_classes',
  ASSIGN_ROLES = 'assign_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  VIEW_ALL_ATTENDANCE = 'view_all_attendance',
  MANAGE_EVERYTHING = 'manage_everything',
  EDIT_SETTINGS = 'edit_settings',
  MANAGE_ROLES = 'manage_roles',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  CONFIGURE_SYSTEM = 'configure_system',

  // Teacher Permissions
  VIEW_CLASSES = 'view_classes',
  EDIT_ATTENDANCE = 'edit_attendance',
  MANAGE_HOMEWORK = 'manage_homework',
  VIEW_STUDENTS = 'view_students',
  CREATE_MATERIALS = 'create_materials',

  // Parent Permissions
  VIEW_HOMEWORK = 'view_homework',
  VIEW_ATTENDANCE = 'view_attendance',
  MESSAGE_TEACHER = 'message_teacher',
  VIEW_CLASS_SCHEDULE = 'view_class_schedule',
  VIEW_PROGRESS_REPORTS = 'view_progress_reports',

  // AssistantTeacher Permissions
  ASSIST_WITH_HOMEWORK = 'assist_with_homework',
  ASSIST_MATERIALS_PREPARATION = 'assist_materials_preparation',

  VIEW_SELF = 'view_self',
  VIEW_ASSIGNED_CHILDREN = 'view_assigned_children',
  VIEW_ASSIGNED_PARENTS = 'view_assigned_parents',
  EDIT_PROFILE = 'edit_profile',

  VIEW_OWN_CHILD = 'view_own_child',
}

export enum RoleType {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  PARENT = 'parent',
  CHILD = 'child',
  GUEST = 'guest',
}
