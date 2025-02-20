import type { HttpContext } from '@adonisjs/core/http'
import Dependance from '#models/dependance'
import User from '#models/user'
import Eclairage from '#models/eclairage'
import Ventilation from '#models/ventilation'
import Vertuste from '#models/vertuste'
import Anciennete from '#models/anciennete'

export default class DependancesController {
  /**
   * Display a list of resource
   */
  async index({ view }: HttpContext) {
    // Charger les relations avec leurs coefficients et mentions
    const eclairages = await Eclairage.query()
      .preload('coefficient')
      .preload('mention')
      .exec()
      
    const ventilations = await Ventilation.query()
      .preload('coefficient')
      .preload('mention')
      .exec()
      
    const vertustes = await Vertuste.query()
      .preload('coefficient')
      .preload('mention')
      .exec()
      
    const anciennetes = await Anciennete.query()
      .preload('coefficient')
      .preload('mention')
      .exec()

    return view.render('entreprise/corrigee/dependance/view_dependances', {
      eclairages,
      ventilations, 
      vertustes,
      anciennetes
    })
  }

  /**
   * Display form to create a new record
   */
  async create({ response }: HttpContext) {
    try {
      const dependances = await Dependance.query()
        .preload('eclairage', (query) => {
          query.preload('coefficient')
        })
        .preload('ventilation', (query) => {
          query.preload('coefficient')
        })
        .preload('vertuste', (query) => {
          query.preload('coefficient')
        })
        .preload('anciennete', (query) => {
          query.preload('coefficient')
        })
        .exec()

      const dependancesWithRelations = dependances.map((dependance) => {
        return {
          id: dependance.id,
          code: dependance.code,
          nature_des_dependances: dependance.nature_des_dependances,
          surface_reelle: dependance.surface_reelle,
          coef_eclairage: dependance.eclairage.coefficient.value,
          coef_ventilation: dependance.ventilation.coefficient.value,
          coefficient_moyenne: dependance.coefficient_moyenne,
          produit: dependance.produit, 
          vetuste_entretien: dependance.vertuste.coefficient.value,
          coef_anciennete: dependance.anciennete.coefficient.value,
          surface_corrigee: dependance.surface_corrigee
        }
      })

      return response.json(dependancesWithRelations)
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        status: 500,
        message: "Erreur lors du chargement des dépendances"
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session, auth }: HttpContext) {
    try {
      const data = request.only([
        'nature_des_dependances',
        'surface_reelle',
        'coefficient_eclairement_id', 
        'coefficient_ventilation_id',
        'coefficient_vetuste_id',
        'coefficient_anciennete_id'
      ])

      // Récupérer les coefficients réels depuis la base de données avec leurs valeurs
      const [eclairage, ventilation, vetuste, anciennete] = await Promise.all([
        Eclairage.query()
          .where('id', data.coefficient_eclairement_id)
          .preload('coefficient')
          .firstOrFail(),
        Ventilation.query()
          .where('id', data.coefficient_ventilation_id)
          .preload('coefficient')
          .firstOrFail(),
        Vertuste.query()
          .where('id', data.coefficient_vetuste_id)
          .preload('coefficient')
          .firstOrFail(),
        Anciennete.query()
          .where('id', data.coefficient_anciennete_id)
          .preload('coefficient')
          .firstOrFail()
      ])

      // Calculs avec les valeurs réelles des coefficients
      const surface_reelle = parseFloat(data.surface_reelle)
      const coefficient_moyenne = eclairage.coefficient.value * ventilation.coefficient.value
      const produit = coefficient_moyenne * surface_reelle
      const surface_corrigee = produit * vetuste.coefficient.value * anciennete.coefficient.value

      // Préparer l'objet complet pour la création
      const dependanceData = {
        ...data,
        user_id: auth.user!.id,
        code: session.get('currentDossierCode'),
        coefficient_moyenne: parseFloat(coefficient_moyenne.toFixed(2)),
        produit: parseFloat(produit.toFixed(2)),
        surface_corrigee: parseFloat(surface_corrigee.toFixed(2))
      }

      // Créer la dépendance avec toutes les données
      await Dependance.create(dependanceData)

      session.flash('success', 'Dépendance ajoutée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Une erreur est survenue lors de l\'ajout')
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
      const dependance = await Dependance.find(params.id)
      
      if (!dependance) {
        return response.status(404).json({
          status: 404,
          message: 'Dépendance non trouvée'
        })
      }

      return response.json({
        status: 200,
        dependance
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
      const data = request.only([
        'id',
        'nature_des_dependances',
        'surface_reelle',
        'coefficient_eclairement_id',
        'coefficient_ventilation_id',
        'coefficient_vetuste_id',
        'coefficient_anciennete_id'
      ])

      const dependance = await Dependance.find(data.id)

      if (!dependance) {
        session.flash('error', 'Dépendance non trouvée')
        return response.redirect().back()
      }

      // Récupérer les coefficients réels depuis la base de données
      const [eclairage, ventilation, vetuste, anciennete] = await Promise.all([
        Eclairage.query()
          .where('id', data.coefficient_eclairement_id)
          .preload('coefficient')
          .firstOrFail(),
        Ventilation.query()
          .where('id', data.coefficient_ventilation_id)
          .preload('coefficient')
          .firstOrFail(),
        Vertuste.query()
          .where('id', data.coefficient_vetuste_id)
          .preload('coefficient')
          .firstOrFail(),
        Anciennete.query()
          .where('id', data.coefficient_anciennete_id)
          .preload('coefficient')
          .firstOrFail()
      ])

      // Calculs avec les valeurs réelles des coefficients
      const surface_reelle = parseFloat(data.surface_reelle)
      const coefficient_moyenne = eclairage.coefficient.value * ventilation.coefficient.value
      const produit = coefficient_moyenne * surface_reelle
      const surface_corrigee = produit * vetuste.coefficient.value * anciennete.coefficient.value

      // Préparer l'objet complet pour la mise à jour
      const updateData = {
        ...data,
        coefficient_moyenne: parseFloat(coefficient_moyenne.toFixed(2)),
        produit: parseFloat(produit.toFixed(2)), 
        surface_corrigee: parseFloat(surface_corrigee.toFixed(2))
      }

      // Mettre à jour la dépendance
      await dependance.merge(updateData).save()

      session.flash('success', 'Dépendance modifiée avec succès')
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
      const id = request.input('deleteDependance')
      const dependance = await Dependance.find(id)

      if (!dependance) {
        session.flash('error', 'Dépendance non trouvée')
        return response.redirect().back()
      }

      await dependance.delete()
      
      session.flash('success', 'Dépendance supprimée avec succès')
      return response.redirect().back()

    } catch (error) {
      console.error(error)
      session.flash('error', 'Erreur lors de la suppression')
      return response.redirect().back()
    }
  }
}