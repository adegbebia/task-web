import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titre: string

  @column()
  declare description: string

  @column()
  declare statut: string

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relation avec l'utilisateur propriétaire
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Relation many-to-many avec les collaborateurs
  @manyToMany(() => User, {
    pivotTable: 'collaborators',
    localKey: 'id',
    pivotForeignKey: 'task_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare collaborators: ManyToMany<typeof User>
}
