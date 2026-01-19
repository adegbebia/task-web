import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js' // 👈 Importez les middlewares

// Imports dynamiques
const TasksController = () => import('#controllers/tasks_controller')
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

// Route d'accueil
router.get('/', async ({ response }) => {
  return response.redirect('/tasks')
})

// Routes des tâches (accessibles à tous les utilisateurs connectés)
router.get('/tasks', [TasksController, 'index']).as('tasks.index')
router.get('/tasks/create', [TasksController, 'create']).as('tasks.create')
router.post('/tasks', [TasksController, 'store']).as('tasks.store')
router.get('/tasks/:id', [TasksController, 'show']).as('tasks.show')
router.get('/tasks/:id/edit', [TasksController, 'edit']).as('tasks.edit')
router.post('/tasks/:id/update', [TasksController, 'update']).as('tasks.update')
router.post('/tasks/:id/delete', [TasksController, 'destroy']).as('tasks.destroy')

// Routes des utilisateurs (ADMIN UNIQUEMENT)
router
  .group(() => {
    router.get('/users', [UsersController, 'index']).as('users.index')
    router.get('/users/create', [UsersController, 'create']).as('users.create')
    router.post('/users', [UsersController, 'store']).as('users.store')
    router.get('/users/:id', [UsersController, 'show']).as('users.show')
    router.get('/users/:id/edit', [UsersController, 'edit']).as('users.edit')
    router.post('/users/:id/update', [UsersController, 'update']).as('users.update')
    router.post('/users/:id/delete', [UsersController, 'destroy']).as('users.destroy')
  })
  .use(middleware.admin()) // 👈 Utilisez .use() au lieu de .middleware()

// Routes d'authentification (accessibles sans connexion)
router.get('/login', [AuthController, 'showLogin']).as('auth.showLogin')
router.post('/login', [AuthController, 'login']).as('auth.login')
router.post('/logout', [AuthController, 'logout']).as('auth.logout')
