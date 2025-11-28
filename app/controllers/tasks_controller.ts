import Task from '#models/task'
import { HttpContext } from '@adonisjs/core/http'

export default class TasksController {
  /** Liste des tâches */
  public async index({ view, auth, response }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    const user = auth.use('web').user!

    const tasks = await Task.query().where('userId', user.id).preload('user').orderBy('id', 'desc')

    return view.render('tasks/index', { tasks, user })
  }

  /** Page de création de tâche */
  public async create({ view, auth, response }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    const user = auth.use('web').user!
    return view.render('tasks/create', { user })
  }

  /** Stocker une nouvelle tâche */
  public async store({ request, response, auth, session }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    const user = auth.use('web').user!

    const taskData = request.only(['titre', 'description', 'statut'])
    const task = await Task.create({
      ...taskData,
      userId: user.id,
    })

    session.flash('success', 'Tâche créée avec succès!')
    return response.redirect('/tasks')
  }

  /** Page d’édition */
  public async edit({ params, view, auth, response, session }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    try {
      const user = auth.use('web').user!

     
      const task = await Task.query()
        .where('id', params.id)
        .andWhere('userId', user.id)
        .firstOrFail()

      console.log('TASK = ', task)

      return view.render('tasks/edit', { task, user })
    } catch (error) {
      session.flash('error', 'Tâche non trouvée')
      return response.redirect('/tasks')
    }
  }

  /** Mise à jour */
  public async update({ params, request, response, auth, session }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    try {
      const user = auth.use('web').user!

      const task = await Task.query()
        .where('id', params.id)
        .andWhere('userId', user.id)
        .firstOrFail()

      task.merge(request.only(['titre', 'description', 'statut']))
      await task.save()

      session.flash('success', 'Tâche modifiée avec succès!')
      return response.redirect('/tasks')
    } catch (error) {
      session.flash('error', 'Tâche non trouvée')
      return response.redirect('/tasks')
    }
  }

  /** Suppression d'une tâche */
  public async destroy({ params, response, auth, session }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    try {
      const user = auth.use('web').user!

      const task = await Task.query()
        .where('id', params.id)
        .andWhere('userId', user.id)
        .firstOrFail()

      await task.delete()

      session.flash('success', 'Tâche supprimée avec succès!')
      return response.redirect('/tasks')
    } catch (error) {
      session.flash('error', 'Tâche non trouvée')
      return response.redirect('/tasks')
    }
  }
}
