import type { HttpContext } from '@adonisjs/core/http'
import InfoEntreprise from '#models/info_entreprise';
import { schema, validator ,rules} from '@adonisjs/validator'
import app from '@adonisjs/core/services/app';
export default class EffectifEntreprisesController {
  /**
   * Display a list of resource
   */
  async index({view,response,auth}: HttpContext) {
    const activeNouvelleDemande = true;
    const user = auth.user!
  // Récupérer les informations avec les relations
  var infoEntreprise = await InfoEntreprise.query()
    .where('id_user', user.id.toString())
    .where('demande', 0)
    .preload('formeJuridique')
    .preload('domaineActivite')
    .first()

  // Si pas d'infos, rediriger vers la première étape
  if (!infoEntreprise || infoEntreprise.demande != 0) {
    return response.redirect().toRoute('entreprise.informations')
  }

    return view.render('entreprise/nouvelle_demande/information_effectif', {activeNouvelleDemande});
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({  request, response, session, auth }: HttpContext) {
    try {
      const user = auth.user!
  
      // Validation des données
      try {
        await validator.validate({
          schema: schema.create({
            nb_cdi: schema.number(),
            nb_cdd: schema.number(), 
            nb_stagiaires: schema.number(),
            profils_recherches: schema.string()
          }),
          data: request.only([
            'nb_cdi',
            'nb_cdd',
            'nb_stagiaires', 
            'profils_recherches'
          ])
        })
      } catch (error) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }
  
      // Vérifier que les fichiers requis sont présents
      if (!request.file('quitus_fiscal') || !request.file('quitus_social') || !request.file('carte_identite')) {
        session.flash('errors', {
          error: 'Tous les documents sont obligatoires'
        })
        return response.redirect().back()
      }

      // Gérer les fichiers uploadés 
      const quitusFiscal = request.file('quitus_fiscal')
      const quitusSocial = request.file('quitus_social')
      const carteIdentite = request.file('carte_identite')
  
      // Déplacer les fichiers dans public/assets/uploads
      const uploadPath = 'uploads/documents'
  
      if (quitusFiscal) {
        await quitusFiscal.move(app.publicPath(uploadPath), {
          name: `quitus_fiscal_${Date.now()}.${quitusFiscal.extname}`
        })
      }
  
      if (quitusSocial) {
        await quitusSocial.move(app.publicPath(uploadPath), {
          name: `quitus_social_${Date.now()}.${quitusSocial.extname}`
        })
      }
  
      if (carteIdentite) {
        await carteIdentite.move(app.publicPath(uploadPath), {
          name: `carte_identite_${Date.now()}.${carteIdentite.extname}`
        })
      }
  
      // Mettre à jour l'enregistrement avec les chemins des fichiers
      await InfoEntreprise.query()
        .where('id_user', user.id.toString())
        .where('demande', 0)
        .orderBy('created_at', 'desc')
        .first()
        .then((infoEntreprise) => {
          if (infoEntreprise) {
            infoEntreprise.merge({
              nb_cdi: request.input('nb_cdi'),
              nb_cdd: request.input('nb_cdd'),
              quitus_fiscal: quitusFiscal ? `${uploadPath}/${quitusFiscal.fileName}` : '',
              quitus_social: quitusSocial ? `${uploadPath}/${quitusSocial.fileName}` : '',
              nb_stagiaires: request.input('nb_stagiaires'),
              profils_recherches: request.input('profils_recherches'),
              carte_identite: carteIdentite ? `${uploadPath}/${carteIdentite.fileName}` : ''
            })
            return infoEntreprise.save()
          }
        }
      )

      session.flash('success', "Les informations ont été enregistrées avec succès")
      return response.redirect().toRoute('entreprise.recapitulatif')

    } catch (error) {
      console.error(error)
      session.flash('errors', {
        error: "Une erreur est survenue lors de l'enregistrement des informations"
      })
      return response.redirect().back()
    }

  }
  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}