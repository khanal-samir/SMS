/* eslint-disable turbo/no-undeclared-env-vars */
'use server'

export async function verifyAdminSecret(prevState: unknown, formData: FormData) {
  const secretKey = formData.get('secret') as string
  if (!secretKey) {
    return { error: 'Access key is required', isAuthorized: false }
  }
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY
  if (!ADMIN_SECRET_KEY) {
    return { error: 'Invalid access key', isAuthorized: false }
  }
  if (secretKey === ADMIN_SECRET_KEY) {
    return { isAuthorized: true, error: null }
  } else {
    return { error: 'Invalid access key', isAuthorized: false }
  }
}
