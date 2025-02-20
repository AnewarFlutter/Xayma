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
import { middleware } from './kernel.js';
import DashboardAdminsController from '#controllers/admin/dashboard_admins_controller';
import LoginController from '#controllers/auth/login_controller';
import RegistersController from '#controllers/auth/registers_controller';
import LogoutsController from '#controllers/auth/logouts_controller';
import DossierController from '#controllers/client/corrigee/dossier_controller';
import TypeOperationsController from '#controllers/client/type_operations_controller';
import RegionsController from '#controllers/admin/regions_controller';
import DepartementsController from '#controllers/admin/departements_controller';
import CommunesController from '#controllers/admin/communes_controller';
import VillesController from '#controllers/admin/villes_controller';
import SecteursController from '#controllers/admin/secteurs_controller';
import CoeficientsController from '#controllers/admin/coeficients_controller';
import MentionsController from '#controllers/admin/mentions_controller';
import EclairagesController from '#controllers/admin/eclairages_controller';
import VentilationsController from '#controllers/admin/ventilations_controller';
import VertustesController from '#controllers/admin/vertustes_controller';
import AnciennetesController from '#controllers/admin/anciennetes_controller';
import LocalisationAdministrativeController from '#controllers/client/corrigee/localisations_controller';
import DependancesController from '#controllers/client/corrigee/dependances_controller'
import EquivalenceSuperficiellesController from '#controllers/admin/equivalences_superficielles_controller'
// Routes publiques

router.get('/', [LoginController, 'index']).as('login.index')
router.get('/login', [LoginController, 'index'])
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

  // Régions
  router.get('/admin/regions', [RegionsController, 'index']).as('regions.index')
  router.get('/admin/regions/create', [RegionsController, 'create']).as('regions.create')
  router.post('/admin/regions/store', [RegionsController, 'store']).as('regions.store')
  router.get('/admin/regions/:id/edit', [RegionsController, 'edit']).as('regions.edit')
  router.post('/admin/regions/update', [RegionsController, 'update']).as('regions.update')
  router.post('/admin/regions/delete', [RegionsController, 'destroy']).as('regions.destroy')




   // Départements
   router.get('/admin/departements', [DepartementsController, 'index']).as('departements.index')
   router.get('/admin/departements/create', [DepartementsController, 'create']).as('departements.create')
   router.post('/admin/departements/store', [DepartementsController, 'store']).as('departements.store')
   router.get('/admin/departements/:id/edit', [DepartementsController, 'edit']).as('departements.edit')
   router.post('/admin/departements/update', [DepartementsController, 'update']).as('departements.update')
   router.post('/admin/departements/delete', [DepartementsController, 'destroy']).as('departements.destroy')


   //Communes

   router.get('/admin/communes', [CommunesController, 'index']).as('communes.index')
   router.get('/admin/communes/create', [CommunesController, 'create']).as('communes.create')
   router.post('/admin/communes/store', [CommunesController, 'store']).as('communes.store')
   router.get('/admin/communes/:id/edit', [CommunesController, 'edit']).as('communes.edit')
   router.post('/admin/communes/update', [CommunesController, 'update']).as('communes.update')
   router.post('/admin/communes/delete', [CommunesController, 'destroy']).as('communes.destroy')

   //Villes

   router.get('/admin/villes', [VillesController, 'index']).as('villes.index')
   router.get('/admin/villes/create', [VillesController, 'create']).as('villes.create')
   router.post('/admin/villes/store', [VillesController, 'store']).as('villes.store')
   router.get('/admin/villes/:id/edit', [VillesController, 'edit']).as('villes.edit')
   router.post('/admin/villes/update', [VillesController, 'update']).as('villes.update')
   router.post('/admin/villes/delete', [VillesController, 'destroy']).as('villes.destroy')


   //Secteurs

   router.get('/admin/secteurs', [SecteursController, 'index']).as('secteurs.index')
   router.get('/admin/secteurs/create', [SecteursController, 'create']).as('secteurs.create')
   router.post('/admin/secteurs/store', [SecteursController, 'store']).as('secteurs.store')
   router.get('/admin/secteurs/:id/edit', [SecteursController, 'edit']).as('secteurs.edit')
   router.post('/admin/secteurs/update', [SecteursController, 'update']).as('secteurs.update')
   router.post('/admin/secteurs/delete', [SecteursController, 'destroy']).as('secteurs.destroy')


    //Coeficients

    router.get('/admin/coefficient', [CoeficientsController, 'index']).as('coefficients.index')
    router.get('/admin/coefficient/create', [CoeficientsController, 'create']).as('coefficients.create')
    router.post('/admin/coefficient/store', [CoeficientsController, 'store']).as('coefficients.store')
    router.get('/admin/coefficient/:id/edit', [CoeficientsController, 'edit']).as('coefficients.edit')
    router.post('/admin/coefficient/update', [CoeficientsController, 'update']).as('coefficients.update')
    router.post('/admin/coefficient/delete', [CoeficientsController, 'destroy']).as('coefficients.destroy')
 
    //mentions

    router.get('/admin/mentions', [MentionsController, 'index']).as('mentions.index')
    router.get('/admin/mentions/create', [MentionsController, 'create']).as('mentions.create')
    router.post('/admin/mentions/store', [MentionsController, 'store']).as('mentions.store')
    router.get('/admin/mentions/:id/edit', [MentionsController, 'edit']).as('mentions.edit')
    router.post('/admin/mentions/update', [MentionsController, 'update']).as('mentions.update')
    router.post('/admin/mentions/delete', [MentionsController, 'destroy']).as('mentions.destroy')


    //eclairage

    router.get('/admin/eclairages', [EclairagesController, 'index']).as('eclairages.index')
    router.get('/admin/eclairages/create', [EclairagesController, 'create']).as('eclairages.create')
    router.post('/admin/eclairages/store', [EclairagesController, 'store']).as('eclairages.store')
    router.get('/admin/eclairages/:id/edit', [EclairagesController, 'edit']).as('eclairages.edit')
    router.post('/admin/eclairages/update', [EclairagesController, 'update']).as('eclairages.update')
    router.post('/admin/eclairages/delete', [EclairagesController, 'destroy']).as('eclairages.destroy')


    //ventilations

    router.get('/admin/ventilations', [VentilationsController, 'index']).as('ventilations.index')
    router.get('/admin/ventilations/create', [VentilationsController, 'create']).as('ventilations.create')
    router.post('/admin/ventilations/store', [VentilationsController, 'store']).as('ventilations.store')
    router.get('/admin/ventilations/:id/edit', [VentilationsController, 'edit']).as('ventilations.edit')
    router.post('/admin/ventilations/update', [VentilationsController, 'update']).as('ventilations.update')
    router.post('/admin/ventilations/delete', [VentilationsController, 'destroy']).as('ventilations.destroy')
 

    //vertustes

    router.get('/admin/vertustes', [VertustesController, 'index']).as('vertustes.index')
    router.get('/admin/vertustes/create', [VertustesController, 'create']).as('vertustes.create')
    router.post('/admin/vertustes/store', [VertustesController, 'store']).as('vertustes.store')
    router.get('/admin/vertustes/:id/edit', [VertustesController, 'edit']).as('vertustes.edit')
    router.post('/admin/vertustes/update', [VertustesController, 'update']).as('vertustes.update')
    router.post('/admin/vertustes/delete', [VertustesController, 'destroy']).as('vertustes.destroy')


    //anciennetes

    router.get('/admin/anciennetes', [AnciennetesController, 'index']).as('anciennetes.index')
    router.get('/admin/anciennetes/create', [AnciennetesController, 'create']).as('anciennetes.create')
    router.post('/admin/anciennetes/store', [AnciennetesController, 'store']).as('anciennetes.store')
    router.get('/admin/anciennetes/:id/edit', [AnciennetesController, 'edit']).as('anciennetes.edit')
    router.post('/admin/anciennetes/update', [AnciennetesController, 'update']).as('anciennetes.update')
    router.post('/admin/anciennetes/delete', [AnciennetesController, 'destroy']).as('anciennetes.destroy')


  router.get('/admin/equivalence-superficielles', [EquivalenceSuperficiellesController, 'index'])
    .as('equivalence-superficielles.index')
  router.get('/admin/equivalence-superficielles/create', [EquivalenceSuperficiellesController, 'create'])
    .as('equivalence-superficielles.create')
  router.post('/admin/equivalence-superficielles/store', [EquivalenceSuperficiellesController, 'store'])
    .as('equivalence-superficielles.store')  
  router.get('/admin/equivalence-superficielles/:id/edit', [EquivalenceSuperficiellesController, 'edit'])
    .as('equivalence-superficielles.edit')  
  router.post('/admin/equivalence-superficielles/update', [EquivalenceSuperficiellesController, 'update'])
    .as('equivalence-superficielles.update')   
  router.post('/admin/equivalence-superficielles/delete', [EquivalenceSuperficiellesController, 'destroy'])
    .as('equivalence-superficielles.destroy')

}).use(middleware.auth()) // Vérifie l'authentification
.use(middleware.admin()) // Vérifie si admin










// Routes user protégées 
router.group(() => {
  // Dashboard utilisateur
  router.get('/dashboard', [DashboardController, 'index'])
    .as('dashboard.index')


      //Type operation

  router.get('/type_operation', [TypeOperationsController, 'index']).as('type_operations.index')
  


//=====================================================================================================


  // Dossier methode corrigée

  router.get('/dossier/methode/corrigee', [DossierController, 'index']).as('dossiers.index')
  router.post('/dossier/methode/corrigee/store', [DossierController, 'store']).as('dossiers.store')
  router.get('/dossier/methode/corrigee/:id', [DossierController, 'show']).as('dossiers.show')
  router.post('/dossier/methode/corrigee/delete', [DossierController, 'destroy']).as('dossiers.destroy')
 

  router.get('/localisations', [LocalisationAdministrativeController, 'index'])
  .as('localisations.index')

// Création d'une nouvelle localisation
router.post('/localisations/store', [LocalisationAdministrativeController, 'store'])
  .as('localisations.store')

// Affichage des détails d'une localisation
router.get('/localisations/:id', [LocalisationAdministrativeController, 'show'])
  .as('localisations.show')

// Mise à jour d'une localisation
router.post('/localisations/update', [LocalisationAdministrativeController, 'update'])
  .as('localisations.update')

// Suppression d'une localisation
router.post('/localisations/delete', [LocalisationAdministrativeController, 'destroy'])
  .as('localisations.destroy')

  // Autres routes utilisateur...
  router.get('/localisation/retour', [LocalisationAdministrativeController, 'retour']).as('localisations.retour')
  router.get('/dossier/retour', [DossierController, 'retour']).as('dossier.retour')
//=====================================================================================================
router.get('/api/departements/:regionId', [LocalisationAdministrativeController, 'getDepartements'])
router.get('/api/communes/:departementId',[LocalisationAdministrativeController, 'getCommunes'])
router.get('/api/villes/:communeId', [LocalisationAdministrativeController, 'getVilles'])
router.get('/api/secteurs/:villeId', [LocalisationAdministrativeController, 'getSecteurs']) // Modifier le paramètre
router.get('/api/regions', [LocalisationAdministrativeController, 'getRegions'])
router.get('/api/localisations/current', [LocalisationAdministrativeController, 'getCurrentLocalisation'])

//=====================================================================================================

router.get('/dependances', [DependancesController, 'index'])
.as('dependances.index')

// Création des dépendances (retourne les données pour le tableau)
router.get('/dependances/create', [DependancesController, 'create'])
.as('dependances.create')

// Enregistrement d'une nouvelle dépendance
router.post('/dependances/store', [DependancesController, 'store'])
.as('dependances.store')

// Récupération des données pour l'édition
router.get('/dependances/:id/edit', [DependancesController, 'edit'])
.as('dependances.edit')

// Mise à jour d'une dépendance
router.post('/dependances/update', [DependancesController, 'update'])
.as('dependances.update')

// Suppression d'une dépendance
router.post('/dependances/delete', [DependancesController, 'destroy'])
.as('dependances.destroy')
router.get('/dependances/retour', [DependancesController, 'retour']).as('dependances.retour')



})
.use(middleware.auth()) // Vérifie l'authentification
.use(middleware.user()) // Vérifie si utilisateur normal







