import {
    usersTableName,
    analystTableName,
    requestorTableName,
    requestStatusName,
    ticketsTableName,
    ticketTypesTableName,
    applicationTicketsTableName,
    enhancedApplicationTicketsTableName,
    newApplicationTicketsTableName,
    createUsersTable,
    createAnalystTable,
    createRequestorTable,
    createRequestStatusTable,
    createTicketsTable,
    createTicketTypesTable,
    createApplicationTicketsTable,
    createEnhancedApplicationTicketsTable,
    createNewApplicationTicketsTable,
    insertUser,
    insertAnalyst,
    insertRequestor,
    insertRequestStatus,
    insertTicketType,
    ticketTypeRows,
    requestStatusRows,
    saltRounds, 
  } from '../constants'
  
  import sqlite3 from 'sqlite3';
  import dotenv from 'dotenv';
  import bcrypt from 'bcrypt';
  
  dotenv.config();
  const username = process.env.ADMIN_USERNAME || 'default_admin';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'password';
  const role = 'administrator';
  
  interface CountResult {
    count: number;
  }
  
  interface DefaultInsert {
    tableName: string;
    query: string;
    insert?: string;
    db: sqlite3.Database;
    values?: any[];  // Mixed values
  }
  
  const insertDefault = ({ tableName, query, insert, db, values }: DefaultInsert) => {
    db.run(query, (err) => {
      if (err) {
        console.error(`Error creating ${tableName} table`, err.message);
        return;
      }
      console.log(`Initializing table: ${tableName}`)
      if (values && insert) {
        db.get<CountResult>(`SELECT COUNT(*) AS count FROM ${tableName}`, (err, row) => {
          if (err) {
            console.error(`Error checking ${tableName} table:`, err.message);
            return;
          }
          if (row && row.count === 0) {
            if (Array.isArray(values[0])) {
              const statement = db.prepare(insert);
              for (const valueSet of values) {
                statement.run(valueSet, (err) => {
                  if (err) {
                    console.error(`Error inserting into ${tableName}:`, err.message);
                  }
                });
              }
              statement.finalize(() => {
                console.log(`Initial row(s) inserted successfully for table ${tableName}.`);
              });
            } else {
              db.run(insert, values, (err) => {
                if (err) {
                  console.error(`Error inserting initial row(s) into ${tableName}:`, err.message);
                } else {
                  console.log(`Initial row(s) inserted successfully for table ${tableName}.`);
                }
              });
            }
          } else {
            console.log(`${tableName} table already contains data. Skipping initial insertion...`);
          }
        });
      }
    });
  }
  
  export function setupDatabase() {
    
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err.message);
        return;
      }
  
      const db = new sqlite3.Database('./database.sqlite3', (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
        } else {
          console.log('Connected to the SQLite database.');
        }
        db.run('PRAGMA foreign_keys = ON;', (err) => {
          if (err) {
            console.error('Error enabling foreign keys:', err.message);
          } else {
            console.log('Foreign key support enabled.');
          }
        });
      });
  
      const tables = [
        { tableName: usersTableName, query: createUsersTable, values: [username, hashedPassword, email, role], insert: insertUser },
        { tableName: analystTableName, query: createAnalystTable, values: [username, email], insert: insertAnalyst },
        { tableName: requestorTableName, query: createRequestorTable, values: [username, email], insert: insertRequestor },
        { tableName: requestStatusName, query: createRequestStatusTable, values: requestStatusRows, insert: insertRequestStatus },
        { tableName: ticketTypesTableName, query: createTicketTypesTable, values: ticketTypeRows, insert: insertTicketType },
        { tableName: ticketsTableName, query: createTicketsTable },
        { tableName: applicationTicketsTableName, query: createApplicationTicketsTable },
        { tableName: enhancedApplicationTicketsTableName, query: createEnhancedApplicationTicketsTable },
        { tableName: newApplicationTicketsTableName, query: createNewApplicationTicketsTable },
      ];
  
      tables.forEach(table => insertDefault({ ...table, db }));


    });
  }
  