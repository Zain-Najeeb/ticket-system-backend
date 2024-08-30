export const usersTableName = 'users';
export const analystTableName = 'analyst';
export const requestorTableName = 'requestors';
export const requestStatusName = 'requestStatus';
export const ticketsTableName = 'tickets';
export const ticketTypesTableName = 'ticket_types';
export const applicationTicketsTableName = 'application_tickets';
export const enhancedApplicationTicketsTableName = 'enhanced_application_tickets';
export const newApplicationTicketsTableName = 'new_application_tickets';

export const createUsersTable = `
CREATE TABLE IF NOT EXISTS ${usersTableName} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

export const createAnalystTable = `
CREATE TABLE IF NOT EXISTS ${analystTableName} (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  username TEXT NOT NULL, 
  email TEXT NOT NULL
);`; 

export const createRequestorTable = `
CREATE TABLE IF NOT EXISTS ${requestorTableName} (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  username TEXT NOT NULL, 
  email TEXT NOT NULL
);`; 

export const createRequestStatusTable = `
CREATE TABLE IF NOT EXISTS ${requestStatusName} (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  name TEXT NOT NULL, 
  status INTEGER NOT NULL
);`;

export const createTicketsTable = `
CREATE TABLE IF NOT EXISTS ${ticketsTableName} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completion_date DATETIME, 
  pref_date DATETIME NOT NULL, 
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status_id INTEGER NOT NULL,
  analyst_id INTEGER NOT NULL,
  requestor_id INTEGER NOT NULL,
  ticket_type_id INTEGER NOT NULL,
  FOREIGN KEY (status_id) REFERENCES ${requestStatusName}(id),
  FOREIGN KEY (analyst_id) REFERENCES ${analystTableName}(id),
  FOREIGN KEY (requestor_id) REFERENCES ${requestorTableName}(id),
  FOREIGN KEY (ticket_type_id) REFERENCES ${ticketTypesTableName}(id)
);`;

export const createTicketTypesTable = `
CREATE TABLE IF NOT EXISTS ${ticketTypesTableName} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parent_id INTEGER,
  FOREIGN KEY (parent_id) REFERENCES ${ticketTypesTableName}(id)
);`;

export const createApplicationTicketsTable = `
CREATE TABLE IF NOT EXISTS ${applicationTicketsTableName} (
  ticket_id INTEGER PRIMARY KEY,
  application_name TEXT NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES ${ticketsTableName}(id)
);`;

export const createEnhancedApplicationTicketsTable = `
CREATE TABLE IF NOT EXISTS ${enhancedApplicationTicketsTableName} (
  ticket_id INTEGER PRIMARY KEY,
  filename TEXT NOT NULL,
  file_size INTEGER,
  description TEXT NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES ${applicationTicketsTableName}(ticket_id)
);`;

export const createNewApplicationTicketsTable = `
CREATE TABLE IF NOT EXISTS ${newApplicationTicketsTableName} (
  ticket_id INTEGER PRIMARY KEY,
  description TEXT NOT NULL,
  deb_req INTEGER NOT NULL, 
  title TEXT NOT NULL, 
  languages TEXT,
  FOREIGN KEY (ticket_id) REFERENCES ${applicationTicketsTableName}(ticket_id)
);`;

export const insertUser = `
INSERT INTO ${usersTableName} (username, password_hash, email, role)
VALUES (?, ?, ?, ?);`;

export const insertAnalyst = `
INSERT INTO ${analystTableName} (username, email)
VALUES (?, ?);`;

export const insertRequestor = `
INSERT INTO ${requestorTableName} (username, email)
VALUES (?, ?);`;

export const insertRequestStatus = `
INSERT INTO ${requestStatusName} (name, status)
VALUES (?, ?);`;

export const insertTicketType = `
INSERT INTO ${ticketTypesTableName} (name, parent_id)
VALUES (?, ?);`;

export const requestStatusRows = [
  ['On Hold', 1],
  ['In Progress', 1],
  ['Submitted', 0],
  ['Assigned', 1],
  ['Completed', 0],
  ['Cancelled', 0],
];

export const ticketTypeRows = [
    ['Application', null],
    ['Enhance Application', 1],
    ['New Application', 1]
];

export const saltRounds = 10; 

export interface User {
    isAuthenticated: boolean;
    email?: string;
    role?: string;
    password?: string,
    username?: string,
  }
  