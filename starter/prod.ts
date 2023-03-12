import helmet from 'helmet'
import compression from 'compression'
import { Express } from 'express';

export default(app: Express) => {
  app.use(helmet())
  app.use(compression())
}