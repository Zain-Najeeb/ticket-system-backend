import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { databasePath } from '../constants'
type QueryType = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';

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

async function executeQuery<T>(query: string, params: any[],  queryType: QueryType): Promise<T[]> {
    const db = await openDatabase();
    
    try {
      console.log('Executing query:', query);
      console.log('With parameters:', params);
      if (queryType == 'SELECT') {
        const rows = await db.all(query, params);
        console.log('Query results:', rows);
        return rows as T[];
      } 
      else {
        const result = await db.run(query, params);
        console.log('Query executed successfully');
        if (queryType === 'INSERT') {
          const newRows = await db.all('SELECT * FROM your_table_name WHERE id = ?', [result.lastID]);
          return newRows as T[];
        }
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