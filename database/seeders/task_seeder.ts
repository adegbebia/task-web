import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Task from '#models/task'
import User from '#models/user'

export default class TaskSeeder extends BaseSeeder {
  async run() {
    const user1 = await User.findBy('email', 'traoredegbebia@gmail.com')
    const user2 = await User.findBy('email', 'admin@ifnti.tg')

    if (!user1 || !user2) {
      console.log('Users not found, skipping task seeding')
      return
    }

    await Task.createMany([
      {
        titre: 'Préparer le rapport Django',
        description: 'Rédiger le rapport du TP sur les templates Latex',
        statut: 'en cours',
        userId: user1.id,
      },
      {
        titre: 'Réviser pour l examen',
        description: 'Relire les chapitres 1 à 5 du cours de base de données',
        statut: 'en cours',
        userId: user2.id,
      },
    ])
  }
}
