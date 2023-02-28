import crypto from 'crypto'


export default (bytes: number = 16): string => {
  return crypto.randomBytes(bytes).toString('hex')
}