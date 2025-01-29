// app/middleware/user_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Vérifie si l'utilisateur est authentifié et est un utilisateur normal
    const user = ctx.auth.user
    if (user && user.role === 'user') {
      return next()
    }
    
    // Redirection si non utilisateur
    return ctx.response.redirect('/login')
  }
}