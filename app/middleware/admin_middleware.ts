// app/middleware/admin_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Vérifie si l'utilisateur est authentifié et est un admin
    const user = ctx.auth.user
    if (user && user.role === 'admin') {
      return next()
    }
    
    // Redirection si non admin
    return ctx.response.redirect('/dashboard')
  }
}