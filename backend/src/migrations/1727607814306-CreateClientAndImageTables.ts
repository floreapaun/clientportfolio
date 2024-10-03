import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateClientAndImageTables1663675200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the `client` table
    await queryRunner.createTable(
      new Table({
        name: 'client',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'link',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
          },
        ],
      }),
      true,
    );

    // Create the `image` table
    await queryRunner.createTable(
      new Table({
        name: 'image',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'filename',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'mimetype',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'client_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create the foreign key for `client_id` in the `image` table
    await queryRunner.createForeignKey(
      'image',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'client',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key for `client_id`
    const table = await queryRunner.getTable('image');
    const foreignKey = table.foreignKeys.find(
      fk => fk.columnNames.indexOf('client_id') !== -1,
    );
    await queryRunner.dropForeignKey('image', foreignKey);

    // Drop the `image` table
    await queryRunner.dropTable('image');

    // Drop the `client` table
    await queryRunner.dropTable('client');
  }
}
