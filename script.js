// 20A — MOBILE NAVIGATION --------------------------------------------------
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

navToggle?.addEventListener('click', () => {
  const open = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  siteNav.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

// 20B — INTERACTIVE PHOTOGRAPHIC ANATOMY ----------------------------------
const anatomyStage = document.querySelector('#anatomy-stage');
const partButtons = [...document.querySelectorAll('.part-button')];
const anatomyParts = ['upper', 'insole', 'gemming', 'welt', 'filler', 'shank', 'outsole', 'heel'];
const anatomyPrimaryImage = 'assets/gyw-anatomy.webp?v=20260815-1750';
const anatomyFallbackImage = 'assets/layers/whole-system.webp?v=20260815-1750';

function setAnatomyImageSource(image) {
  image.onerror = () => {
    image.onerror = null;
    image.src = anatomyFallbackImage;
  };
  image.src = anatomyPrimaryImage;
}

if (anatomyStage) {
  anatomyStage.querySelectorAll('.anatomy-photo-base, .anatomy-photo-overlay, .photo-layer, .anatomy-current-label').forEach((node) => node.remove());

  const baseImage = document.createElement('img');
  baseImage.className = 'anatomy-photo-base';
  baseImage.alt = 'Exploded Goodyear welt shoe showing the upper, insole, gemming, welt, filler, shank, outsole and heel';
  baseImage.decoding = 'async';
  setAnatomyImageSource(baseImage);
  anatomyStage.appendChild(baseImage);

  anatomyParts.forEach((part) => {
    const layerImage = document.createElement('img');
    layerImage.className = `anatomy-photo-overlay anatomy-photo-overlay--${part}`;
    layerImage.dataset.part = part;
    layerImage.alt = '';
    layerImage.decoding = 'async';
    layerImage.setAttribute('aria-hidden', 'true');
    setAnatomyImageSource(layerImage);
    anatomyStage.appendChild(layerImage);
  });

  const label = document.createElement('div');
  label.className = 'anatomy-current-label';
  label.textContent = 'Whole system';
  anatomyStage.appendChild(label);
}

const anatomyBaseImage = document.querySelector('#anatomy-stage .anatomy-photo-base');
const anatomyPhotoLayers = [...document.querySelectorAll('#anatomy-stage .anatomy-photo-overlay')];
const anatomyLabel = document.querySelector('#anatomy-stage .anatomy-current-label');

function showPart(part) {
  const showAll = part === 'all';

  partButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.part === part);
  });

  anatomyStage?.classList.toggle('is-filtered', !showAll);

  anatomyPhotoLayers.forEach((layer) => {
    layer.classList.toggle('is-active', !showAll && layer.dataset.part === part);
  });

  if (anatomyBaseImage) {
    anatomyBaseImage.alt = showAll
      ? 'Exploded Goodyear welt shoe showing all construction layers'
      : `Exploded Goodyear welt shoe with the ${part} highlighted`;
  }

  if (anatomyLabel) {
    const activeButton = partButtons.find((button) => button.dataset.part === part);
    anatomyLabel.textContent = activeButton?.querySelector('strong')?.textContent || 'Whole system';
  }
}

partButtons.forEach((button) => {
  button.addEventListener('click', () => showPart(button.dataset.part));
});

showPart('all');

// 20C — PROCESS SCROLL PROGRESS -------------------------------------------
const processShell = document.querySelector('.process-shell');
const processFill = document.querySelector('#process-progress-fill');

function updateProcessProgress() {
  if (!processShell || !processFill) return;
  const rect = processShell.getBoundingClientRect();
  const viewportMarker = window.innerHeight * 0.55;
  const total = rect.height + window.innerHeight * 0.25;
  const travelled = viewportMarker - rect.top;
  const pct = Math.max(0, Math.min(1, travelled / total));
  processFill.style.height = `${pct * 100}%`;
}

window.addEventListener('scroll', updateProcessProgress, { passive: true });
window.addEventListener('resize', updateProcessProgress);
updateProcessProgress();

// 20D — CONSTRUCTION COMPARISON DATA --------------------------------------
const compareData = {
  blake: {
    title: 'Goodyear welt vs Blake stitch',
    body: 'Blake construction uses a stitch that passes from inside the shoe through the insole and outsole. It can make a slimmer, lighter and more flexible shoe. It is still repairable, but resoling uses a different technique and typically requires access or machinery suited to the internal stitch.',
    scores: { 'Sleek profile': 92, 'Early flexibility': 88, 'Simple resole access': 52, 'Wet-weather margin': 50 }
  },
  cemented: {
    title: 'Goodyear welt vs cemented',
    body: 'Cemented construction bonds the sole with adhesive instead of a structural stitch. It is not synonymous with “cheap”: modern adhesives permit light, waterproof-looking and technically complex footwear. Repairability depends heavily on the sole unit, materials and whether separation can be done cleanly.',
    scores: { 'Low weight': 92, 'Design freedom': 96, 'Low build cost': 88, 'Repeat rebuild potential': 35 }
  },
  handwelt: {
    title: 'Machine Goodyear vs hand welt',
    body: 'The key difference is usually at the insole. Modern Goodyear production commonly sews into a prepared rib or gemming attached beneath the insole. Hand-welted work can carve a holdfast directly from a thick leather insole and sew the inseam by hand. Both use a welt-and-outsole architecture.',
    scores: { 'Hand labour': 100, 'Traditional craft': 100, 'Repair potential': 95, 'Production speed': 20 }
  },
  stitchdown: {
    title: 'Goodyear welt vs stitchdown',
    body: 'In stitchdown construction the upper itself is turned outward and stitched down to the sole or midsole platform. There is no separate welt doing that job. The wide flange can make rugged footwear and gives a distinctive visual edge.',
    scores: { 'Ruggedness': 92, 'Broad platform': 94, 'Separate welt': 0, 'Repair potential': 78 }
  }
};

const comparePanel = document.querySelector('#compare-panel');
const compareTabs = [...document.querySelectorAll('.compare-tab')];

function renderCompare(key) {
  const data = compareData[key];
  if (!data || !comparePanel) return;
  comparePanel.innerHTML = `
    <div><p class="kicker">Side by side</p><h3>${data.title}</h3><p>${data.body}</p></div>
    <div class="compare-score">${Object.entries(data.scores).map(([label, score]) => `
      <div class="score-row"><span>${label}</span><div class="score-track"><span style="width:${score}%"></span></div><strong>${score}</strong></div>`).join('')}
    </div>`;
  compareTabs.forEach((tab) => {
    const active = tab.dataset.compare === key;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
}

compareTabs.forEach((tab) => tab.addEventListener('click', () => renderCompare(tab.dataset.compare)));
renderCompare('blake');

// 20E — GLOSSARY FILTER ----------------------------------------------------
const glossarySearch = document.querySelector('#glossary-search');
const glossaryEntries = [...document.querySelectorAll('#glossary-list > div')];

glossarySearch?.addEventListener('input', () => {
  const query = glossarySearch.value.trim().toLowerCase();
  glossaryEntries.forEach((entry) => entry.classList.toggle('is-hidden', query && !entry.textContent.toLowerCase().includes(query)));
});

// 20F — MINI QUIZ ----------------------------------------------------------
const quizQuestions = [
  {
    q: 'What is the welt’s main structural role?',
    options: ['It cushions the heel', 'It forms an intermediary between the upper/insole assembly and outsole', 'It waterproofs the leather', 'It replaces the insole'],
    answer: 1,
    why: 'The welt is the separate strip sewn into the inseam and then used as the attachment point for the outsole.'
  },
  {
    q: 'Which seam is normally opened during a straightforward resole?',
    options: ['The upper closing seam', 'The inseam', 'The outsole stitch', 'The lining seam'],
    answer: 2,
    why: 'The outsole stitch joins outsole to welt. Leaving the inseam intact is what makes the normal repair relatively non-invasive.'
  },
  {
    q: 'Does visible stitching around a sole prove a shoe is Goodyear welted?',
    options: ['Always', 'Only on leather soles', 'No', 'Only if the stitches are brown'],
    answer: 2,
    why: 'Several other constructions can show edge stitching, and decorative stitching can imitate the look.'
  },
  {
    q: 'What is gemming in many modern Goodyear-welted shoes?',
    options: ['A polish', 'A canvas or similar rib attached beneath the insole', 'A heel nail pattern', 'A rubber top lift'],
    answer: 1,
    why: 'The rib provides a raised structure for the inseam to catch; hand-welted shoes may instead use a leather holdfast carved into the insole.'
  },
  {
    q: 'Which statement is safest?',
    options: ['Goodyear welted means waterproof', 'Goodyear welted guarantees premium leather', 'Goodyear welted describes a construction method, not overall quality', '360° welt is always superior'],
    answer: 2,
    why: 'A construction method can support longevity, but overall quality still depends on materials, fit, patterning, workmanship and quality control.'
  }
];

const quizBox = document.querySelector('#quiz-box');
let quizIndex = 0;
let quizScore = 0;
let quizLocked = false;

function renderQuiz() {
  if (!quizBox) return;
  if (quizIndex >= quizQuestions.length) {
    quizBox.innerHTML = `<p class="quiz-progress">Complete</p><h3 class="quiz-question">${quizScore} / ${quizQuestions.length}</h3><p class="quiz-explanation">${quizScore === quizQuestions.length ? 'You can now explain the construction without pointing vaguely at the stitching.' : 'Good start. The anatomy and two-seam sections above contain every answer.'}</p><button class="quiz-next" type="button" id="quiz-restart">Run it again</button>`;
    document.querySelector('#quiz-restart')?.addEventListener('click', () => { quizIndex = 0; quizScore = 0; renderQuiz(); });
    return;
  }

  quizLocked = false;
  const item = quizQuestions[quizIndex];
  quizBox.innerHTML = `<p class="quiz-progress">Question ${quizIndex + 1} of ${quizQuestions.length}</p><h3 class="quiz-question">${item.q}</h3><div class="quiz-options">${item.options.map((option, i) => `<button class="quiz-option" data-index="${i}" type="button">${option}</button>`).join('')}</div><p class="quiz-explanation" hidden></p><button class="quiz-next" type="button" hidden>Next question</button>`;
  quizBox.querySelectorAll('.quiz-option').forEach((button) => button.addEventListener('click', () => answerQuiz(Number(button.dataset.index))));
}

function answerQuiz(choice) {
  if (quizLocked || !quizBox) return;
  quizLocked = true;
  const item = quizQuestions[quizIndex];
  if (choice === item.answer) quizScore += 1;

  quizBox.querySelectorAll('.quiz-option').forEach((button, index) => {
    if (index === item.answer) button.classList.add('correct');
    else if (index === choice) button.classList.add('wrong');
    button.disabled = true;
  });

  const explanation = quizBox.querySelector('.quiz-explanation');
  explanation.hidden = false;
  explanation.textContent = item.why;

  const next = quizBox.querySelector('.quiz-next');
  next.hidden = false;
  next.addEventListener('click', () => { quizIndex += 1; renderQuiz(); }, { once: true });
}

renderQuiz();