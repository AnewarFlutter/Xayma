// app/middleware/admin_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import InfoEntreprise from '#models/info_entreprise'

export default class RenouvellementMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Récupérer l'utilisateur authentifié
    const user = ctx.auth.user!
    
    try {
      // Vérifier si l'entreprise existe
      const infoEntreprise = await InfoEntreprise.query()
        .where('id_user', user.id.toString())
        .where('demande', 0)
        .orderBy('created_at', 'desc')
        .first()

      // Si pas d'entreprise ou renouvellement = 1, rediriger
      if (!infoEntreprise || infoEntreprise.demande === 1) {
        return ctx.response.redirect().toRoute('entreprise.informations')
      }

      // Appeler next() pour continuer vers la prochaine middleware/route
      return next()

    } catch (error) {
      console.error('Erreur middleware demande:', error)
      return ctx.response.redirect().toRoute('entreprise.informations') 
    }
  }
}