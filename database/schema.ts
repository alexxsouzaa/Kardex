import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
    version: 1,
    tables: [

        // ── Empresas ──────────────────────────────────────────────────────────
        tableSchema({
            name: 'companies',
            columns: [
                { name: 'remote_id',   type: 'string',  isOptional: true  },
                { name: 'name',        type: 'string'                      },
                { name: 'plan',        type: 'string'                      }, // free | pro
                { name: 'owner_id',    type: 'string'                      },
                { name: 'created_at',  type: 'number'                      },
                { name: 'updated_at',  type: 'number'                      },
                { name: 'is_deleted',  type: 'boolean', isOptional: true   },
            ],
        }),

        // ── Produtos ──────────────────────────────────────────────────────────
        tableSchema({
            name: 'products',
            columns: [
                { name: 'remote_id',   type: 'string',  isOptional: true  },
                { name: 'company_id',  type: 'string'                      },
                { name: 'name',        type: 'string'                      },
                { name: 'ean_code',    type: 'string',  isOptional: true  },
                { name: 'lote',        type: 'string',  isOptional: true  },
                { name: 'quantity',    type: 'number'                      },
                { name: 'unit',        type: 'string',  isOptional: true  },
                { name: 'packaging',   type: 'string',  isOptional: true  }, // unidade | caixa | palete
                { name: 'value',       type: 'number'                      },
                { name: 'expiry_date', type: 'string',  isOptional: true  },
                { name: 'category',    type: 'string',  isOptional: true  },
                { name: 'type',        type: 'string',  isOptional: true  },
                { name: 'brand',       type: 'string',  isOptional: true  },
                { name: 'supplier',    type: 'string',  isOptional: true  },
                { name: 'images',      type: 'string',  isOptional: true  }, // JSON array
                { name: 'created_by',  type: 'string',  isOptional: true  },
                { name: 'created_at',  type: 'number'                      },
                { name: 'updated_at',  type: 'number'                      },
                { name: 'is_deleted',  type: 'boolean', isOptional: true  },
            ],
        }),

        // ── Movimentos ────────────────────────────────────────────────────────
        tableSchema({
            name: 'movements',
            columns: [
                { name: 'remote_id',   type: 'string',  isOptional: true  },
                { name: 'company_id',  type: 'string'                      },
                { name: 'product_id',  type: 'string'                      },
                { name: 'type',        type: 'string'                      }, // in | out | adjust
                { name: 'quantity',    type: 'number'                      },
                { name: 'note',        type: 'string',  isOptional: true  },
                { name: 'created_by',  type: 'string',  isOptional: true  },
                { name: 'created_at',  type: 'number'                      },
                { name: 'is_deleted',  type: 'boolean', isOptional: true  },
            ],
        }),
    ],
});