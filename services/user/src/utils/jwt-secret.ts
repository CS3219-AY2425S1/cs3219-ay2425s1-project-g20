import fs from 'fs'

function getJwtSecret(): string {
  if (!process.env.JWT_SECRET && !process.env.JWT_SECRET_PATH) {
    throw new Error('JWT_SECRET and JWT_SECRET_PATH is not set')
  }

  if (process.env.JWT_SECRET !== undefined) {
    return process.env.JWT_SECRET
  }

  return fs.readFileSync(process.env.JWT_SECRET_PATH!, 'utf8')
}

export const jwtSecret = getJwtSecret()
