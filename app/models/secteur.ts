import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Ville from './ville.js'

export default class Secteur extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string
  
  @column()
  declare ville_id: number 

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Ville, {
    foreignKey: 'ville_id' // Spécifier le nom exact de la clé étrangère
  })

  declare ville: BelongsTo<typeof Ville>
}