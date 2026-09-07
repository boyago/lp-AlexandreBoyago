import * as THREE from 'three'
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js'
import { Duel, VEHICLES, trackPosition, heading, clamp } from './race-core.mjs'

const $ = id => document.getElementById(id)
const canvas = $('track'), keys = new Set(), cache = new Map()
let renderer, scene, camera, racers = [], race = new Duel(), state = 'loading', paused = false
let countdown = 3, last = 0, mode = 1, zoom = 1, selectionToken = 0, inView = true
let audio, master, engine, engineGain, engineFilter, muted = true, lastImpact = 0
const selections = ['fusca', 'mclaren']
const cameraModes = [[5.7,2.4,3,0], [9,4.1,4,0], [15,7,5,0], [2,23,1,0], [-2.65,.65,12,0], [8,3.2,3,5]]

function audioInit() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return
  if (!audio) {
    audio = new AudioContext(); master = audio.createGain(); master.gain.value = 0; master.connect(audio.destination)
    engine = audio.createOscillator(); engine.type = 'sawtooth'; engine.frequency.value = 55
    engineFilter = audio.createBiquadFilter(); engineFilter.type = 'lowpass'; engineFilter.frequency.value = 420
    engineGain = audio.createGain(); engineGain.gain.value = .11
    engine.connect(engineFilter).connect(engineGain).connect(master); engine.start()
  }
  audio.resume().catch(() => {})
}
function audioUpdate() {
  $('sound').textContent = muted ? 'Som: desligado' : 'Som: ligado'
  $('sound').setAttribute('aria-pressed', String(!muted))
  if (!audio) return
  master.gain.setTargetAtTime(!muted && state === 'race' && !paused && inView && !document.hidden ? .2 : 0, audio.currentTime, .04)
  const speed = race.speeds[0] / 26, formula = selections[0] === 'mclaren'
  engine.frequency.setTargetAtTime((formula ? 100 : 46) + speed * (formula ? 260 : 140), audio.currentTime, .04)
  engineFilter.frequency.setTargetAtTime(380 + speed * 1200, audio.currentTime, .04)
}
function tone(freq, duration = .12) {
  if (!audio || muted) return
  const osc = audio.createOscillator(), gain = audio.createGain(), now = audio.currentTime
  osc.frequency.value = freq; gain.gain.setValueAtTime(.3, now); gain.gain.exponentialRampToValueAtTime(.001, now+duration)
  osc.connect(gain).connect(master); osc.start(); osc.stop(now+duration)
}
function clearKeys() { keys.clear(); document.querySelectorAll('.pressed').forEach(b=>b.classList.remove('pressed')) }
function setPause(value) {
  if (state !== 'race') return
  paused = value; clearKeys(); $('pause').textContent = paused ? 'Continuar' : 'Pausar'
  updateHud(); audioUpdate()
}
function errorScreen(error) {
  state = 'error'; clearKeys(); audioUpdate()
  $('garage').hidden = true; $('race-hud').hidden = true; $('center').hidden = true
  $('loading').hidden = false; $('loading').querySelector('strong').textContent = 'Não foi possível abrir a corrida'
  $('load-message').textContent = error.message || 'Verifique a conexão e tente novamente.'
  $('load-progress').hidden = true; $('retry').hidden = false
  console.error('Era Racing:', error)
}
const loader = new GLTFLoader()
function loadModel(key) {
  if (!cache.has(key)) {
    cache.set(key, loader.loadAsync(`./assets/${key}.glb`, event => {
      if (event.total) $('load-progress').value = Math.round(event.loaded/event.total*100)
    }).then(gltf => {
      gltf.scene.traverse(obj => {
        if (!obj.isMesh) return
        obj.castShadow = key !== 'circuit'; obj.receiveShadow = true
        for (const material of Array.isArray(obj.material) ? obj.material : [obj.material]) {
          // Imported Blender metallics need some diffuse response under the web lighting.
          material.metalness = Math.min(material.metalness ?? 0, .65)
          material.roughness = Math.max(material.roughness ?? .4, .25)
        }
      })
      return gltf.scene
    }).catch(error => { cache.delete(key); throw error }))
  }
  return cache.get(key)
}
async function chooseCars() {
  const token = ++selectionToken
  $('start').disabled = true
  $('start').textContent = 'CARREGANDO…'
  try {
    const models = await Promise.all(selections.map(loadModel))
    if (token !== selectionToken) return
    racers.forEach(obj=>scene.remove(obj))
    racers = models.map(model=>model.clone(true))
    racers.forEach(obj=>scene.add(obj)); positionCars()
    $('start').disabled = false; $('start').textContent = 'CORRER →'
  } catch (error) { if (token === selectionToken) errorScreen(error) }
}
function positionCars() {
  racers.forEach((obj,i) => {
    const [x,y] = trackPosition(race.progress[i], race.lanes[i])
    // glTF exports Blender Z-up as Y-up: (x,y,z) -> (x,z,-y).
    obj.position.set(x,.025,-y)
    obj.rotation.y = heading(race.progress[i],race.lanes[i])-Math.PI/2+race.yawOffsets[i]
  })
}
function positionCamera(dt, snap = false) {
  const target = new THREE.Vector3(), eye = new THREE.Vector3()
  if (state === 'menu' || state === 'loading') {
    target.set(36,innerWidth<=640 ? -2 : .7,0); eye.set(47,7.3,-12)
  } else {
    const [x,y] = trackPosition(race.progress[0],race.lanes[0]), angle = heading(race.progress[0],race.lanes[0])
    const fx=Math.cos(angle), fy=Math.sin(angle), [distance,height,look,side]=cameraModes[mode]
    const factor = mode===4 ? 1 : zoom
    eye.set(x-fx*distance*factor+fy*side*factor,height*factor,-(y-fy*distance*factor-fx*side*factor))
    target.set(x+fx*look,mode===4 ? height+.04 : .75,-(y+fy*look))
  }
  camera.position.lerp(eye,snap ? 1 : 1-Math.exp(-12*dt)); camera.lookAt(target)
}
function menu() {
  state='menu'; paused=false; clearKeys(); race=new Duel(); $('garage').hidden=false; $('race-hud').hidden=true; $('center').hidden=true
  audioUpdate(); positionCars(); positionCamera(0,true)
}
function start() {
  if ($('start').disabled || state==='loading' || state==='error') return
  audioInit()
  race=new Duel(Number($('laps').value),Number($('difficulty').value),selections)
  state='race'; countdown=3; paused=false; clearKeys(); lastImpact=0
  $('garage').hidden=true; $('race-hud').hidden=false; $('pause').textContent='Pausar'
  positionCars(); positionCamera(0,true); canvas.focus({preventScroll:true}); updateHud(); audioUpdate()
}
function updateHud() {
  if (state!=='race' && state!=='result') return
  $('speed').textContent = String(Math.round(race.speeds[0]*3.6))
  $('place').textContent = `${race.position}º`; $('lap').textContent = `${race.lap} / ${race.laps}`; $('time').textContent = race.elapsed.toFixed(1)
  $('notice').textContent = race.spinRemaining[0]>0 ? 'Derrapagem! Recuperando o controle…' : race.offroad ? 'Fora da pista' : ''
  let title='', detail=''
  if (state==='result') { title=race.place===1 ? 'VITÓRIA!' : '2º LUGAR'; detail=`${race.laps} volta(s) em ${race.elapsed.toFixed(2)} segundos` }
  else if (paused) { title='PAUSADO'; detail='Continue quando estiver pronto.' }
  else if (countdown>0) title=String(Math.ceil(countdown))
  else if (race.elapsed<.7) title='VAI!'
  $('center').hidden=!title; $('center-title').textContent=title; $('center-detail').textContent=detail
  $('resume').hidden=!paused; $('again').hidden=state!=='result'
}
function animate(now) {
  const dt=Math.min(.05,(now-last)/1000 || 0); last=now
  if (!inView || document.hidden) return
  if (state==='race' && !paused) {
    if (countdown>0) { const before=Math.ceil(countdown); countdown=Math.max(0,countdown-dt); if(Math.ceil(countdown)<before) tone(countdown===0 ? 880 : 440) }
    else {
      race.step(dt,keys.has('ArrowUp') || keys.has('KeyW'),keys.has('ArrowDown') || keys.has('KeyS') || keys.has('Space'),Number(keys.has('ArrowRight') || keys.has('KeyD'))-Number(keys.has('ArrowLeft') || keys.has('KeyA')))
      if (race.impactCount>lastImpact) { lastImpact=race.impactCount; tone(75,.2) }
      if (race.finished) { state='result'; clearKeys() }
    }
  }
  positionCars(); positionCamera(dt); updateHud(); audioUpdate(); renderer.render(scene,camera)
}
function resize() {
  const width=innerWidth,height=innerHeight
  renderer.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(pointer:coarse)').matches ? 1 : 1.5))
  renderer.setSize(width,height,false); camera.aspect=width/height; camera.updateProjectionMatrix()
}

$('retry').onclick=()=>location.reload()
$('sound').onclick=()=>{ audioInit(); muted=!muted; audioUpdate() }
$('start').onclick=()=>{ muted=false; start() }
$('again').onclick=start
$('resume').onclick=()=>setPause(false)
$('pause').onclick=()=>setPause(!paused)
$('menu').onclick=menu
$('camera').onclick=()=>{mode=(mode+1)%cameraModes.length;positionCamera(0,true)}
for (const [i,id] of ['player','rival'].entries()) {
  for (const vehicle of VEHICLES) { const option=new Option(`${vehicle.name} · ${vehicle.era}`,vehicle.id); $(id).add(option) }
  $(id).value=selections[i]
  $(id).onchange=()=>{selections[i]=$(id).value;chooseCars()}
}
const controls=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space','KeyC','KeyV','KeyP','KeyR','Escape'])
addEventListener('keydown',event=>{
  if (event.target instanceof HTMLSelectElement || state==='menu' || state==='loading') return
  if (!controls.has(event.code)) return
  event.preventDefault(); if (event.repeat) return
  if(event.code==='KeyP'){setPause(!paused);return}
  if(event.code==='Escape'){menu();return}
  if(event.code==='KeyR'){start();return}
  if(event.code==='KeyC'||event.code==='KeyV'){mode=(mode+(event.code==='KeyC'?1:5))%6;positionCamera(0,true);return}
  if(!paused && state==='race') keys.add(event.code)
},{passive:false})
addEventListener('keyup',event=>keys.delete(event.code))
addEventListener('blur',()=>{clearKeys();setPause(true)})
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearKeys();setPause(true)}audioUpdate()})
addEventListener('message',event=>{if(event.source!==parent || event.data?.type!=='era-racing-visibility')return;inView=!!event.data.visible;if(!inView)setPause(true);audioUpdate()})
for(const button of document.querySelectorAll('[data-key]')){
  button.addEventListener('pointerdown',event=>{event.preventDefault();if(paused||state!=='race')return;button.setPointerCapture(event.pointerId);keys.add(button.dataset.key);button.classList.add('pressed');audioInit()})
  const release=()=>{keys.delete(button.dataset.key);button.classList.remove('pressed')}
  button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release)
}
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();errorScreen(new Error('O navegador interrompeu o gráfico 3D. Toque em tentar novamente.'))})
addEventListener('pagehide',()=>{renderer?.setAnimationLoop(null);audio?.close().catch(()=>{})})

try {
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'})
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap
  scene=new THREE.Scene();scene.background=new THREE.Color('#aac8da');scene.fog=new THREE.Fog('#aac8da',160,700)
  camera=new THREE.PerspectiveCamera(55,1,.1,1500)
  const hemi=new THREE.HemisphereLight(0xd9edff,0x75855c,2.3);scene.add(hemi)
  const sun=new THREE.DirectionalLight(0xffedce,3);sun.position.set(-35,65,30);sun.castShadow=true
  sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-55;sun.shadow.camera.right=55;sun.shadow.camera.top=42;sun.shadow.camera.bottom=-42;sun.shadow.camera.far=160;sun.shadow.normalBias=.025
  scene.add(sun);scene.add(sun.target)
  resize();addEventListener('resize',resize);positionCamera(0,true);renderer.setAnimationLoop(animate)
  $('load-message').textContent='Carregando a pista do Blender…'
  scene.add((await loadModel('circuit')).clone(true))
  $('load-message').textContent='Preparando Fusca e Fórmula 1…'
  await chooseCars()
  if(state!=='error'){ $('loading').hidden=true;menu() }
} catch(error) {errorScreen(error)}
