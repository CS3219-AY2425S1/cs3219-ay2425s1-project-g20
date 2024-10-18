import dotenv from 'dotenv'
if (process.env.NODE_ENV) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
} else {
  dotenv.config({ path: '.env' })
}
import { db } from '../db/clients'
import bcrypt from 'bcrypt'

const createAdminUser = async () => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD!, salt)

  const adminUser = {
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    isAdmin: true,
    createdAt: new Date(),
  }

  try {
    await db.add(adminUser)
    console.log('Admin user created successfully:', adminUser)
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

createAdminUser()
