import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema }     from './schema';
import { migrations } from './migrations';
import Company        from './models/Company';
import Product        from './models/Product';
import Movement       from './models/Movement';

// ─── Adapter SQLite ───────────────────────────────────────────────────────────

const adapter = new SQLiteAdapter({
    schema,
    migrations,
    dbName: 'kardex',
    jsi: false,              // usa JSI para melhor performance (react-native-quick-sqlite)
    onSetUpError: (error) => {
        console.error('WatermelonDB setup error:', error);
    },
});

// ─── Database ─────────────────────────────────────────────────────────────────

export const database = new Database({
    adapter,
    modelClasses: [
        Company,
        Product,
        Movement,
    ],
});
