export interface User {
    isAuthenticated: boolean;
    email?: string;
    role?: string;
    password?: string,
    username?: string,
}



export interface Tickets {
    id: number; 
    created_at?: Date; 
    completion_date?: Date; 
    pref_date: Date; 
    updated_at?: Date; 
    status_id?: number; 
    anaylst_id?: number;
    requestor_id?: number;
    ticket_type_id?: number; 
}
export interface TicketType {
    id: number;
    name: string; 
    parent_id: number; 
}
export interface TicketStatus {
    id: number; 
    name: string; 
    status: string;    
}

export interface ApplicationTickets {
    application_name: string; 
    ticket_id: number;
}

export interface EnhanceApplicationTickets {
    description: string;
    filename: string;
    ticket_id: number; 
}
export interface NewApplicationTickets {
    description: string;
    deb_req: number; 
    languages: JSON; 
    ticket_id: number;
}
