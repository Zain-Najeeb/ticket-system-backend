import { Request, Response } from 'express';
import { User } from 'global';

const checkSession = async (req: Request, res: Response) => {
  let body: User = { isAuthenticated: false };
  
  if (req.session.user) {
    body.isAuthenticated = true;
    body.email = req.session.user.email;
    body.username = req.session.user.username;
    body.role = req.session.user.role;
  }

  res.status(200).json({ body });
};

export default checkSession;
