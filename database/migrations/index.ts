import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

// Adicione novas migrações aqui quando o schema mudar
// Exemplo:
// createTable({ name: 'nova_tabela', columns: [...] })
// addColumns({ table: 'products', toAdd: [{ name: 'nova_coluna', type: 'string' }] })

export const migrations = schemaMigrations({
    migrations: [
        // v1 → v2 (exemplo futuro)
        // {
        //     toVersion: 2,
        //     steps: [
        //         addColumns({ table: 'products', toAdd: [{ name: 'barcode', type: 'string', isOptional: true }] }),
        //     ],
        // },
    ],
});