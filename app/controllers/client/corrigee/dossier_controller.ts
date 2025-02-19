import type { HttpContext } from '@adonisjs/core/http'
import DossierSurfaceCorrigee from '#models/dossier_surface_corrigee'


export default class DossierController {
  /**
   * Display a list of resource
   */
  async index({view,request,session}: HttpContext) {
    var activeNouvelleDemande = true;
         // Stocker l'URL courante dans la session
  session.put('previousUrls', request.url())
    const dossiers = await DossierSurfaceCorrigee.query()
      .preload('user')
      .orderBy('created_at', 'desc')
      .exec()
  
  

    return view.render('entreprise/corrigee/dossiers/view_dossiers', { dossiers, activeNouvelleDemande })
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session, auth }: HttpContext) {
    try {
      // Créer un objet avec le type correct incluant toutes les propriétés nécessaires
      interface DossierData {
        nom: string
        code: string
        user_id: number
      }

      // Initialiser l'objet avec les données du formulaire
      const data: Partial<DossierData> = {
        nom: request.input('nom')
      }
      
      // Générer un code unique
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      
      // Compter le nombre de dossiers créés aujourd'hui
      const todayDossiers = await DossierSurfaceCorrigee.query()
        .whereRaw('DATE(created_at) = CURRENT_DATE')
        .count('* as total')
      
      const count = Number(todayDossiers[0].$extras.total) + 1
      const sequence = String(count).padStart(3, '0')
      
      // Ajouter le code et l'id utilisateur à l'objet data
      data.code = `${year}${month}${day}-${sequence}`
      data.user_id = auth.user!.id

      // Créer le dossier avec les données complètes
      await DossierSurfaceCorrigee.create(data)

      session.flash('success', 'Dossier créé avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Une erreur est survenue lors de la création du dossier')
      return response.redirect().back()
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response, view, session, auth, request }: HttpContext) {
    try {
      const dossier = await DossierSurfaceCorrigee.find(params.id)
      
      if (!dossier) {
        session.flash('error', 'Dossier non trouvé')
        return response.redirect().back()
      }

      // Vérifier si le dossier appartient à l'utilisateur connecté
      if (dossier.user_id !== auth.user!.id) {
        session.flash('error', 'Vous n\'avez pas accès à ce dossier')
        return response.redirect().back()
      }

      // Stocker le code du dossier en session
      session.put('currentDossierCode', dossier.code)
      
      // Stocker l'URL précédente dans la session
      session.put('previousUrl', request.url())

      await dossier.load('user')

      return view.render('entreprise/corrigee/menu/menu', {
        dossier
      })

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors du chargement du dossier')
      return response.redirect().back()
    }

  }

  async retour({ response, session }: HttpContext) {
    try {
      // Récupérer l'URL précédente depuis la session
      const previousUrls = session.get('previousUrls')
      
      // Si une URL précédente existe, rediriger vers celle-ci
      if (previousUrls) {
        // Supprimer l'URL de la session après utilisation
        session.forget('previousUrls')
        return response.redirect(previousUrls)
      } 
      
      // Sinon rediriger en arrière
      return response.redirect().back()
  
    } catch (error) {
      console.error(error)
      return response.redirect().back()
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params, response }: HttpContext) {
    try {
      const dossier = await DossierSurfaceCorrigee.find(params.id)
      
      if (!dossier) {
        return response.status(404).json({
          status: 404,
          message: 'Dossier non trouvé'
        })
      }

      return response.json({
        status: 200,
        dossier
      })

    } catch (error) {
      console.error('Erreur lors de la récupération:', error)
      return response.status(500).json({
        status: 500,
        message: 'Erreur lors de la récupération des informations'
      })
    }
  }
                 
                 
  //const dossierCode = session.get('currentDossierCode')

  /**
   * Handle form submission for the edit action
   */
  
  async update({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['id', 'code', 'nom'])
      const dossier = await DossierSurfaceCorrigee.find(data.id)

      if (!dossier) {
        session.flash('error', 'Dossier non trouvé')
        return response.redirect().back()
      }

      const existingDossier = await DossierSurfaceCorrigee.query()
        .where('code', data.code)
        .whereNot('id', data.id)
        .first()

      if (existingDossier) {
        session.flash('error', 'Un dossier avec ce code existe déjà')
        return response.redirect().back()
      }

      dossier.code = data.code
      dossier.nom = data.nom
      await dossier.save()

      session.flash('success', 'Dossier modifié avec succès')
      return response.redirect().back()
    }
       catch (error) {

          console.error(error)
          session.flash('error', 'Erreur lors de la modification')

      return response.redirect().back()
    }
  }

  /**
   * Delete record
   */

  async destroy({ request, response, session }: HttpContext) {
    try {
      const id = request.input('deleteDossier')
      const dossier = await DossierSurfaceCorrigee.find(id)

      if (!dossier) {
        session.flash('error', 'Dossier non trouvé')
        return response.redirect().back()
      }

      await dossier.delete()
      
      session.flash('success', 'Dossier supprimé avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }

}