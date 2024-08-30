import { Request, Response } from 'express';
import { getTicketTypeRowId, getStatusId } from '../helper';
import { Tickets,ApplicationTickets ,NewApplicationTickets, User} from 'global';
import { 
    newApplicationTicketsTableName,
} from '../../../constants';

interface NewApplicationTicketsRequest extends Request {
    body: {
        mainTicket: Tickets, 
        ticketType: ApplicationTickets, 
        ticket: NewApplicationTickets
        requestor: User,
    }
}

const newApp = async (req:NewApplicationTicketsRequest, res:Response) => {
    const ticektTypeId = getTicketTypeRowId('New Application'); 
    const statusRowId = getStatusId(); 
    const ticketId = insert
}

export default newApp; 