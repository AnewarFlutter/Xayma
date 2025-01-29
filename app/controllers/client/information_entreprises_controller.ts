import InfoEntreprise from '#models/info_entreprise';
import type { HttpContext } from '@adonisjs/core/http'
import { schema, validator ,rules} from '@adonisjs/validator'
export default class InformationEntreprisesController {
  /**
   * Display a list of resource
   */
 async index({view, auth}: HttpContext) {
     var activeNouvelleDemande = true;
   
     // Récupérer l'utilisateur connecté 
     const user = auth.user!
   
     // Vérifier si l'utilisateur a déjà enregistré les informations de l'entreprise
     // et récupérer la dernière entrée avec demande = 0
     const infoEntreprise = await InfoEntreprise.query()
       .where('id_user', user.id.toString())
      
       .orderBy('created_at', 'desc')
       .first()
   
     return view.render('entreprise/nouvelle_demande/information_entreprise', {
       activeNouvelleDemande, 
       infoEntreprise
     })
   }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session, auth }: HttpContext) { try {
    // Récupérer l'utilisateur connecté 
    const user = auth.user!

    // Récupérer les données du formulaire
    const data = request.only([
      'code_demande', // Ajout du code_demande
      'nom_entreprise',
      'nom_representant',
      'prenom_representant', 
      'adresse',
      'email',
      'telephone'
    ])
    
    try {
      // Validation directe avec le schéma
      await validator.validate({
        schema: schema.create({
          nom_entreprise: schema.string(),
          nom_representant: schema.string(),
          prenom_representant: schema.string(),
          adresse: schema.string(),
          email: schema.string([
            rules.email()
          ]),
          telephone: schema.string([
            rules.minLength(9),
            rules.maxLength(9)
          ])
        }),
        data: data
      })
    } catch (error) {
      session.flash('errors', error.messages)
      return response.redirect().back()
    }

    // Vérifier si un code_demande existe (modification)
    if (data.code_demande) {
      // Mise à jour des informations existantes
      await InfoEntreprise.query()
        .where('code_demande', data.code_demande)
        .update({
          nom_entreprise: data.nom_entreprise,
          nom_representant: data.nom_representant,
          prenom_representant: data.prenom_representant,
          adresse: data.adresse,
          email: data.email,
          telephone: data.telephone
        })

      session.flash('success', "Les informations de l'entreprise ont été mises à jour avec succès")
    } else {
      // Création d'un nouveau code_demande pour un nouvel enregistrement
      const code_demande = `DEM-${Date.now()}`

      // Créer l'enregistrement
      await InfoEntreprise.create({
        id_user: user.id.toString(),
        code_demande: code_demande,
        nom_entreprise: data.nom_entreprise,
        nom_representant: data.nom_representant,
        prenom_representant: data.prenom_representant,
        adresse: data.adresse,
        email: data.email,
        telephone: data.telephone
      })

      session.flash('success', "Les informations de l'entreprise ont été enregistrées avec succès")
    }

    return response.redirect().toRoute('entreprise.documents_legaux')

  } catch (error) {
    console.error(error)
    session.flash('errors', {
      error: "Une erreur est survenue lors de l'enregistrement"
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
  

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}