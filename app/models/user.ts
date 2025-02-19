import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import DossierSurfaceCorrigee from './dossier_surface_corrigee.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column() 
  declare name: string

  @column()
  declare full_name: string 

  @column()
  declare email: string

  @column.dateTime()
  declare email_verified_at: DateTime | null

  @column()
  declare role: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare remember_me_token: string | null

  @column() 
  declare otp: string | null

  @column.dateTime()
  declare otp_expires_at: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  // Relations
  @hasMany(() => DossierSurfaceCorrigee)
  declare dossiers: HasMany<typeof DossierSurfaceCorrigee>
}