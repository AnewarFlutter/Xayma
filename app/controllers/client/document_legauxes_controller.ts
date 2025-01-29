import type { HttpContext } from '@adonisjs/core/http'

import domaines_activites from '#models/domaines_activites';
import forme_juridiques from '#models/forme_juridiques';
import InfoEntreprise from '#models/info_entreprise';
import { schema, validator ,rules} from '@adonisjs/validator'
import app from '@adonisjs/core/services/app';
export default class DocumentLegauxesController {
  /**
   * Display a list of resource
   */
  async index({view,auth,response}: HttpContext) {
      try {
          
          const activeNouvelleDemande = true;
          
          var formesJuridiques = await forme_juridiques.all();
          var domainesActivites = await domaines_activites.all();
        
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
      
         
          return view.render('entreprise/nouvelle_demande/document_legaux', {
            activeNouvelleDemande,
            formesJuridiques,  // Utiliser le même nom que dans la vue
            domainesActivites,
            infoEntreprise  // Utiliser le même nom que dans la vue
          });
      
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error);
          throw error;
        }
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session, auth }: HttpContext) {
    try {
      const user = auth.user!
  
      // Gérer les fichiers uploadés 
      const rccmFile = request.file('rccm_file')
      const nineaFile = request.file('ninea_file')
      const declarationFile = request.file('declaration_file')
  
      // Validation des données
      try {
        await validator.validate({
          schema: schema.create({
            forme_juridique: schema.string(),
            domaine_activite: schema.string(),
            date_adhesion: schema.date(),
            autre_domaine: schema.string.optional()
          }),
          data: request.only([
            'forme_juridique',
            'domaine_activite', 
            'date_adhesion',
            'autre_domaine'
          ])
        })
      } catch (error) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }
  
      // Déplacer les fichiers dans public/assets/uploads
      const uploadPath = 'uploads/documents'
      
      if (rccmFile) {
        await rccmFile.move(app.publicPath(uploadPath), {
          name: `rccm_${Date.now()}.${rccmFile.extname}`
        })
      }
  
      if (nineaFile) {
        await nineaFile.move(app.publicPath(uploadPath), {
          name: `ninea_${Date.now()}.${nineaFile.extname}`
        })
      }
  
      if (declarationFile) {
        await declarationFile.move(app.publicPath(uploadPath), {
          name: `declaration_${Date.now()}.${declarationFile.extname}`
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
              rccm_file: rccmFile ? `${uploadPath}/${rccmFile.fileName}` : '',
              ninea_file: nineaFile ? `${uploadPath}/${nineaFile.fileName}` : '',
              declaration_file: declarationFile ? `${uploadPath}/${declarationFile.fileName}` : '',
              forme_juridique_id: request.input('forme_juridique'),
              domaine_activite_id: request.input('domaine_activite'),
              autre_domaine: request.input('autre_domaine'),
              date_adhesion: request.input('date_adhesion')
            })
            return infoEntreprise.save()
          }
        })
  
      session.flash('success', "Les documents ont été enregistrés avec succès")
      return response.redirect().toRoute('entreprise.effectif')
  
    } catch (error) {
      console.error(error)
      session.flash('errors', {
        error: "Une erreur est survenue lors de l'enregistrement des documents"
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