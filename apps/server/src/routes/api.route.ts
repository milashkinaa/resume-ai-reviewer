import { Router } from 'express'
import { urlToPdfController } from '../controllers/url-to-pdf.controller.js'
import { matchController } from '../controllers/match.controller.js'

export const apiRouter = Router()

apiRouter.post('/url-to-pdf', urlToPdfController)
apiRouter.post('/match', matchController)
