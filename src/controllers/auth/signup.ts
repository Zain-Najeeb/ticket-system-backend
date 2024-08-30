import { Request, Response } from 'express';
import { saltRounds, usersTableName } from '../../constants';
import { User } from 'global';
import bcrypt from 'bcrypt';
import runQuery from '../../database/query';

interface SignUpRequest extends Request {
  body: User;
}

interface SignUpResponse {
  message?: string;
  body?: User;
  errors?: string[];
}

const signUp = async (req: SignUpRequest, res: Response<SignUpResponse>) => {
  const { email, password, role, username }: User = req.body;

  if (password) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = `INSERT INTO ${usersTableName} (username, password_hash, email, role) VALUES (?, ?, ?, ?)`;
      
      await runQuery(query, [username, hashedPassword, email, role], 'INSERT');
      
      req.session.user = {
        username: username,
        role: role,
        email: email,
      };
      
      const body: User = {
        isAuthenticated: true,
        email: email,
        username: username,
        role: role,
      };
      
      res.status(201).json({ message: 'User created successfully', body });

    } catch (error) {
      const errors: string[] = [];

      if (error instanceof Error) {
        const sqliteError = error as any;

        if (sqliteError.code === 'SQLITE_CONSTRAINT') {
          if (sqliteError.message.includes('UNIQUE constraint failed: users.email')) {
            errors.push('Email is already in use');
          }
          if (sqliteError.message.includes('UNIQUE constraint failed: users.username')) {
            errors.push('Username is already in use');
          }
        } else {
          errors.push('Server error');
        }
      } else {
        errors.push('Unknown error');
      }

      if (errors.length > 0) {
        res.status(400).json({ errors });
      } else {
        res.status(500).json({ errors: ['Server error'] });
      }
    }
  }
};

export default signUp;
