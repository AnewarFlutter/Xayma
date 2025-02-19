import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Ventilation from './ventilation.js'
import Vertuste from './vertuste.js'
import Anciennete from './anciennete.js'
import Eclairage from './eclairage.js'

export default class Mention extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Ventilation)
  declare ventilations: HasMany<typeof Ventilation>

  @hasMany(() => Vertuste) 
  declare vertustes: HasMany<typeof Vertuste>

  @hasMany(() => Anciennete)
  declare anciennetes: HasMany<typeof Anciennete>

  @hasMany(() => Eclairage)
  declare eclairages: HasMany<typeof Eclairage>
}
