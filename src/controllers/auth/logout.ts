import { Request, Response } from 'express';


const logout = async (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({});
        }
        res.status(200).json({})
    });
};
export default logout;
