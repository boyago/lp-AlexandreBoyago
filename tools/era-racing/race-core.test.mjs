import test from 'node:test'
import assert from 'node:assert/strict'
import { Duel, rectanglesOverlap, VEHICLES } from '../../public/games/era-racing/race-core.js'

test('accelerating can finish a full race, with a bounded speed and lap counter', () => {
  const race = new Duel(3,1)
  for(let i=0;i<180*60 && !race.finished;i++) race.step(1/60,true)
  assert.equal(race.finished,true)
  assert.equal(race.lap,3)
  assert.ok(race.elapsed>20 && race.elapsed<180)
  assert.ok(race.speeds[0]<=26)
  const elapsed=race.elapsed;race.step(1,true);assert.equal(race.elapsed,elapsed)
})
test('frame subdivisions produce the same progress and braking stops the car', () => {
  const a=new Duel(),b=new Duel()
  for(let i=0;i<1200;i++) a.step(1/120,true)
  for(let i=0;i<300;i++) b.step(1/30,true)
  assert.ok(Math.abs(a.progress[0]-b.progress[0])<1e-6)
  for(let i=0;i<180;i++) a.step(1/60,false,true)
  assert.equal(a.speeds[0],0)
})
test('collision starts a temporary spin and control recovers for all cars', () => {
  for (const vehicle of VEHICLES) {
    const race=new Duel(3,1,[vehicle.id,'mclaren'])
    race.lanes=[0,0];race.speeds=[24,5];race.step(.1,true)
    assert.ok(race.spinRemaining[0]>0)
    race.progress[1]=Math.PI;race.lanes=[-2,2]
    for(let i=0;i<240;i++) race.step(1/60,true)
    assert.equal(race.spinRemaining[0],0)
    assert.equal(race.yawOffsets[0],0)
    assert.ok(race.speeds[0]>0)
  }
})
test('steering into the defense respects track bounds and invalid deltas do nothing', () => {
  const race=new Duel()
  race.step(NaN,true);race.step(-1,true);assert.equal(race.elapsed,0)
  for(let i=0;i<1200;i++)race.step(1/60,true,false,1)
  assert.ok(race.impactCount>0)
  assert.ok(Math.abs(race.lanes[0])<6.18)
  assert.equal(rectanglesOverlap([0,0],0,[2,4],[20,0],0,[2,4]),false)
})
