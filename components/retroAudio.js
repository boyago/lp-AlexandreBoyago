// Efeitos retrô originais gerados com Web Audio. Nenhum áudio dos jogos clássicos é reproduzido.
export function createRetroAudio() {
  let context
  let master
  let motor
  let vineVoice

  const ensure = () => {
    if (typeof window === 'undefined') return null
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return null
    if (!context) {
      context = new AudioContext()
      master = context.createGain()
      master.gain.value = 0.2
      master.connect(context.destination)
    }
    if (context.state === 'suspended') context.resume().catch(() => {})
    return context
  }

  const tone = (frequency, duration = 0.1, { wave = 'square', slide = 0, volume = 0.18, delay = 0 } = {}) => {
    const audio = ensure()
    if (!audio || !master) return
    const start = audio.currentTime + delay
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    oscillator.type = wave
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), start)
    if (slide) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency + slide), start + duration)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain).connect(master)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.02)
  }

  const noise = (duration = 0.18, { volume = 0.2, cutoff = 1100 } = {}) => {
    const audio = ensure()
    if (!audio || !master) return
    const length = Math.max(1, Math.floor(audio.sampleRate * duration))
    const buffer = audio.createBuffer(1, length, audio.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1
    const source = audio.createBufferSource()
    const filter = audio.createBiquadFilter()
    const gain = audio.createGain()
    filter.type = 'lowpass'
    filter.frequency.value = cutoff
    gain.gain.setValueAtTime(volume, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration)
    source.buffer = buffer
    source.connect(filter).connect(gain).connect(master)
    source.start()
  }

  const stopMotor = () => {
    if (!motor || !context) return
    const now = context.currentTime
    motor.gain.gain.cancelScheduledValues(now)
    motor.gain.gain.setValueAtTime(Math.max(0.0001, motor.gain.gain.value), now)
    motor.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)
    motor.oscillators.forEach((oscillator) => {
      try { oscillator.stop(now + 0.14) } catch {}
    })
    motor = null
  }

  const startMotor = (mode = 'car') => {
    const audio = ensure()
    if (!audio || !master) return
    stopMotor()
    const gain = audio.createGain()
    const filter = audio.createBiquadFilter()
    const lead = audio.createOscillator()
    const sub = audio.createOscillator()
    lead.type = mode === 'plane' ? 'sawtooth' : 'square'
    sub.type = 'triangle'
    gain.gain.value = 0.045
    filter.type = 'lowpass'
    filter.frequency.value = mode === 'plane' ? 750 : 520
    lead.connect(filter)
    sub.connect(filter)
    filter.connect(gain).connect(master)
    lead.start()
    sub.start()
    motor = { mode, gain, filter, oscillators: [lead, sub] }
    setMotor(0.25)
  }

  const setMotor = (speed = 0) => {
    if (!motor || !context) return
    const value = Math.max(0, Math.min(1, speed))
    const base = motor.mode === 'plane' ? 78 + value * 118 : 46 + value * 172
    const now = context.currentTime
    motor.oscillators[0].frequency.setTargetAtTime(base, now, 0.045)
    motor.oscillators[1].frequency.setTargetAtTime(base * (motor.mode === 'plane' ? 0.52 : 0.48), now, 0.06)
    motor.filter.frequency.setTargetAtTime((motor.mode === 'plane' ? 580 : 360) + value * 720, now, 0.08)
    motor.gain.gain.setTargetAtTime(0.035 + value * 0.055, now, 0.08)
  }

  const start = () => {
    ensure()
    tone(220, 0.07, { volume: 0.14 })
    tone(330, 0.08, { volume: 0.14, delay: 0.08 })
    tone(440, 0.11, { volume: 0.16, delay: 0.17 })
  }

  const shoot = () => tone(880, 0.09, { slide: -650, volume: 0.2 })
  const hit = () => {
    tone(150, 0.08, { slide: -75, volume: 0.18 })
    noise(0.08, { volume: 0.11, cutoff: 1400 })
  }
  const crash = () => {
    tone(105, 0.3, { wave: 'sawtooth', slide: -65, volume: 0.22 })
    noise(0.34, { volume: 0.24, cutoff: 760 })
  }
  const pass = () => tone(520, 0.045, { slide: 110, volume: 0.07 })
  const tile = (index) => tone([262, 330, 392, 523][index] || 330, 0.16, { volume: 0.17 })
  const correct = () => {
    tone(392, 0.08, { volume: 0.16 })
    tone(523, 0.08, { volume: 0.16, delay: 0.09 })
    tone(659, 0.14, { volume: 0.18, delay: 0.18 })
  }
  const fail = () => {
    tone(220, 0.13, { wave: 'sawtooth', slide: -70, volume: 0.2 })
    tone(130, 0.24, { wave: 'square', slide: -55, volume: 0.17, delay: 0.12 })
  }
  const march = (step = 0) => tone([68, 82, 74, 92][step % 4], 0.055, { volume: 0.13 })
  const refuel = () => tone(240, 0.06, { slide: 80, volume: 0.1 })
  const jump = () => tone(245, 0.14, { slide: 390, volume: 0.17 })
  const startVine = () => {
    // Grito estilo Tarzan do cipó, o iodelei característico do Pitfall: um tom que alterna rápido entre
    // duas notas (ah-ee-ah-ee) enquanto o contorno desce e volta a subir. Tudo sintetizado, nada gravado.
    const audio = ensure()
    if (!audio || !master || vineVoice) return
    const now = audio.currentTime
    const carrier = audio.createOscillator()
    const yodel = audio.createOscillator()
    const yodelDepth = audio.createGain()
    const filter = audio.createBiquadFilter()
    const gain = audio.createGain()
    carrier.type = 'square'
    yodel.type = 'square'
    yodel.frequency.value = 9.5 // alternância ah-ee
    yodelDepth.gain.value = 110
    filter.type = 'lowpass'
    filter.frequency.value = 1800
    // contorno do grito: começa alto, mergulha e volta a subir, em 1.4 s
    const steps = 40
    const curve = new Float32Array(steps)
    for (let i = 0; i < steps; i += 1) { const t = i / (steps - 1); curve[i] = 620 - Math.sin(t * Math.PI) * 260 + t * 40 }
    carrier.frequency.setValueCurveAtTime(curve, now, 1.4)
    yodel.connect(yodelDepth).connect(carrier.frequency)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.04)
    gain.gain.setValueAtTime(0.16, now + 1.1)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45)
    carrier.connect(filter).connect(gain).connect(master)
    carrier.start(now)
    yodel.start(now)
    carrier.stop(now + 1.5)
    yodel.stop(now + 1.5)
    carrier.onended = () => { if (vineVoice && vineVoice.carrier === carrier) vineVoice = null }
    vineVoice = { carrier, sub: yodel, wobble: yodelDepth, gain }
  }
  const stopVine = () => {
    if (!vineVoice || !context) return
    const now = context.currentTime
    vineVoice.gain.gain.cancelScheduledValues(now)
    vineVoice.gain.gain.setValueAtTime(Math.max(0.0001, vineVoice.gain.gain.value), now)
    vineVoice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)
    ;[vineVoice.carrier, vineVoice.sub].forEach((oscillator) => {
      try { oscillator.stop(now + 0.11) } catch {}
    })
    vineVoice = null
  }
  const vine = startVine
  const pickup = () => {
    tone(523, 0.07, { volume: 0.16 })
    tone(659, 0.07, { volume: 0.16, delay: 0.08 })
    tone(784, 0.15, { volume: 0.19, delay: 0.16 })
  }
  const room = () => tone(196, 0.09, { wave: 'triangle', slide: 130, volume: 0.12 })

  const dispose = () => {
    stopVine()
    stopMotor()
    if (context && context.state !== 'closed') context.close().catch(() => {})
    context = null
    master = null
  }

  return { start, shoot, hit, crash, pass, tile, correct, fail, march, refuel, jump, vine, startVine, stopVine, pickup, room, startMotor, setMotor, stopMotor, dispose }
}
