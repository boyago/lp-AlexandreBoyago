import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { courseAgenda, courseFaq, courseFaqSchema } from '../lib/course-content.mjs'

test('curriculum has six complete sequential blocks with unique titles', () => {
  assert.equal(courseAgenda.length, 6)
  assert.equal(new Set(courseAgenda.map(block => block.title)).size, 6)
  const icons = new Set(['Code', 'Brain', 'GameController', 'Stack', 'Lightning', 'GlobeHemisphereWest'])
  courseAgenda.forEach((block, index) => {
    assert.equal(block.tag, `BLOCO ${String(index + 1).padStart(2, '0')}`)
    assert.equal(block.bullets.length, 3)
    assert.ok(block.description && block.outcome && icons.has(block.icon))
  })
})

test('FAQ structured data matches every visible question and answer', () => {
  assert.equal(courseFaqSchema['@type'], 'FAQPage')
  assert.equal(new Set(courseFaq.map(item => item.q)).size, courseFaq.length)
  assert.deepEqual(courseFaqSchema.mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })), courseFaq)
})

test('offer keeps replay and optional project files separate', () => {
  const files = courseFaq.find(item => item.q === 'Os arquivos dos projetos estão incluídos?')
  assert.match(files.a, /^Não\./)
  assert.match(files.a, /3 meses/)
  assert.match(files.a, /separadamente como item opcional no checkout/)
  const services = courseFaq.find(item => item.q.includes('hospedagem'))
  assert.match(services.a, /não inclui planos pagos/)
})

test('technical limitations and unconfirmed scope remain explicit', () => {
  assert.match(courseFaq.find(item => item.q.includes('multiplayer')).a, /não integra o conteúdo garantido/)
  assert.match(courseFaq.find(item => item.q.includes('telemetria')).a, /não representam uma plataforma de telemetria/)
  assert.match(courseFaq.find(item => item.q.includes('aceleração')).a, /lógica de movimento simplificada/)
  assert.match(courseFaq.find(item => item.q.includes('motores')).a, /não é uma formação completa/)
  const content = JSON.stringify({ courseAgenda, courseFaq })
  assert.doesNotMatch(content, /—|10 games|dez games|10 jogos|dez jogos|até as \d|até às \d/)
})

test('landing page uses shared content, keeps anchor and checkout URL unchanged', async () => {
  const source = await readFile(new URL('../app/page.jsx', import.meta.url), 'utf8')
  assert.match(source, /courseAgenda as agenda, courseFaq as faqItems, courseFaqSchema as faqSchema/)
  assert.match(source, /id="conteudo" aria-labelledby="curriculum-title"/)
  assert.equal((source.match(/href="#conteudo">Grade da imersão/g) || []).length, 2)
  assert.match(source, /https:\/\/wizmarket\.com\.br\/checkout\/ai-game-lab\?offer=imersao-lore1/)
  assert.match(source, /2026-09-26T08:00:00-03:00/)
})
