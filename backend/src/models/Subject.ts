/**
 * Subject Model
 * Requirements: 6.1, 6.2, 6.3
 */

import { query, queryOne } from '@config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  creditHours: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a subject
 * Requirement 6.1: Accept subject name, code, description
 */
export const createSubject = async (
  name: string,
  code: string,
  creditHours: number,
  description?: string
): Promise<Subject> => {
  const id = uuidv4();

  const result = await query<Subject>(
    `INSERT INTO subjects (id, name, code, description, credit_hours)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, code, description, credit_hours, created_at, updated_at`,
    [id, name, code, description, creditHours]
  );

  return result[0];
};

/**
 * Get subject by ID
 */
export const getSubjectById = async (id: string): Promise<Subject | null> => {
  return queryOne<Subject>(
    `SELECT id, name, code, description, credit_hours, created_at, updated_at
     FROM subjects WHERE id = $1`,
    [id]
  );
};

/**
 * Get subject by code
 */
export const getSubjectByCode = async (code: string): Promise<Subject | null> => {
  return queryOne<Subject>(
    `SELECT id, name, code, description, credit_hours, created_at, updated_at
     FROM subjects WHERE code = $1`,
    [code]
  );
};

/**
 * Get all subjects
 */
export const getAllSubjects = async (): Promise<Subject[]> => {
  return query<Subject>(
    `SELECT id, name, code, description, credit_hours, created_at, updated_at
     FROM subjects
     ORDER BY name ASC`
  );
};

/**
 * Update subject
 */
export const updateSubject = async (
  id: string,
  updates: Partial<Subject>
): Promise<Subject | null> => {
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
    return getSubjectById(id);
  }

  values.push(id);

  const result = await query<Subject>(
    `UPDATE subjects SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramCount}
     RETURNING id, name, code, description, credit_hours, created_at, updated_at`,
    values
  );

  return result.length > 0 ? result[0] : null;
};

/**
 * Delete subject
 */
export const deleteSubject = async (id: string): Promise<void> => {
  await query('DELETE FROM subjects WHERE id = $1', [id]);
};
