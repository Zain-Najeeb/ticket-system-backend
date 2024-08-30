import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


const databasePath = './database.sqlite3';

async function openDatabase() {
    try {
        const db = await open({
          filename: databasePath,
          driver: sqlite3.Database
        });
        await db.run('PRAGMA foreign_keys = ON');
        return db; 
      } catch (error) {
        console.error('Error opening database:', error);
        throw error; 
      }
}
type QueryType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
async function executeQuery<T>(query: string, params: any[],  queryType: QueryType): Promise<T[]> {
    const db = await openDatabase();
    
    try {
      console.log('Executing query:', query);
      console.log('With parameters:', params);
      if (queryType == 'SELECT') {
        const rows = await db.all(query, params);
        console.log('Query results:', rows);
        return rows;
      } 
      else {
        await db.run(query, params);
        console.log('Query executed successfully');
        return []; 
      }
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    } finally {
      await db.close();
    }
  }
  

export default executeQuery;