const cfg = window.portfolio;
const $ = s => document.querySelector(s);

// Render Name
document.querySelectorAll('[data-name]').forEach(e => e.textContent = cfg.name);
const parts = cfg.name.split(' ');
$('h1').replaceChildren();
parts.forEach((v, i) => {
  const s = document.createElement('span');
  s.textContent = v + (i === parts.length - 1 ? '.' : '');
  if (i) s.className = 'outline';
  $('h1').append(s);
  if (i < parts.length - 1) $('h1').append(document.createElement('br'));
});
document.title = cfg.name + ' — Video Editor';

// Render Portrait Image (sami.png)
if (cfg.portrait) {
  const img = new Image();
  img.src = cfg.portrait;
  img.alt = cfg.name;
  img.className = 'portrait-img';
  const label = $('.portrait-label');
  if (label) {
    label.replaceWith(img);
  }
}

// Navigation Menu Toggle
const menu = $('#menu'), nav = $('#navigation');
function toggleMenu(open) {
  menu.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
}
menu.onclick = () => toggleMenu(nav.hidden);
nav.querySelectorAll('a').forEach(a => a.onclick = () => toggleMenu(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

// Video Modal Dialog
const dialog = $('#player');
$('.close').onclick = () => dialog.close();
dialog.addEventListener('close', () => { $('#playercontent').replaceChildren(); });
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function showVideo(url, title) {
  const area = $('#playercontent');
  area.replaceChildren();
  if (url) {
    const ytId = getYoutubeId(url);
    if (ytId) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.aspectRatio = '16 / 9';
      area.append(iframe);
    } else {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      area.append(video);
      video.play().catch(() => {});
    }
  } else {
    const box = document.createElement('div');
    box.className = 'empty-player';
    const h = document.createElement('h3');
    h.textContent = title;
    const p = document.createElement('p');
    p.textContent = 'This video is coming soon. A placeholder is ready for the final edit.';
    box.append(h, p);
    area.append(box);
  }
  dialog.showModal();
}// Top Showreel Video Setup (Loop 3-second highlight continuously)
const reelBtn = $('[data-video="reel"]');
if (reelBtn) {
  reelBtn.onclick = () => showVideo(cfg.reel, 'Showreel Master Cut');
  const reelBgVid = reelBtn.querySelector('.reel-bg-video');
  const reelFgVid = reelBtn.querySelector('.reel-fg-video');
  const vids = [reelBgVid, reelFgVid].filter(Boolean);

  vids.forEach(v => {
    v.muted = true;
    v.play().catch(() => {});
  });

  if (reelBgVid) {
    reelBgVid.addEventListener('timeupdate', () => {
      if (reelBgVid.currentTime >= 3) {
        vids.forEach(v => { v.currentTime = 0; });
      }
    });
  }
}

// Project Video Cards Rendering with Dual-Layer Ambient Blur & 3-Second Hover Preview
cfg.projects.forEach((p, i) => {
  const button = document.createElement('button');
  button.className = 'project';
  button.setAttribute('aria-label', 'View ' + p.brand + ' project');
  
  const videoSrc = p.video ? p.video : '';
  const ytId = getYoutubeId(videoSrc);
  const thumbStyle = ytId ? `style="background-image: url('https://img.youtube.com/vi/${ytId}/maxresdefault.jpg'); background-size: cover; background-position: center;"` : '';
  
  button.innerHTML = `
    <div class="thumb media" ${thumbStyle}>
      ${!ytId && videoSrc ? `
        <video src="${videoSrc}" muted playsinline preload="metadata" class="card-bg-video"></video>
        <video src="${videoSrc}" muted playsinline preload="metadata" class="card-fg-video"></video>
      ` : ''}
      <span class="play">▶</span>
    </div>
    <div class="project-meta-row">
      <span class="brand-label">${p.brand.toUpperCase()}</span>
      <span class="category">${p.category}</span>
    </div>
    <h3>${p.title}</h3>
  `;

  const bgVid = button.querySelector('.card-bg-video');
  const fgVid = button.querySelector('.card-fg-video');
  const vids = [bgVid, fgVid].filter(Boolean);
  let hoverTimeout = null;

  if (vids.length > 0) {
    button.addEventListener('mouseenter', () => {
      vids.forEach(v => {
        v.currentTime = 0;
        v.classList.add('active');
        v.play().catch(() => {});
      });

      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        vids.forEach(v => {
          v.pause();
          v.currentTime = 0;
          v.classList.remove('active');
        });
      }, 3000);
    });

    button.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout);
      vids.forEach(v => {
        v.pause();
        v.currentTime = 0;
        v.classList.remove('active');
      });
    });

    if (fgVid) {
      fgVid.addEventListener('timeupdate', () => {
        if (fgVid.currentTime >= 3 && fgVid.classList.contains('active')) {
          clearTimeout(hoverTimeout);
          vids.forEach(v => {
            v.pause();
            v.currentTime = 0;
            v.classList.remove('active');
          });
        }
      });
    }
  }

  button.onclick = () => showVideo(p.video, p.brand + ' / ' + p.title);
  $('#projects').append(button);
});

// Editing Process Stages
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
  if (i === 0) v.innerHTML = '<div class="raw-grid"><div class="raw-card"></div><div class="raw-card"></div><div class="raw-card"></div><div class="raw-card"></div><div class="raw-card"></div></div>';
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
  if (i === 5) {
    const ytId = getYoutubeId(cfg.reel);
    const thumbStyle = ytId ? `style="aspect-ratio: 16/9; width: 100%; border-radius: 8px; overflow: hidden; position: relative; background-image: url('https://img.youtube.com/vi/${ytId}/maxresdefault.jpg'); background-size: cover; background-position: center;"` : `style="aspect-ratio: 16/9; width: 100%; border-radius: 8px; overflow: hidden; position: relative;"`;
    const videoHtml = ytId ? '' : `<video src="${cfg.reel}" muted playsinline class="card-bg-video"></video>`;
    
    v.innerHTML = `<div class="export-wrap" style="width: 100%;"><div class="thumb media" ${thumbStyle}>${videoHtml}<span class="play">▶</span></div><div class="mono status" style="margin-top:20px;">READY FOR DELIVERY</div></div>`;
  }
  track.append(slide);
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', 'Go to ' + s[0]);
  dot.onclick = () => {
    const range = process.offsetHeight - innerHeight;
    window.scrollTo({ top: process.offsetTop + range * i / 5, behavior: 'smooth' });
  };
  $('#process-dots').append(dot);
});

function updateProcess() {
  const range = process.offsetHeight - innerHeight;
  const progress = Math.min(1, Math.max(0, (scrollY - process.offsetTop) / Math.max(1, range)));
  track.style.transform = 'translate3d(' + (-progress * (track.scrollWidth - innerWidth)) + 'px,0,0)';
  // Update HUD
  const index = Math.min(5, Math.floor(progress * 5.5));
  $('#process-label').textContent = '0' + (index + 1) + ' / ' + stages[index][0].toUpperCase();
  document.querySelectorAll('#process-dots button').forEach((d, i) => {
    d.classList.toggle('active', i === index);
    d.setAttribute('aria-current', i === index ? 'step' : 'false');
  });
}
window.addEventListener('scroll', updateProcess, { passive: true });
window.addEventListener('resize', updateProcess);
updateProcess();

// Ease wheel movement while retaining native scrolling
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)'); let scrollTarget = scrollY, scrollFrame = 0;
function easeScroll() {
  const gap = scrollTarget - scrollY;
  if (Math.abs(gap) < .7) { window.scrollTo({ top: scrollTarget, behavior: 'instant' }); scrollFrame = 0; return; }
  window.scrollTo({ top: scrollY + gap * .14, behavior: 'instant' });
  scrollFrame = requestAnimationFrame(easeScroll);
}
window.addEventListener('wheel', e => {
  if (reduceMotion.matches || dialog.open || !nav.hidden || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  e.preventDefault();
  if (!scrollFrame) scrollTarget = scrollY;
  const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
  scrollTarget = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, scrollTarget + delta));
  if (!scrollFrame) scrollFrame = requestAnimationFrame(easeScroll);
}, { passive: false });

function cancelEasing() { cancelAnimationFrame(scrollFrame); scrollFrame = 0; scrollTarget = scrollY; }
window.addEventListener('touchstart', cancelEasing, { passive: true });
window.addEventListener('keydown', cancelEasing);
document.addEventListener('click', cancelEasing);

$('#contactbutton').onclick = (e) => {
  e.preventDefault();
  window.open(cfg.whatsapp || 'https://wa.me/923021403106', '_blank');
};

const sections = [...document.querySelectorAll('main section')];
const navLinks = [...document.querySelectorAll('.header-nav a')];

function scrollUpdate() {
  const ratio = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
  $('#progress').style.width = ratio * 100 + '%';
  const frames = Math.floor(ratio * 3000);
  $('#timecode').textContent = '00:' + String(Math.floor(frames / 1800)).padStart(2, '0') + ':' + String(Math.floor(frames / 30) % 60).padStart(2, '0') + ':' + String(frames % 30).padStart(2, '0');
  
  const current = sections.filter(s => s.getBoundingClientRect().top < innerHeight * 0.5).pop();
  const currentId = (current?.id || 'hero').replace('-intro', '');
  $('#sectionname').textContent = currentId.toUpperCase();

  // Highlight active header link
  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '').replace('-intro', '');
    link.classList.toggle('active', href === currentId);
  });
}
window.addEventListener('scroll', scrollUpdate, { passive: true });
scrollUpdate();

