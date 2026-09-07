// Port of the supplied Blender duel_core.py. Coordinates remain in Blender's XY plane.
export const TAU = Math.PI * 2
export const RX = 36, RY = 24
export const VEHICLES = [
  { id: 'fusca', name: 'Fusca', era: 'Clássico', size: [1.54, 4.1] },
  { id: 'gaz', name: 'GAZ 415', era: 'Pickup clássica', size: [1.85, 4.67] },
  { id: 'porsche', name: 'Porsche', era: 'Esportivo', size: [2.02, 4.5] },
  { id: 'mclaren', name: 'McLaren MP4/5', era: 'Fórmula 1', size: [2.14, 4.4] },
]
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x))
export const trackPosition = (t, lane) => [(RX + lane) * Math.cos(t), (RY + lane) * Math.sin(t)]
export const heading = (t, lane) => Math.atan2((RY + lane) * Math.cos(t), -(RX + lane) * Math.sin(t))
export function rectanglesOverlap(a, angleA, sizeA, b, angleB, sizeB) {
  const axes = [angleA, angleB].flatMap(angle => [[Math.cos(angle), Math.sin(angle)], [-Math.sin(angle), Math.cos(angle)]])
  const radius = (angle, size, axis) => {
    const f = [Math.cos(angle), Math.sin(angle)], r = [-f[1], f[0]]
    return Math.abs(f[0]*axis[0]+f[1]*axis[1])*size[1]/2 + Math.abs(r[0]*axis[0]+r[1]*axis[1])*size[0]/2
  }
  return axes.every(axis => Math.abs((b[0]-a[0])*axis[0]+(b[1]-a[1])*axis[1]) <= radius(angleA,sizeA,axis)+radius(angleB,sizeB,axis))
}
export class Duel {
  constructor(laps = 3, difficulty = 1, vehicles = ['fusca', 'mclaren']) {
    this.laps = laps; this.difficulty = difficulty
    this.progress = [0, 0]; this.lanes = [-2, 2]; this.speeds = [0, 0]
    this.elapsed = 0; this.finishTimes = [null, null]; this.finished = false; this.place = null
    this.sizes = vehicles.map(key => VEHICLES.find(v => v.id === key).size)
    this.spinRemaining = [0, 0]; this.spinDuration = [1.6, 1.6]; this.spinSign = [1, 1]
    this.yawOffsets = [0, 0]; this.lateralVelocity = [0, 0]; this.cooldown = [0, 0]
    this.impactCount = 0; this.offroad = false; this.wallContact = false; this.contact = false
  }
  impact(i, strength, direction) {
    if (this.cooldown[i] > 0 || this.finishTimes[i] !== null) return
    this.impactCount++
    this.speeds[i] *= Math.max(.22, 1 - strength * .035)
    this.lateralVelocity[i] = direction * Math.min(3.5, .8 + strength * .12)
    this.cooldown[i] = 2.1
    if (strength >= 3) {
      this.spinDuration[i] = Math.min(1.9, 1.2 + strength * .025)
      this.spinRemaining[i] = this.spinDuration[i]; this.spinSign[i] = direction
    }
  }
  step(dt, throttle = false, brake = false, steer = 0) {
    if (this.finished || !Number.isFinite(dt) || dt <= 0) return
    let remaining = Math.min(dt, .25)
    while (remaining > 1e-9 && !this.finished) {
      const tick = Math.min(remaining, 1/120)
      this.tick(tick, throttle, brake, steer); remaining -= tick
    }
  }
  tick(dt, throttle, brake, steer) {
    this.elapsed += dt; this.wallContact = false
    for (let i=0; i<2; i++) {
      this.cooldown[i] = Math.max(0, this.cooldown[i]-dt)
      this.spinRemaining[i] = Math.max(0, this.spinRemaining[i]-dt)
      const phase = 1 - this.spinRemaining[i] / this.spinDuration[i]
      this.yawOffsets[i] = this.spinRemaining[i] > 0 ? this.spinSign[i]*TAU*(phase*phase*(3-2*phase)) : 0
      this.lateralVelocity[i] *= Math.exp(-2.2*dt)
    }
    const spinning = this.spinRemaining[0] > 0
    this.speeds[0] = clamp(this.speeds[0]+((spinning ? -5 : throttle ? 7.6 : -2.4)-(brake ? 18 : 0))*dt, 0, 26)
    const lateral = clamp(steer,-1,1)*(spinning ? .4 : .35+this.speeds[0]*.14)
    this.lanes[0] += dt*(lateral+this.lateralVelocity[0])
    this.offroad = Math.abs(this.lanes[0]) > 4.05
    if (this.offroad) this.speeds[0] = Math.max(0,this.speeds[0]-16*dt)
    const target = [18.5,21.5,24][this.difficulty]*(1+.02*Math.sin(this.elapsed*.7))
    this.speeds[1] = clamp(this.speeds[1]+(this.spinRemaining[1]>0 ? -5 : 7)*dt, 0, target)
    const desired = 2+.28*Math.sin(this.elapsed*.32)
    this.lanes[1] += ((desired-this.lanes[1])*(this.spinRemaining[1]>0 ? .3 : 1.7)+this.lateralVelocity[1])*dt
    for (let i=0; i<2; i++) {
      const yaw = this.yawOffsets[i], [width,length] = this.sizes[i]
      const limit = 6.18 - (Math.abs(Math.cos(yaw))*width+Math.abs(Math.sin(yaw))*length)/2
      if (Math.abs(this.lanes[i]) > limit) {
        const side = Math.sign(this.lanes[i]); if (i===0) this.wallContact = true
        const strength = Math.abs(this.lateralVelocity[i])+(i===0 ? Math.abs(lateral)*2 : 1)+this.speeds[i]*.35
        this.lanes[i] = side*limit; this.impact(i,strength,-side)
      }
    }
    const positions = this.progress.map((t,i) => trackPosition(t,this.lanes[i]))
    const angles = this.progress.map((t,i) => heading(t,this.lanes[i])+this.yawOffsets[i])
    this.contact = rectanglesOverlap(positions[0],angles[0],this.sizes[0],positions[1],angles[1],this.sizes[1])
    if (this.contact) {
      const direction = this.lanes[0]<=this.lanes[1] ? -1 : 1
      const strength = Math.abs(this.speeds[0]-this.speeds[1])+Math.abs(lateral+this.lateralVelocity[0]-this.lateralVelocity[1])*1.8
      this.impact(0,strength,direction); this.impact(1,strength,-direction)
      this.lanes[0]+=direction*dt; this.lanes[1]-=direction*dt
    }
    for (let i=0; i<2; i++) {
      if (this.finishTimes[i] !== null) continue
      const theta=this.progress[i], lane=this.lanes[i]
      const delta=this.speeds[i]*dt*(this.spinRemaining[i]>0 ? .3 : 1)/Math.hypot((RX+lane)*Math.sin(theta),(RY+lane)*Math.cos(theta))
      const before=this.progress[i]; this.progress[i]=Math.min(this.laps*TAU,before+delta)
      if (this.progress[i]>=this.laps*TAU) this.finishTimes[i]=this.elapsed-dt+dt*(delta ? (this.laps*TAU-before)/delta : 1)
    }
    if (this.finishTimes[0] !== null) {
      this.finished=true; this.place=this.finishTimes[1]===null || this.finishTimes[0]<=this.finishTimes[1] ? 1 : 2
    }
  }
  get position() { return this.finished ? this.place : this.progress[0]>=this.progress[1] ? 1 : 2 }
  get lap() { return Math.min(this.laps,Math.floor(this.progress[0]/TAU)+1) }
}
