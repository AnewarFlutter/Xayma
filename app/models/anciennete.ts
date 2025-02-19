import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Coefficient from './coefficient.js'
import Mention from './mention.js'

export default class Anciennete extends BaseModel {
  @column({ isPrimary: true })
   declare id: number
 
   @column()
   declare coefficient_id: number
 
   @column()
   declare mention_id: number
 
   @column.dateTime({ autoCreate: true })
   declare createdAt: DateTime
 
   @column.dateTime({ autoCreate: true, autoUpdate: true })
   declare updatedAt: DateTime
 
   @belongsTo(() => Coefficient,{
       foreignKey: 'coefficient_id'
     })
 
   declare coefficient: BelongsTo<typeof Coefficient>
 
   @belongsTo(() => Mention,{
     foreignKey: 'mention_id'
   })
   declare mention: BelongsTo<typeof Mention>
 }