/**
 * User Model
 * Requirements: 8.1, 8.2, 15.1
 */

import { query, queryOne } from '@config/database';
import { User, UserRole } from '@types/index';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new user
 */
export const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole = UserRole.Student,
  departmentId?: string
): Promise<User> => {
  const id = uuidv4();
  const passwordHash = await bcryptjs.hash(password, 10);

  const result = await query<User>(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true)
     RETURNING id, email, first_name, last_name, role, department_id, is_active, created_at, updated_at`,
    [id, email, passwordHash, firstName, lastName, role, departmentId]
  );

  return result[0];
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User | null> => {
  return queryOne<User>(
    `SELECT id, email, first_name, last_name, role, department_id, is_active, created_at, updated_at
     FROM users WHERE id = $1`,
    [id]
  );
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return queryOne<User>(
    `SELECT id, email, first_name, last_name, role, department_id, is_active, created_at, updated_at
     FROM users WHERE email = $1`,
    [email]
  );
};

/**
 * Verify user password
 */
export const verifyPassword = async (email: string, password: string): Promise<User | null> => {
  const result = await query<{ id: string; password_hash: string }>(
    'SELECT id, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (result.length === 0) {
    return null;
  }

  const isValid = await bcryptjs.compare(password, result[0].password_hash);
  if (!isValid) {
    return null;
  }

  return getUserById(result[0].id);
};

/**
 * Update user
 */
export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User | null> => {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'createdAt') {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return getUserById(id);
  }

  values.push(id);

  const result = await query<User>(
    `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramCount}
     RETURNING id, email, first_name, last_name, role, department_id, is_active, created_at, updated_at`,
    values
  );

  return result.length > 0 ? result[0] : null;
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: UserRole): Promise<User[]> => {
  return query<User>(
    `SELECT id, email, first_name, last_name, role, department_id, is_active, created_at, updated_at
     FROM users WHERE role = $1 AND is_active = true`,
    [role]
  );
};

/**
 * Delete user (soft delete)
 */
export const deleteUser = async (id: string): Promise<void> => {
  await query('UPDATE users SET is_active = false WHERE id = $1', [id]);
};
