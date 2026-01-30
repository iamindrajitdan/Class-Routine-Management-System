/**
 * Type definitions for the application
 * Requirements: 8.1, 8.2, 15.1, 15.2
 */

export enum UserRole {
  Admin = 'Admin',
  AcademicPlanner = 'Academic_Planner',
  Faculty = 'Faculty',
  Student = 'Student',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  departmentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Express.Request {
  user?: JWTPayload;
  ip?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
