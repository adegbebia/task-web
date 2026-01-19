import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Task from './task.js'
import User from './user.js'

export default class Collaborator extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare taskId: number

  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Relations
  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
