import { DataSourceOptions, DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { AnnualFormActivity } from './annual-form/annual-form.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Profile, AnnualFormActivity],
  synchronize: true,
  extra: {
    ssl:
      process.env.SSL_MODE === 'require'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
};

export const appDataSource = new DataSource(dataSourceOptions);
