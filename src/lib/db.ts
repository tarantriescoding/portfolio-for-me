import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getResolvedDatabaseUrl() {
  const configuredUrl = process.env.DATABASE_URL

  if (configuredUrl && !configuredUrl.startsWith('file:')) {
    return configuredUrl
  }

  const bundledDbPath = path.join(process.cwd(), 'db', 'custom.db')

  if (process.env.VERCEL) {
    const runtimeDbPath = path.join('/tmp', 'portfolio.sqlite')

    if (!fs.existsSync(runtimeDbPath)) {
      if (!fs.existsSync(bundledDbPath)) {
        throw new Error(`Bundled SQLite database not found at ${bundledDbPath}`)
      }

      fs.copyFileSync(bundledDbPath, runtimeDbPath)
    }

    return `file:${runtimeDbPath}`
  }

  if (configuredUrl?.startsWith('file:')) {
    const filePath = configuredUrl.slice('file:'.length)

    if (path.isAbsolute(filePath) && fs.existsSync(filePath)) {
      return configuredUrl
    }
  }

  return `file:${bundledDbPath}`
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getResolvedDatabaseUrl(),
      },
    },
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
