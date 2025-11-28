import router from '@adonisjs/core/services/router'

const TasksController = () => import('#controllers/tasks_controller')
const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')

router.get('/', async ({ response }) => {
  return response.redirect('/tasks')
})

router.get('/tasks', [TasksController, 'index']).as('tasks.index')

router.get('/tasks/create', [TasksController, 'create']).as('tasks.create')

router.post('/tasks', [TasksController, 'store']).as('tasks.store')

router.get('/tasks/:id/edit', [TasksController, 'edit']).as('tasks.edit')

router.put('/tasks/:id', [TasksController, 'update']).as('tasks.update')

router.delete('/tasks/:id', [TasksController, 'destroy']).as('tasks.destroy')

router.get('/users', [UsersController, 'index']).as('users.index')

router.get('/users/create', [UsersController, 'create']).as('users.create')

router.post('/users', [UsersController, 'store']).as('users.store')

router.get('/users/:id/edit', [UsersController, 'edit']).as('users.edit')

router.put('/users/:id', [UsersController, 'update']).as('users.update')

router.get('/users/:id', [UsersController, 'show']).as('users.show')

router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy')

router.get('/login', [AuthController, 'showLogin']).as('auth.showLogin')
router.post('/login', [AuthController, 'login']).as('auth.login')
router.post('/logout', [AuthController, 'logout']).as('auth.logout')

router.get('/debug/auth', async ({ auth }) => {
  const isAuthenticated = await auth.use('web').check()
  return {
    isAuthenticated,
    user: auth.use('web').user,
  }
})
