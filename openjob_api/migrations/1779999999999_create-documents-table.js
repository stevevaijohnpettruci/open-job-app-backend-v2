export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('documents', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', notNull: true, references: 'users(id)', onDelete: 'CASCADE' },
    filename: { type: 'TEXT', notNull: true },
    original_name: { type: 'TEXT', notNull: true },
    size: { type: 'INTEGER', notNull: true },
    uploaded_at: { type: 'TIMESTAMP', notNull: true },
  });
};

export const down = (pgm) => {
  pgm.dropTable('documents');
};
