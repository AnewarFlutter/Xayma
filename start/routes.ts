/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ContactsController from '#controllers/view/contacts_controller'
import DashboardController from '#controllers/client/dashboard_controller';



import router from '@adonisjs/core/services/router'
import NvdemandesController from '#controllers/client/nvdemandes_controller';
import { middleware } from './kernel.js';
import DashboardAdminsController from '#controllers/admin/dashboard_admins_controller';
import LoginController from '#controllers/auth/login_controller';
import RegistersController from '#controllers/auth/registers_controller';
import LogoutsController from '#controllers/auth/logouts_controller';
import InformationEntreprisesController from '#controllers/client/information_entreprises_controller';
import DocumentLegauxesController from '#controllers/client/document_legauxes_controller';
import EffectifEntreprisesController from '#controllers/client/effectif_entreprises_controller';
import ListesController from '#controllers/admin/listes_controller';

// Routes publiques
router.on('/').render('accueil/index').as('home')
router.get('/login', [LoginController, 'index']).as('login.index')
router.get('/register', [RegistersController, 'index']).as('register.index')
router.get('/contact', [ContactsController, 'index']).as('contacts.index')

// Routes authentification
router.post('/register', [RegistersController, 'store']).as('register.store')
router.post('/login', [LoginController, 'login']).as('login.store')
router.post('/logout', [LogoutsController, 'logout']).as('logout.store')

// Routes admin protégées
router.group(() => {
  router.get('/admin/dashboard', [DashboardAdminsController, 'index'])
    .as('admin.dashboard')
  // Autres routes admin...

  // Liste
  router.post('/admin/acception', [ListesController, 'acceptationStore']).as('admin.acceptation')

  router.post('/admin/rejet', [ListesController, 'rejetStore']).as('admin.rejet')

  router.get('/admin/listes', [ListesController, 'index']).as('admin.listes')

  router.get('/admin/listes/create', [ListesController, 'create']).as('admin.listes.create')

  router.get('/admin/listes/:id/edit', [ListesController, 'edit']).as('admin.listes.edit')

// Route pour le total des entreprises
router.get('/admin/stats/total', [ListesController, 'countTotalEntreprises'])
.as('admin.stats.total')

// Route pour les demandes en cours
router.get('/admin/stats/encours', [ListesController, 'countDemandesEnCours'])
.as('admin.stats.encours')

// Route pour les demandes acceptées  
router.get('/admin/stats/acceptees', [ListesController, 'countDemandesAcceptees'])
.as('admin.stats.acceptees')

// Route pour les demandes rejetées
router.get('/admin/stats/rejetees', [ListesController, 'countDemandesRejetees'])
.as('admin.stats.rejetees')

}).use(middleware.auth()) // Vérifie l'authentification
.use(middleware.admin()) // Vérifie si admin










// Routes user protégées 
router.group(() => {
  // Dashboard utilisateur
  router.get('/dashboard', [DashboardController, 'index'])
    .as('dashboard.index')

  // Informations entreprise
  router.get('/entreprise/informations', [InformationEntreprisesController, 'index'])
    .as('entreprise.informations')


  // Informations entreprise

  router.post('/entreprise/store', [InformationEntreprisesController, 'store'])
    .as('entreprise.informations.store')


  // Documents légaux  
  router.get('/entreprise/documents_legaux', [DocumentLegauxesController, 'index'])
    .as('entreprise.documents_legaux')


  // Documents légaux

  router.post('/entreprise/documents_legaux/store', [DocumentLegauxesController, 'store'])
    .as('entreprise.documents_legaux.store')
 

  // Effectif entreprise
  router.get('/entreprise/effectif', [EffectifEntreprisesController, 'index'])
    .as('entreprise.effectif')
   

  // Ajouter cette nouvelle route
  router.post('/entreprise/effectif/store', [EffectifEntreprisesController, 'store'])
    .as('entreprise.effectif.store')
   

  // Récapitulatif
  router.get('/entreprise/recapitulatif', [NvdemandesController, 'index'])
    .as('entreprise.recapitulatif')

  // Route pour la soumission finale de la demande
  router.post('/entreprise/nouvelle-demande', [NvdemandesController, 'store'])
    .as('entreprise.nouvelle_demande.store')

})
.use(middleware.auth()) // Vérifie l'authentification
.use(middleware.user()) // Vérifie si utilisateur normal







