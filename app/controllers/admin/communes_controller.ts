import Commune from '#models/commune'
import Departement from '#models/departement'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommunesController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    var departements = await Departement.all()
    return view.render('admin/communes/view_communes', { departements: departements })
  }

  /**
   * Display form to create a new record
   */
 // Dans CommunesController.ts

/**
 * Display form to create a new record
 */
async create({response}: HttpContext) {
  // Charger les communes avec leurs départements associés
  const communes = await Commune.query()
    .preload('departement') // Charge la relation departement
    .exec()
       
  // Transformer les données pour inclure le nom du département
  const communesWithDepartement = communes.map((commune) => {
    return {
      id: commune.id,
      name: commune.name,
      departement_name: commune.departement.name, // Accès au nom du département
      departement_id: commune.departement_id
    }
  })

  //console.log(communesWithDepartement)

  return response.json(communesWithDepartement)
}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      // Récupérer les données du formulaire
      const data = request.only(['name', 'departement_id'])

      // Vérifier si une commune avec le même nom existe déjà
      const existingCommune = await Commune.findBy('name', data.name)
      if (existingCommune) {
        session.flash('error', 'Une commune avec ce nom existe déjà')
        return response.redirect().back()
      }

      // Créer la nouvelle commune
      await Commune.create(data)

      // Message de succès
      session.flash('success', 'Commune ajoutée avec succès')
      
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Une erreur est survenue lors de l\'ajout de la commune')
      return response.redirect().back()
    }
  }

  /**
   * Edit individual record
   */
  async edit({ params, response }: HttpContext) {
    try {
      const commune = await Commune.find(params.id)
      
      if (!commune) {
        return response.status(404).json({
          status: 404,
          message: 'Commune non trouvée'
        })
      }

      return response.json({
        status: 200,
        commune: commune
      })

    } catch (error) {
      console.error('Erreur lors de la récupération:', error) 
      return response.status(500).json({
        status: 500,
        message: 'Erreur lors de la récupération des informations'
      })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['id', 'name', 'departement_id'])
      const commune = await Commune.find(data.id)

      if (!commune) {
        session.flash('error', 'Commune non trouvée')
        return response.redirect().back()
      }

      const existingCommune = await Commune.query()
        .where('name', data.name)
        .whereNot('id', data.id)
        .first()

      if (existingCommune) {
        session.flash('error', 'Une commune avec ce nom existe déjà')
        return response.redirect().back()
      }

      commune.name = data.name
      commune.departement_id = data.departement_id
      await commune.save()

      session.flash('success', 'Commune modifiée avec succès')
      return response.redirect().back()

    } catch (error) {
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
      const id = request.input('deleteCommune')
      const commune = await Commune.find(id)

      if (!commune) {
        session.flash('error', 'Commune non trouvée')
        return response.redirect().back()
      }

      await commune.delete()
      
      session.flash('success', 'Commune supprimée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}