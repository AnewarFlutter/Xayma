import InfoEntreprise from '#models/info_entreprise';

import app from '@adonisjs/core/services/app'

import type { HttpContext } from '@adonisjs/core/http'

import { schema, validator ,rules} from '@adonisjs/validator'



export default class NvdemandesController {
  /**
   * Display a list of resource
   */
  
  async index({view, auth,response}: HttpContext) {
    const activeNouvelleDemande = true;
    const user = auth.user!
    
    // Ajouter preload pour charger les relations
    const infoEntreprise = await InfoEntreprise.query()
      .where('id_user', user.id.toString())
      .where('demande', 0)
      .preload('formeJuridique')  // Charger la relation forme juridique
      .preload('domaineActivite') // Charger la relation domaine d'activité
      .orderBy('created_at', 'desc')
      .first()

       
        // Si pas d'infos, rediriger vers la première étape
        if (!infoEntreprise || infoEntreprise.demande != 0) {
          return response.redirect().toRoute('entreprise.informations')
        }
  
    return view.render('entreprise/nouvelle_demande/recapitulatif_info', {
      activeNouvelleDemande, 
      infoEntreprise
    });
  }



  //================================================================================================





  //================================================================================================




  

   
  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ response, session, auth }: HttpContext) {
    try {
      const user = auth.user!
      
      // Mettre à jour le statut de la demande
      await InfoEntreprise.query()
        .where('id_user', user.id.toString())
        .where('demande', 0)
        .orderBy('created_at', 'desc')
        .first()
        .then((infoEntreprise) => {
          if (infoEntreprise) {
            infoEntreprise.merge({
              demande: 1 // Marquer comme soumise
            })
            return infoEntreprise.save()
          }
        })
  
      session.flash('success', 'Votre demande a été soumise avec succès')
      return response.redirect().toRoute('entreprise.informations')
  
    } catch (error) {
      console.error(error)
      session.flash('errors', {
        error: "Une erreur est survenue lors de la soumission de la demande"
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
  async update({ }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}