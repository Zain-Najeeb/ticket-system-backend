import { Request, Response } from 'express';
import { usersTableName } from '../../constants';
import { User } from 'global';
import bcrypt from 'bcrypt';
import runQuery from '../../database/query';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface LoginResponse {
  body: User;
}

const login = async (req: LoginRequest, res: Response<LoginResponse>) => {
  let body: User = { isAuthenticated: false };
  const { email, password } = req.body;
  const query = `SELECT username, role, password_hash, email FROM ${usersTableName} WHERE email = ?`;

  try {
    const users = await runQuery<{ username: string; password_hash: string; role: string; email: string }>(query, [email], 'SELECT');
    const user = users[0];

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (isMatch) {
        req.session.user = {
          username: user.username,
          role: user.role,
          email: user.email
        };
        body = {
          ...body,
          isAuthenticated: true,
          ...user,
        };
        return res.status(200).json({ body });
      }
    }
    res.status(200).json({ body }); 
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send({body});
  }
};
export default login