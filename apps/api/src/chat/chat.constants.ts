export const CHAT_DEFAULT_MESSAGE_LIMIT = 50
export const CHAT_MAX_MESSAGE_LIMIT = 100

export const CHAT_GROUP_SELECT = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  batch: {
    select: {
      id: true,
      batchYear: true,
    },
  },
} as const

export const CHAT_MESSAGE_SELECT = {
  id: true,
  content: true,
  chatGroupId: true,
  createdAt: true,
  sender: {
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
    },
  },
} as const
