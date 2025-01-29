import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('email_verified_at').nullable()
      table.string('role').notNullable()
      table.string('password').notNullable()
      table.string('remember_me_token').nullable()
      table.string('otp').nullable()
      table.string('otp_expires_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}