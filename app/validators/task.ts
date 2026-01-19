import vine from '@vinejs/vine'

export const createTaskValidator = vine.compile(
  vine.object({
    titre: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().maxLength(5000),
    statut: vine.string().in(['à faire', 'en cours', 'terminée']),
    collaborators: vine.array(vine.number()).optional(),
  })
)

export const updateTaskValidator = vine.compile(
  vine.object({
    titre: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().maxLength(5000),
    statut: vine.string().in(['à faire', 'en cours', 'terminée']),
    collaborators: vine.array(vine.number()).optional(),
  })
)
