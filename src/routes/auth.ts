import { Router } from 'express';
import bcrypt from 'bcrypt';
import runQuery from '../database/query';

const router = Router();
interface User {
  isAuthenticated: boolean;
  email?: string;
  role?: string;
  password?: string,
  username?: string,
}
router.post('/login', async (req, res) => {
  let body: User = { isAuthenticated: false };
  const { email, password } = req.body;
  const query = 'SELECT username, role, password_hash FROM users WHERE email = ?';

  try {
    const users = await runQuery<{ username: string; password_hash: string; role: string }>(query, [email], 'SELECT');
    const user = users[0];

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (isMatch) {
        req.session.user = {
          username: user.username,
          role: user.role,
          email: email
        };
        body.isAuthenticated = true;
        body.email = email;
        body.role = user.role;
        body.username = user.username;
        return res.status(200).json({ body });
      }
    }

    res.status(200).send({ body });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send({});
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({});
    }
    res.status(200).json({})
  });
});

router.post('/signup', async (req, res) => {
  const { email, password, role, username }: User = req.body;
  if (password) {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
      const query = `INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)`;
      try {
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
          res.status(200).json({ errors });
        } else {
          res.status(500).json({ error: 'Server error' });
        }
      }
    });

  }
});

router.get('/check-session', (req, res) => {
  let body: User = { isAuthenticated: false }
  if (req.session.user) {
    body.isAuthenticated = true;
    body.email = req.session.user.email;
    body.username = req.session.user.username;
    body.role = req.session.user.role;
    res.status(200).json({ body });
  } else {
    res.status(200).json({ body });
  }
});

export default router;
