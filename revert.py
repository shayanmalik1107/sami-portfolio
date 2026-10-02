import re

with open('app.js', 'r') as f:
    app = f.read()

# Fix video playback (remove encodeURI)
app = app.replace('video.src = encodeURI(url);', 'video.src = url;')
app = app.replace('const videoSrc = p.video ? encodeURI(p.video) : \'\';', 'const videoSrc = p.video ? p.video : \'\';')


# Replace process section logic
old_process = """// Editing Process Stages
const stages = [
  ['Raw', 'Review the footage, find the strongest moments, and choose the material that serves the story.'],
  ['Structure', 'Build the narrative and shape its pace. Every cut brings the story a little closer to its audience.'],
  ['Sound', 'Match music, dialogue, and sound design to the rhythm of the edit.'],
  ['Motion', 'Bring titles, transitions, and visual details to life with purposeful movement.'],
  ['Color', 'Balance the footage and create a consistent look that supports the mood.'],
  ['Delivery', 'Check the final cut and export it in the right format for its destination.']
];

const process = $('#process'), track = $('#process-track');
stages.forEach((s, i) => {
  const slide = document.createElement('article');
  slide.className = 'process-slide';
  slide.innerHTML = `<span class="stage-number">0${i + 1}</span><div class="process-copy"><h3>${s[0]}</h3><p>${s[1]}</p></div><div class="process-visual ${s[0].toLowerCase()}"></div>`;
  const v = slide.querySelector('.process-visual');
  if (i === 0) v.innerHTML = '<div class="clip" style="transform: rotate(-3deg);">CLIP_01.MP4</div><div class="clip" style="transform: rotate(2deg);">CLIP_02.MP4</div><div class="clip" style="transform: rotate(-1deg);">CLIP_03.MP4</div>';
  if (i === 1) v.innerHTML = '<div class="structure"><div class="sequence-row"><i style="flex:2"></i><i style="flex:1"></i><i style="flex:3"></i></div><div class="sequence-row"><i style="flex:1; background:var(--red)"></i><i style="flex:4"></i></div><div class="sequence-row"><i style="flex:3"></i><i style="flex:1.5; background:var(--red)"></i></div></div>';
  if (i === 2) {
    const wave = document.createElement('div'); wave.className = 'sound-wave';
    for(let j=0; j<15; j++) {
      const h = 20 + Math.random() * 80;
      wave.innerHTML += `<div class="wave" style="--h: ${h}%"></div>`;
    }
    const play = document.createElement('button'); play.className = 'sound-preview'; play.textContent = '▶ PREVIEW SOUND';
    play.onclick = async () => {
      const Audio = window.AudioContext || window.webkitAudioContext; if (!Audio) return;
      const ctx = new Audio(); await ctx.resume();
      const duration = .75, buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate), data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) { const t = j / data.length; data[j] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * .28; }
      const source = ctx.createBufferSource(); source.buffer = buffer;
      const filter = ctx.createBiquadFilter(); filter.type = 'bandpass';
      filter.frequency.setValueAtTime(160, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + .4);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + duration);
      source.connect(filter); filter.connect(ctx.destination); source.start();
      play.textContent = 'PLAYING / WHOOSH'; v.classList.add('playing');
      source.onended = () => { play.textContent = '▶ PREVIEW SOUND'; v.classList.remove('playing'); ctx.close(); };
    };
    v.append(wave, play);
  }
  if (i === 3) v.innerHTML = '<div class="motion-demo"><div class="motion-word">MAKE<br>IT MOVE.</div><div class="motion-keyframes"><i></i><i></i><i></i><span></span></div><span class="mono">POSITION / SCALE / EASING</span></div>';
  if (i === 4) {
    const palettes = [['SHADOWS', ['#141426', '#29233f', '#453054', '#6b3b63']], ['MIDTONES', ['#542032', '#8c1a2e', '#c12b48', '#e75d72']], ['HIGHLIGHTS', ['#b97252', '#d69572', '#e8bc99', '#f3dfc3']]];
    palettes.forEach(([name, colors]) => {
      const row = document.createElement('div'); row.className = 'palette-row';
      row.innerHTML = `<span class="mono">${name}</span><div class="swatches">${colors.map(c => `<div style="background:${c}"></div>`).join('')}</div>`;
      v.append(row);
    });
  }
  if (i === 5) v.innerHTML = '<div class="export-wrap"><div class="mono label">EXPORT_MASTER.MP4</div><div class="export-progress-bar"><div class="fill"></div></div><div class="mono status">RENDER COMPLETE / 100%</div></div>';
  track.append(slide);
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', 'Go to ' + s[0]);
  dot.onclick = () => {
    const range = process.offsetHeight - innerHeight;
    window.scrollTo({ top: process.offsetTop + range * i / 5, behavior: 'smooth' });
  };
  $('#process-dots').append(dot);
});

function updateProcess() {"""

# Replace from // Editing Process Stages to function updateProcess() {
app = re.sub(r'// Editing Process Stages.*?function updateProcess\(\) {', old_process, app, flags=re.DOTALL)

with open('app.js', 'w') as f:
    f.write(app)

