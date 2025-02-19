import type { HttpContext } from '@adonisjs/core/http'
import Departement from '#models/departement'
import Region from '#models/region'

export default class DepartementsController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    var regions = await Region.all()
    return view.render('admin/departements/view_departements', { regions: regions })
  }

  /**
   * Display form to create a new record
   */
  async create({response}: HttpContext) {
    const departements = await Departement.query()
      .preload('region')
      .exec()
       
    const departementsWithRegion = departements.map((departement) => {
      return {
        id: departement.id,
        name: departement.name,
        region_name: departement.region.name,
        region_id: departement.region_id
      }
    })

    return response.json(departementsWithRegion)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['name', 'region_id'])

      const existingDepartement = await Departement.findBy('name', data.name)
      if (existingDepartement) {
        session.flash('error', 'Un département avec ce nom existe déjà')
        return response.redirect().back()
      }

      await Departement.create(data)

      session.flash('success', 'Département ajouté avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Une erreur est survenue lors de l\'ajout du département')
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
  async edit({ params, response }: HttpContext) {
    try {
      const departement = await Departement.find(params.id)
      
      if (!departement) {
        return response.status(404).json({
          status: 404,
          message: 'Département non trouvé'
        })
      }

      return response.json({
        status: 200,
        departement: departement
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
      const data = request.only(['id', 'name', 'region_id'])
      const departement = await Departement.find(data.id)

      if (!departement) {
        session.flash('error', 'Département non trouvé')
        return response.redirect().back()
      }

      const existingDepartement = await Departement.query()
        .where('name', data.name)
        .whereNot('id', data.id)
        .first()

      if (existingDepartement) {
        session.flash('error', 'Un département avec ce nom existe déjà')
        return response.redirect().back()
      }

      departement.name = data.name
      departement.region_id = data.region_id
      await departement.save()

      session.flash('success', 'Département modifié avec succès')
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
      const id = request.input('deleteDepartement')
      const departement = await Departement.find(id)

      if (!departement) {
        session.flash('error', 'Département non trouvé')
        return response.redirect().back()
      }

      await departement.delete()
      
      session.flash('success', 'Département supprimé avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}