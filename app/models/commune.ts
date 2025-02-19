import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Departement from './departement.js'
import Ville from './ville.js'

export default class Commune extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare departement_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Departement, {
    foreignKey: 'departement_id' // Spécifier le nom exact de la clé étrangère
  })
  declare departement: BelongsTo<typeof Departement>

  @hasMany(() => Ville)
  declare villes: HasMany<typeof Ville>
}