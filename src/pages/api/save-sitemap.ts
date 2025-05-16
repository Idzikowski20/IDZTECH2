import { writeFile } from 'fs/promises'
import { join } from 'path'
import type { Request, Response } from 'express'

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { sitemap } = req.body

    if (!sitemap) {
      return res.status(400).json({ message: 'Brak zawartości sitemap' })
    }

    // Zapisz sitemap.xml w katalogu public
    const publicPath = join(process.cwd(), 'public')
    await writeFile(join(publicPath, 'sitemap.xml'), sitemap, 'utf-8')

    res.status(200).json({ message: 'Sitemap.xml został zaktualizowany' })
  } catch (error) {
    console.error('Błąd podczas zapisywania sitemap.xml:', error)
    res.status(500).json({ message: 'Wystąpił błąd podczas zapisywania sitemap.xml' })
  }
} 