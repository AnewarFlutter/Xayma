import InfoEntreprise from '#models/info_entreprise';
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon';

export default class ListesController {
  /**
   * Display a list of resource
   */
  async index({view}: HttpContext) {
    var activeNouvelleDemande = true;
    return view.render('admin/listes/view_listes', {activeNouvelleDemande})
  }

  /**
   * Display form to create a new record
   */
  async create({ response }: HttpContext) {
    try {
      const infoEntreprise = await InfoEntreprise.query()
        .preload('formeJuridique')
        .preload('domaineActivite')
        .orderBy('created_at', 'desc')
        .exec()

      // Transformation en camelCase
      const formattedData = infoEntreprise.map(item => ({
        id: item.id,
        idUser: item.id_user,
        codeDemande: item.code_demande,
        nomEntreprise: item.nom_entreprise, 
        nomRepresentant: item.nom_representant,
        prenomRepresentant: item.prenom_representant,
        adresse: item.adresse,
        email: item.email,
        telephone: item.telephone,
        rccmFile: item.rccm_file,
        nineaFile: item.ninea_file,
        declarationFile: item.declaration_file,
        dateAdhesion: item.date_adhesion ? item.date_adhesion.toFormat('yyyy-MM-dd'): null,
        formeJuridiqueId: item.forme_juridique_id,
        domaineActiviteId: item.domaine_activite_id,
        autreDomaine: item.autre_domaine,
        nbCdi: item.nb_cdi,
        nbCdd: item.nb_cdd,
        quitusFiscal: item.quitus_fiscal,
        quitusSocial: item.quitus_social, 
        nbStagiaires: item.nb_stagiaires,
        profilsRecherches: item.profils_recherches,
        carteIdentite: item.carte_identite,
        demande: item.demande,
        etatAcceptation: (() => {
          switch(item.demande) {
            case 1:
              return '<span class="badge bg-info">En cours</span>';
            case 2:
              return '<span class="badge bg-success">Acceptée</span>';
            case 3:
              return '<span class="badge bg-danger">Rejetée</span>'; 
            default:
              return '<span class="badge bg-secondary">Non soumise</span>';
          }
        })(),
        renouvellement: item.renouvellement,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        formeJuridique: item.formeJuridique.libelle,
        domaineActivite: item.domaineActivite.libelle
      }))
      //console.log(formattedData) 
      return response.json(formattedData)
    } catch (error) {
      console.error('Erreur:', error)
      return response.status(500).json({ error: 'Erreur lors de la récupération des informations' })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async acceptationStore({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['appointment_date', 'company_id'])
      
      // Vérifier que les champs requis sont présents 
      if (!data.appointment_date || !data.company_id) {
        session.flash('error', 'La date de rendez-vous et l\'ID de l\'entreprise sont requis')
        return response.redirect().back()
      }
  
      // Récupérer et mettre à jour l'entreprise
      const infoEntreprise = await InfoEntreprise.findOrFail(data.company_id)
  
      // Convertir la date en objet DateTime
      const appointmentDate = DateTime.fromISO(data.appointment_date).toSQL(); // YYYY-MM-DD HH:mm:ss
  
      await infoEntreprise.merge({
        demande: 2, // Statut accepté
        appointment_date: appointmentDate
      }).save()
  
      session.flash('success', 'Demande acceptée et rendez-vous planifié avec succès')
      return response.redirect().back()
  
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error)
      session.flash('error', 'Une erreur est survenue lors du traitement de la demande')
      return response.redirect().back()
    }
  }
  



async rejetStore({ request, response, session }: HttpContext) {
  try {
    const data = request.only(['reject_message', 'company_id'])
    
    if (!data.reject_message || !data.company_id) {
      session.flash('error', 'Le message de rejet et l\'ID de l\'entreprise sont requis')
      return response.redirect().back()
    }

    const infoEntreprise = await InfoEntreprise.findOrFail(data.company_id)
    
    await infoEntreprise.merge({
      demande: 3, // Statut rejeté
      reject_message: data.reject_message
    }).save()

    session.flash('success', 'Demande rejetée avec succès')
    return response.redirect().back()

  } catch (error) {
    console.error('Erreur lors du rejet:', error)
    session.flash('error', 'Une erreur est survenue lors du traitement de la demande')
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
      const infoEntreprise = await InfoEntreprise.find(params.id)
      
      if (!infoEntreprise) {
        return response.status(404).json({
          status: 404,
          message: 'Entreprise non trouvée'
        })
      }
  
      return response.json({
        status: 200,
        infoEntreprise: infoEntreprise
      })
  
    } catch (error) {
      console.error('Erreur lors de la récupération:', error)
      return response.status(500).json({
        status: 500, 
        message: 'Erreur lors de la récupération des informations'
      })
    }
  }

// Fonction pour compter le total des entreprises
async countTotalEntreprises({ response }: HttpContext) {
  try {
    const total = await InfoEntreprise.query().count('* as total')
    return response.json({
      status: 200,
      total: Number(total[0].$extras.total),
      message: 'Total des entreprises récupéré avec succès'
    })
  } catch (error) {
    return response.status(500).json({
      status: 500,
      message: 'Erreur lors du comptage des entreprises',
      error: error.message
    })
  }
}

// Fonction pour compter les demandes en cours
async countDemandesEnCours({ response }: HttpContext) {
  try {
    const enCours = await InfoEntreprise.query()
      .where('demande', 1)
      .count('* as total')
    return response.json({
      status: 200,
      total: Number(enCours[0].$extras.total),
      message: 'Total des demandes en cours récupéré avec succès'
    })
  } catch (error) {
    return response.status(500).json({
      status: 500,
      message: 'Erreur lors du comptage des demandes en cours',
      error: error.message
    })
  }
}

// Fonction pour compter les demandes acceptées
async countDemandesAcceptees({ response }: HttpContext) {
  try {
    const acceptees = await InfoEntreprise.query()
      .where('demande', 2)
      .count('* as total')
    return response.json({
      status: 200,
      total: Number(acceptees[0].$extras.total),
      message: 'Total des demandes acceptées récupéré avec succès'
    })
  } catch (error) {
    return response.status(500).json({
      status: 500,
      message: 'Erreur lors du comptage des demandes acceptées',
      error: error.message
    })
  }
}

// Fonction pour compter les demandes rejetées
async countDemandesRejetees({ response }: HttpContext) {
  try {
    const rejetees = await InfoEntreprise.query()
      .where('demande', 3)
      .count('* as total')
    return response.json({
      status: 200,
      total: Number(rejetees[0].$extras.total),
      message: 'Total des demandes rejetées récupéré avec succès'
    })
  } catch (error) {
    return response.status(500).json({
      status: 500,
      message: 'Erreur lors du comptage des demandes rejetées',
      error: error.message
    })
  }
}  /**
   * Handle form submission for the edit action
   */
  async update({ params }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}