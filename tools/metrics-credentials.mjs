import { randomBytes } from 'node:crypto'
import { passwordHash } from '../lib/metrics-core.mjs'

// Run interactively in your own terminal. No password is written to disk or echoed.
if (!process.stdin.isTTY) throw new Error('Abra um terminal interativo para definir a senha com entrada oculta.')
process.stdout.write('Escolha uma senha forte para o painel (mínimo 16 caracteres): ')
process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding('utf8')
let password = ''
process.stdin.on('data', chunk => {
  if (chunk.includes('\u0003')) { process.stdin.setRawMode(false); process.exit(130) }
  for (const char of chunk) {
    if (char === '\r' || char === '\n') {
      if (password.length < 16) { process.stdout.write('\nUse pelo menos 16 caracteres. Tente novamente: '); password = ''; continue }
      process.stdin.setRawMode(false)
      console.log('\nCopie as duas variáveis para o ambiente privado da Hostinger ou .env.local. Não publique estes valores:')
      console.log(`ANALYTICS_ADMIN_PASSWORD_HASH=${passwordHash(password)}`)
      console.log(`ANALYTICS_SESSION_SECRET=${randomBytes(32).toString('hex')}`)
      password = ''
      process.exit(0)
    } else if (char === '\u007f' || char === '\b') password = password.slice(0, -1)
    else if (char >= ' ' && password.length < 256) password += char
  }
})
