import Region from '#models/region'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegionsController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    return view.render('admin/regions/view_regions')
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    const regions = await Region.all()
    return response.json(regions)
  }

  /**
   * Handle form submission for the create action
   */
  /**
 * Handle form submission for the create action
 */
async store({ request, response, session }: HttpContext) {
  try {
    // Récupérer les données du formulaire
    const data = request.only(['name'])

    // Vérifier si une région avec le même nom existe déjà
    const existingRegion = await Region.findBy('name', data.name)
    if (existingRegion) {
      session.flash('error', 'Une région avec ce nom existe déjà')
      return response.redirect().back()
    }

    // Créer la nouvelle région
    await Region.create(data)

    // Message de succès
    session.flash('success', 'Région ajoutée avec succès')
    
    // Rediriger vers la liste des régions
    return response.redirect().back()

  } catch (error) {
    // En cas d'erreur, afficher un message d'erreur
    console.error(error)
    session.flash('error', 'Une erreur est survenue lors de l\'ajout de la région')
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
  async edit({ params,response }: HttpContext) {
    try {
      // Récupérer l'entreprise par son ID
      const regions = await Region.find(params.id)
      
      if (!regions) {
        return response.status(404).json({
          status: 404,
          message: 'Entreprise non trouvée'
        })
      }
  
      return response.json({
        status: 200,
        regions: regions
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
      const data = request.only(['id', 'name'])
      const region = await Region.find(data.id)
  
      if (!region) {
        session.flash('error', 'Région non trouvée')
        return response.redirect().back()
      }
  
      const existingRegion = await Region.query()
        .where('name', data.name)
        .whereNot('id', data.id)
        .first()
  
      if (existingRegion) {
        session.flash('error', 'Une région avec ce nom existe déjà')
        return response.redirect().back()
      }
  
      region.name = data.name
      await region.save()
  
      session.flash('success', 'Région modifiée avec succès')
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
      const id = request.input('deleteRegion')
      const region = await Region.find(id)
  
      if (!region) {
        session.flash('error', 'Région non trouvée')
        return response.redirect().back()
      }
  
      await region.delete()
      
      session.flash('success', 'Région supprimée avec succès')
      return response.redirect().back()
  
    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}