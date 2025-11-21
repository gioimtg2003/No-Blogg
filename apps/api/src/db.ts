import { AppDataSource } from './data-source';

export const getRepository = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return AppDataSource;
};

export default AppDataSource;
