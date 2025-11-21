import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Tenant } from './entities/Tenant';
import { User } from './entities/User';
import { Post } from './entities/Post';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, // Never use true in production
  logging: process.env.NODE_ENV === 'development',
  entities: [Tenant, User, Post],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  subscribers: [],
});

// Initialize connection
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('📊 Database connection established');
    }
    return AppDataSource;
  } catch (error) {
    console.error('❌ Error during Data Source initialization:', error);
    throw error;
  }
};
