import {Tickets, TicketType, TicketStatus, User } from "global";
import {ticketsTableName,ticketTypesTableName, ticketStatusName, usersTableName} from "../../constants"
import runQuery from '../../database/query';
export const getTicketTypeRowId = async (name: string) => {
    const query = `SELECT id FROM ${ticketTypesTableName} WHERE name = ?`
    const row = await runQuery<TicketType>(query, [name], 'SELECT') 
    return row[0].id; 
}
export const getStatusId = async (name='Submitted') => {
    const query = `SELECT id FROM ${ticketStatusName} WHERE name = ?`
    const row = await runQuery<TicketStatus>(query, [name], 'SELECT') 
    return row[0].id; 
}
export const getRequestor = async (user:User) => {
    const query = `SELECT id FROM ${usersTableName} WHERE name = ?`
    const row =  await runQuery<TicketStatus>(query, [user.username], 'SELECT'); 
    if (row.length !== 0) {
        return row[0].id
    }
    
}
export const insertTicket = async (mainTicket:Tickets ) => {
    const query = 
    `INSERT INTO ${ticketsTableName} (completion_date, pref_date, status_id, analyst_id, requestor_id, ticket_type_id)
    VALUES (?, ?, ?, ?, ?, ?)`; 
    const params = [ mainTicket. ]
    const row = await runQuery<Tickets>(query, )
}

