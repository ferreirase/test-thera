import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: join(process.cwd(), 'src/config/database/db.sqlite'),
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  synchronize: true, // Set to false in production
  logging: true,
};
