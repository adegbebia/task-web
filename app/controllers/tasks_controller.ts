import Task from '#models/task'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { createTaskValidator, updateTaskValidator } from '#validators/task'

export default class TasksController {
  /** Liste des tâches */
  public async index({ view, auth, response }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    const user = auth.use('web').user!
    const tasks = await Task.query()
      .preload('user')
      .preload('collaborators')
      .orderBy('id', 'desc')

    return view.render('tasks/index', { tasks, user })
  }

  /** Page de création de tâche */
  public async create({ view, auth, response }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    const user = auth.use('web').user!
    const users = await User.all()

    return view.render('tasks/create', { user, users })
  }

  /** Stocker une nouvelle tâche */
  public async store({ request, response, auth, session }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    try {
      const user = auth.use('web').user!
      const payload = await request.validateUsing(createTaskValidator)

      const task = await Task.create({
        titre: payload.titre,
        description: payload.description,
        statut: payload.statut,
        userId: user.id,
      })

      if (payload.collaborators && payload.collaborators.length > 0) {
        await task.related('collaborators').attach(payload.collaborators)
      }

      session.flash('success', 'Tâche créée avec succès!')
      return response.redirect('/tasks')
    } catch (error) {
      if (error.messages) {
        session.flashAll()
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      console.error('Erreur création tâche:', error)
      session.flash('error', 'Erreur lors de la création de la tâche')
      return response.redirect().back()
    }
  }

  /** Page d'édition - VÉRIFICATION DES PERMISSIONS */
  public async edit({ params, view, auth, response, session }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    try {
      const user = auth.use('web').user!
      const task = await Task.query()
        .where('id', params.id)
        .preload('collaborators')
        .firstOrFail()

      // Vérifier si l'utilisateur peut modifier cette tâche
      const isOwner = task.userId === user.id
      const isCollaborator = task.collaborators.some(c => c.id === user.id)

      if (!isOwner && !isCollaborator) {
        session.flash('error', 'Vous n\'avez pas la permission de modifier cette tâche')
        return response.redirect('/tasks')
      }

      const users = await User.all()
      const collaboratorIds = task.collaborators.map(c => c.id)

      return view.render('tasks/edit', { task, user, users, collaboratorIds })
    } catch (error) {
      console.error('Erreur edit:', error)
      session.flash('error', 'Tâche non trouvée')
      return response.redirect('/tasks')
    }
  }

  /** Mise à jour - VÉRIFICATION DES PERMISSIONS */
  public async update({ params, request, response, auth, session }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    try {
      const user = auth.use('web').user!
      const task = await Task.query()
        .where('id', params.id)
        .preload('collaborators')
        .firstOrFail()

      // Vérifier si l'utilisateur peut modifier cette tâche
      const isOwner = task.userId === user.id
      const isCollaborator = task.collaborators.some(c => c.id === user.id)

      if (!isOwner && !isCollaborator) {
        session.flash('error', 'Vous n\'avez pas la permission de modifier cette tâche')
        return response.redirect('/tasks')
      }

      const payload = await request.validateUsing(updateTaskValidator)

      task.merge({
        titre: payload.titre,
        description: payload.description,
        statut: payload.statut,
      })
      await task.save()

      // Seul le créateur peut modifier les collaborateurs
      if (isOwner) {
        if (payload.collaborators) {
          await task.related('collaborators').sync(payload.collaborators)
        } else {
          await task.related('collaborators').sync([])
        }
      }

      session.flash('success', 'Tâche mise à jour avec succès!')
      return response.redirect('/tasks')
    } catch (error) {
      if (error.messages) {
        session.flashAll()
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      console.error('Erreur update:', error)
      session.flash('error', "Erreur lors de la mise à jour")
      return response.redirect().back()
    }
  }

  /** Suppression - VÉRIFICATION DES PERMISSIONS */
  public async destroy({ params, response, auth, session }: HttpContext) {
    if (!(await auth.use('web').check())) {
      return response.redirect('/login')
    }

    try {
      const user = auth.use('web').user!
      const task = await Task.query()
        .where('id', params.id)
        .preload('collaborators')
        .firstOrFail()

      // Vérifier si l'utilisateur peut supprimer cette tâche
      const isOwner = task.userId === user.id
      const isCollaborator = task.collaborators.some(c => c.id === user.id)

      if (!isOwner && !isCollaborator) {
        session.flash('error', 'Vous n\'avez pas la permission de supprimer cette tâche')
        return response.redirect('/tasks')
      }

      await task.delete()

      session.flash('success', 'Tâche supprimée avec succès!')
      return response.redirect('/tasks')
    } catch (error) {
      console.error('Erreur destroy:', error)
      session.flash('error', 'Tâche non trouvée')
      return response.redirect('/tasks')
    }
  }
}
