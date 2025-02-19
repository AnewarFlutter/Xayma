import type { HttpContext } from '@adonisjs/core/http'
import LocalisationAdministrative from '#models/localisation_administratives'
import Region from '#models/region'
import Departement from '#models/departement'
import Commune from '#models/commune'
import Secteur from '#models/secteur'
import Ville from '#models/ville'

export default class LocalisationAdministrativeController {
  async index({ view, session, auth }: HttpContext) {
    const dossierCode = session.get('currentDossierCode')
    //console.log('Code du dossier:', dossierCode)
    
    const localisationDonnee = await LocalisationAdministrative.query()
      .where('code', dossierCode) // Décommenter ce filtre
      .preload('region')    
      .preload('departement')  
      .preload('commune')   
      .preload('ville')
      .preload('secteur')   
      .preload('user')      
      .exec()
      
    const localisationsFormatted = localisationDonnee.map((loc) => {
      return {
        id: loc.id,
        code: loc.code,
        code_agent: loc.code_agent,
        user_name: loc.user.name,
        region_name: loc.region.name,
        departement_name: loc.departement.name,
        commune_name: loc.commune.name, 
        ville_name: loc.ville.name,
        secteur_name: loc.secteur.name,
        // Formater la date
        createdAt: loc.createdAt.toFormat('dd/MM/yyyy HH:mm'),
        updatedAt: loc.updatedAt.toFormat('dd/MM/yyyy HH:mm')
      }
    })

    
  
   // console.log('Données filtrées:', localisationsFormatted)
    return view.render('entreprise/corrigee/locAdministrative/administration', { 
      localisation: localisationsFormatted.length > 0 ? localisationsFormatted[0] : null // Récupérer la première localisation trouvée ou null
    })
  }

  async retour({ response, session }: HttpContext) {
    try {
      // Récupérer l'URL précédente depuis la session
      const previousUrl = session.get('previousUrl')
      
      // Si une URL précédente existe, rediriger vers celle-ci
      if (previousUrl) {
        // Supprimer l'URL de la session après utilisation
        session.forget('previousUrl')
        return response.redirect(previousUrl)
      } 
      
      // Sinon rediriger en arrière
      return response.redirect().back()
  
    } catch (error) {
      console.error(error)
      return response.redirect().back()
    }
  }

  async store({ request, response, session, auth }: HttpContext) {
    try {
      const dossierCode = session.get('currentDossierCode')

      // Vérifier si une localisation existe déjà pour ce code et cet utilisateur
      const existingLoc = await LocalisationAdministrative.query()
        .where('code', dossierCode)
        .where('user_id', auth.user!.id)
        .first()

      if (existingLoc) {
        session.flash('error', 'Une localisation existe déjà pour ce dossier')
        return response.redirect().back()
      }

      // Valider les données avant création
      if (!request.input('region_id') || !request.input('departement_id') || 
          !request.input('commune_id') || !request.input('secteur_id')) {
        session.flash('error', 'Tous les champs sont obligatoires')
        return response.redirect().back()
      }

      // Générer automatiquement le code agent
     
      // Créer la nouvelle localisation
      const data = {
        code: dossierCode,
        code_agent: request.input('code_agent'), // Code agent généré automatiquement
        user_id: auth.user!.id,
        region_id: request.input('region_id'),
        departement_id: request.input('departement_id'),
        commune_id: request.input('commune_id'),
        ville_id: request.input('ville_id'),
        secteur_id: request.input('secteur_id')
      }

      await LocalisationAdministrative.create(data)

      session.flash('success', 'Localisation enregistrée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de l\'enregistrement')
      return response.redirect().back()
    }
  }

  async show({ params, response, session, auth }: HttpContext) {
    try {
      const localisation = await LocalisationAdministrative.find(params.id)
      
      if (!localisation) {
        session.flash('error', 'Localisation non trouvée')
        return response.redirect().back()
      }

      if (localisation.user_id !== auth.user!.id) {
        session.flash('error', 'Vous n\'avez pas accès à cette localisation')
        return response.redirect().back()
      }

      await localisation.load((loader) => {
        loader.load('region')
        loader.load('departement')
        loader.load('commune')
        loader.load('ville')
        loader.load('secteur')
      })

      return response.json(localisation)

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors du chargement')
      return response.redirect().back()
    }
  }

  async update({ request, response, session }: HttpContext) {
    try {
      // Récupérer l'ID depuis le formulaire
      const id = request.input('id')
      const localisation = await LocalisationAdministrative.find(id)

      if (!localisation) {
        session.flash('error', 'Localisation non trouvée')
        return response.redirect().back()
      }

      // Mise à jour des données
      const data = {
        region_id: request.input('region_id'),
        departement_id: request.input('departement_id'),
        commune_id: request.input('commune_id'),
        ville_id: request.input('ville_id'),
        secteur_id: request.input('secteur_id'),
        code_agent: request.input('code_agent')
      }

      await localisation.merge(data).save()

      session.flash('success', 'Localisation mise à jour avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la modification')
      return response.redirect().back()
    }
  }

  async destroy({ response, session }: HttpContext) {
    try {
      const dossierCode = session.get('currentDossierCode')
      const localisation = await LocalisationAdministrative.query()
        .where('code', dossierCode)
        .first()

      if (!localisation) {
        session.flash('error', 'Localisation non trouvée')
        return response.redirect().back()
      }

      await localisation.delete()
      
      session.flash('success', 'Localisation supprimée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }

  async getDepartements({ params, response }: HttpContext) {
    try {
      const regionId = params.regionId
      const departements = await Departement.query()
        .where('region_id', regionId)
        .exec()
      
      return response.json(departements)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Erreur lors de la récupération des départements'
      })
    }
  }

  async getCommunes({ params, response }: HttpContext) {
    try {
      const departementId = params.departementId
      const communes = await Commune.query()
        .where('departement_id', departementId)
        .exec()
      
      return response.json(communes)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Erreur lors de la récupération des communes'
      })
    }
  }
  async getCurrentLocalisation({ response, session }: HttpContext) {
    try {
      const dossierCode = session.get('currentDossierCode')
      const localisation = await LocalisationAdministrative.query()
        .where('code', dossierCode)
        .preload('region')
        .preload('departement')
        .preload('commune')
        .preload('ville')
        .preload('secteur')
        .first()
  
      if (!localisation) {
        return response.status(404).json({
          message: 'Localisation non trouvée'
        })
      }
  
      return response.json({
        id: localisation.id,
        code: localisation.code,
        code_agent: localisation.code_agent,
        region_id: localisation.region_id,
        departement_id: localisation.departement_id,
        commune_id: localisation.commune_id,
        ville_id: localisation.ville_id,
        secteur_id: localisation.secteur_id,
        region_name: localisation.region.name,
        departement_name: localisation.departement.name,
        commune_name: localisation.commune.name,
        ville_name: localisation.ville.name,
        secteur_name: localisation.secteur.name
      })
  
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Erreur lors de la récupération de la localisation'
      })
    }
  }
  async getVilles({ params, response }: HttpContext) {
    try {
      const communeId = params.communeId
      const villes = await Ville.query()
        .where('commune_id', communeId)
        .exec()
      
      return response.json(villes)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Erreur lors de la récupération des villes'
      })
    }
  }

  async getSecteurs({ params, response }: HttpContext) {
    try {
      const villeId = params.villeId
      const secteurs = await Secteur.query()
        .where('ville_id', villeId)
        .exec()
      
      return response.json(secteurs)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Erreur lors de la récupération des secteurs'
      })
    }
  }

  async getRegions({ response }: HttpContext) {
    try {
      const regions = await Region.query()
        .orderBy('name', 'asc')
        .exec()
      
      return response.json(regions)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Erreur lors de la récupération des régions'
      })
    }
  }
}