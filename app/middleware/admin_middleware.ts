import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    console.log('=== ADMIN MIDDLEWARE ===')

    const isAuthenticated = await ctx.auth.use('web').check()
    console.log('Est authentifié:', isAuthenticated)

    if (!isAuthenticated) {
      console.log('❌ Non authentifié - redirection vers /login')
      return ctx.response.redirect('/login')
    }

    const user = ctx.auth.use('web').user
    console.log('User chargé:', user ? { id: user.id, email: user.email, role: user.role } : 'NULL')

    if (!user || user.role !== 'admin') {
      console.log('❌ Accès refusé - rôle:', user?.role)
      ctx.session.flash('error', 'Accès refusé. Vous devez être administrateur.')
      return ctx.response.redirect('/tasks')
    }

    console.log('✅ Accès autorisé - utilisateur admin')
    await next()
  }
}
