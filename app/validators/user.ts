import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().maxLength(255),
    password: vine.string().minLength(6).maxLength(255),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().maxLength(255),
    password: vine.string().minLength(6).maxLength(255).optional(),
  })
)
