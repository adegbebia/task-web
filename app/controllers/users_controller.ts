import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
  /** Liste des utilisateurs */
  public async index({ view, bouncer, response }: HttpContext) {
    // Vérifier l'autorisation
    if (await bouncer.with('UserPolicy').denies('viewList')) {
      return response.forbidden('Accès refusé. Vous devez être administrateur.')
    }

    const users = await User.all()
    return view.render('users/index', { users })
  }

  /** Détails d'un utilisateur et ses tâches */
  public async show({ params, view, bouncer, response }: HttpContext) {
    if (await bouncer.with('UserPolicy').denies('viewList')) {
      return response.forbidden('Accès refusé.')
    }

    const user = await User.query().where('id', params.id).preload('tasks').firstOrFail()
    return view.render('users/show', { user })
  }

  /** Formulaire de création */
  public async create({ view, bouncer, response }: HttpContext) {
    if (await bouncer.with('UserPolicy').denies('create')) {
      return response.forbidden('Accès refusé.')
    }

    return view.render('users/create')
  }

  /** Enregistrer un nouvel utilisateur avec validation */
  public async store({ request, response, session, bouncer }: HttpContext) {
    if (await bouncer.with('UserPolicy').denies('create')) {
      return response.forbidden('Accès refusé.')
    }

    try {
      const payload = await request.validateUsing(createUserValidator)
      await User.create({
        nom: payload.nom,
        email: payload.email,
        password: payload.password,
      })
      session.flash('success', 'Utilisateur créé avec succès!')
      return response.redirect('/users')
    } catch (error) {
      if (error.messages) {
        session.flashAll()
        session.flash('errors', error.messages)
        return response.redirect().back()
      }
      console.error('Erreur création utilisateur :', error)
      session.flash('error', "Erreur lors de la création de l'utilisateur")
      return response.redirect().back()
    }
  }

  /** Formulaire d'édition */
  public async edit({ params, view, bouncer, response }: HttpContext) {
    if (await bouncer.with('UserPolicy').denies('edit')) {
      return response.forbidden('Accès refusé.')
    }

    const user = await User.findOrFail(params.id)
    return view.render('users/edit', { user })
  }

  /** Mettre à jour un utilisateur avec validation */
  public async update({ params, request, response, session, bouncer }: HttpContext) {
    if (await bouncer.with('UserPolicy').denies('edit')) {
      return response.forbidden('Accès refusé.')
    }

    try {
      const user = await User.findOrFail(params.id)
      const payload = await request.validateUsing(updateUserValidator)

      user.nom = payload.nom
      user.email = payload.email

      if (payload.password && payload.password.trim() !== '') {
        user.password = payload.password
      }

      await user.save()
      session.flash('success', 'Utilisateur mis à jour avec succès!')
      return response.redirect('/users')
    } catch (error) {
      if (error.messages) {
        session.flashAll()
        session.flash('errors', error.messages)
        return response.redirect().back()
      }
      console.error('Erreur mise à jour utilisateur :', error)
      session.flash('error', "Erreur lors de la mise à jour")
      return response.redirect().back()
    }
  }

  /** Supprimer un utilisateur */
  public async destroy({ params, response, session, bouncer }: HttpContext) {
    if (await bouncer.with('UserPolicy').denies('delete')) {
      return response.forbidden('Accès refusé.')
    }

    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      session.flash('success', 'Utilisateur supprimé avec succès!')
    } catch (error) {
      console.error('Erreur suppression utilisateur :', error)
      session.flash('error', 'Impossible de supprimer cet utilisateur')
    }
    return response.redirect('/users')
  }
}
