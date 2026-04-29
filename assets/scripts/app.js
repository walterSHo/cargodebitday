(function () {
  const groupNames = ['АВТОХІМІЯ І ОЛИВИ','АМОРТИЗАЦІЯ','ГАЛЬМІВНА СИСТЕМА','ДВИГУН','ЕЛЕКТРИКА','ОХОЛОДЖЕННЯ','ПІДВІСКА','ПНЕВМАТИКА','СИСТЕМА ЗЧЕПЛЕННЯ','ТРАНСМІСІЯ','ФІЛЬТР','PROFIT / JOKER'];
  const groupsBody = document.querySelector('#groupsTable tbody');
  const groupCells = [];
  const groupInputs = [];
  groupNames.forEach((name, i) => {
    const tr = document.createElement('tr');
    tr.className = 'group-row fail';
    tr.innerHTML = `<td>${name}</td>
      <td><input type="number" min="0" max="200" step="0.1" data-g="${i}" data-m="1" value="0"></td>
      <td><input type="number" min="0" max="200" step="0.1" data-g="${i}" data-m="2" value="0"></td>
      <td><input type="number" min="0" max="200" step="0.1" data-g="${i}" data-m="3" value="0"></td>
      <td class="mono" data-avg="${i}">0.00%</td>
      <td data-progress="${i}"><div class="progress-track"><div class="progress-fill" style="width:0%"></div></div></td>
      <td data-ok="${i}"><span class="pill-no">Не виконано</span></td>`;
    groupsBody.appendChild(tr);
    groupInputs.push(...tr.querySelectorAll('input'));
    groupCells.push({
      avg: tr.querySelector(`[data-avg="${i}"]`),
      ok: tr.querySelector(`[data-ok="${i}"]`),
      progress: tr.querySelector('.progress-fill'),
      row: tr
    });
  });

  const byId = (id) => document.getElementById(id);
  const money = (v) => `${new Intl.NumberFormat('uk-UA',{maximumFractionDigits:2}).format(v)} ₴`;
  const eur = (v) => `${new Intl.NumberFormat('uk-UA',{maximumFractionDigits:2}).format(v)} EUR`;
  const num = (id) => { const v = parseNumber(byId(id).value); return Number.isFinite(v) ? v : 0; };
  const clamp = (n,min,max) => Math.max(min, Math.min(max, n));

  // Delay calculator (existing)
  const form = byId('calcForm'), debtInput = byId('debt'), turnoverInput = byId('turnover'), daysInput = byId('days');
  const coefOut = byId('coefOut'), daysOut = byId('daysOut'), status = byId('status'), clearBtn = byId('clearBtn'), copyBtn = byId('copyBtn');
  const exampleInputs = [debtInput, turnoverInput, daysInput];
  let lastResult = '';
  function setStatus(msg, type){ status.textContent = msg || ''; status.className = 'status' + (type ? ' ' + type : ''); }
  function parseNumber(v){
    const normalized = String(v).replace(/[\s\u00A0]/g, '').replace(/,/g, '.');
    const value = Number(normalized);
    return Number.isFinite(value) ? value : Number.NaN;
  }
  function refreshExampleState(input){ input.classList.toggle('is-example', Boolean(input.dataset.example && input.value.trim() === input.dataset.example)); }
  function calculateDelay(){
    const debt = parseNumber(debtInput.value.trim()), turnover = parseNumber(turnoverInput.value.trim()), days = parseNumber(daysInput.value.trim());
    if (!debtInput.value.trim() || !turnoverInput.value.trim() || !daysInput.value.trim()) return setStatus('Будь ласка, заповніть усі поля.', 'error');
    if ([debt, turnover, days].some(Number.isNaN) || turnover === 0 || days <= 0 || debt < 0 || turnover < 0) { coefOut.textContent='Коефіцієнт: —'; daysOut.textContent='Середнє відтермінування: —'; return setStatus('Перевірте значення полів.', 'error'); }
    const c = debt / turnover, d = c * days;
    coefOut.textContent = `Коефіцієнт: ${c.toFixed(4)}`; daysOut.textContent = `Середнє відтермінування: ${d.toFixed(2)} днів`;
    lastResult = `${coefOut.textContent}\n${daysOut.textContent}`; setStatus('Розрахунок виконано успішно.', 'ok'); saveCalculatorState();
  }
  form.addEventListener('submit', (e)=>{ e.preventDefault(); calculateDelay(); });
  form.addEventListener('keydown', (e)=>{ if (e.key==='Enter'){ e.preventDefault(); calculateDelay(); }});
  exampleInputs.forEach((i)=>i.addEventListener('input', ()=>{ refreshExampleState(i); saveCalculatorState(); }));
  clearBtn.addEventListener('click', ()=>{ debtInput.value=''; turnoverInput.value=''; daysInput.value=''; exampleInputs.forEach(i=>i.classList.remove('is-example')); coefOut.textContent='Коефіцієнт: —'; daysOut.textContent='Середнє відтермінування: —'; setStatus('Поля очищено.','ok'); saveCalculatorState(); });
  copyBtn.addEventListener('click', async (e)=>{
    if(!lastResult) return setStatus('Немає результату для копіювання.','error');
    const ok = await copyToClipboard(lastResult);
    if (ok) { setStatus('✓ Скопійовано', 'ok'); blinkCopied(e.currentTarget); }
    else { setStatus('Не вдалося скопіювати. Спробуйте ще раз.', 'error'); }
  });

  // Motivation calculator
  const monthlyTable = byId('monthlyBreakdown'), quarterTable = byId('quarterBreakdown'), totalTable = byId('totalBreakdown');
  const monthTotalEl = byId('monthTotal'), quarterTotalEl = byId('quarterTotal'), allTotalEl = byId('allTotal');
  const motivationStatus = byId('motivationStatus'), rateStatus = byId('rateStatus');
  const monthlyHintsEl = byId('monthlyHints'), quarterHintsEl = byId('quarterHints');
  const printMeta = byId('printMeta');
  const easterCat = byId('easterCat');
  const easterCatBubble = byId('easterCatBubble');
  const groupsDoneCount = byId('groupsDoneCount'), groupsNextHint = byId('groupsNextHint');
  const errorSummary = byId('errorSummary');
  const summaryItems = Array.from(document.querySelectorAll('.summary-item'));
  const monthlySummaryCard = byId('monthlySummaryCard');
  const quarterSummaryCard = byId('quarterSummaryCard');
  const totalSummaryCard = byId('totalSummaryCard');
  const monthSummaryNote = byId('monthSummaryNote');
  const quarterSummaryNote = byId('quarterSummaryNote');
  const totalSummaryNote = byId('totalSummaryNote');
  const pdfKeyMetrics = byId('pdfKeyMetrics');
  const pdfMonthlyBreakdown = byId('pdfMonthlyBreakdown');
  const pdfQuarterBreakdown = byId('pdfQuarterBreakdown');
  const pdfTotalBreakdown = byId('pdfTotalBreakdown');
  const pdfMonthTotal = byId('pdfMonthTotal');
  const pdfQuarterTotal = byId('pdfQuarterTotal');
  const pdfAllTotal = byId('pdfAllTotal');
  const pdfTimestamp = byId('pdfTimestamp');
  const stickyAllTotal = byId('stickyAllTotal');
  const stickyMonthTotal = byId('stickyMonthTotal');
  const stickyQuarterTotal = byId('stickyQuarterTotal');
  const summaryMiniCard = document.querySelector('.summary-mini');
  const panelTime = byId('panelTime');
  const panelRate = byId('panelRate');
  const panelRateUpdated = byId('panelRateUpdated');

  function syncPanelTime(){
    if (!panelTime) return;
    panelTime.textContent = `Київ: ${new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Kyiv' })}`;
  }

  function syncPanelRate(state = 'muted'){
    if (!panelRate) return;
    const rate = parseNumber(byId('eurRate')?.value || '');
    panelRate.classList.remove('is-ok', 'is-muted', 'is-error');
    const tone = state === 'error' ? 'is-error' : state === 'ok' ? 'is-ok' : 'is-muted';
    panelRate.classList.add(tone);
    panelRate.textContent = Number.isFinite(rate) && rate > 0
      ? `Курс EUR/UAH: ${rate.toFixed(4)}`
      : 'Курс EUR/UAH: --';
    if (panelRateUpdated) {
      panelRateUpdated.classList.remove('is-ok', 'is-muted', 'is-error');
      panelRateUpdated.classList.add(tone);
      panelRateUpdated.textContent = `Оновлено: ${new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Kyiv' })}`;
    }
  }
  const touched = new Set();
  const priorityFields = new Set();
  const hintsMarkupCache = new WeakMap();
  const storageKey = 'cargo-calculator-state-v2';
  let previousSnapshot = null;
  let previousProgressSnapshot = null;
  let previousPdfSnapshot = '';
  let lastSavedStateRaw = '';
  let autosaveTimer = null;
  let motivationFrameId = 0;
  let catCycleTimer = null;
  let catResumeTimer = null;
  let catVisible = true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const catLiteMode = prefersReducedMotion.matches || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const catLines = [
    'Мрр. Я рахую бонуси лапками.',
    'Якщо що, я за зелені progress bar.',
    'Погладь ще раз і я принесу +1 до настрою.',
    'Сьогодні я чергую біля підказок.',
    'Не чіпаю розрахунки. Лише ходжу красиво.',
    'Бонуси пахнуть рибкою, перевірив.',
    'Мяу. Я тут відповідальний за настрій звіту.',
    'Обережно, лапа може натиснути “Перерахувати”.',
    'Я офіційно за план 110% і дрімоту після.',
    'Якщо цифри сумні — я підмуркну підтримку.',
    'Поки ти рахуєш, я охороняю “Загальну суму”.'
  ];
  const celebrationCatLines = [
    'Мяу. Усі групи вже в зеленій зоні.',
    'Пухнасто схвалюю: квартал сяє.',
    'Лапками підписую цей зелений результат.',
    'Уррра! Тепер можна премію і ковбаску.',
    'Квартал топ. Я вже святкую хвостом.'
  ];
  let catLineIndex = 0;
  const diagnosticsMode = new URLSearchParams(window.location.search).get('debug') === '1';
  const diagnosticsEl = byId('diagnostics');

  function row(label, value){ return `<tr><td>${label}</td><td class="mono">${value}</td></tr>`; }
  let motivationStatusTimer = null;
  let rateStatusTimer = null;
  function setMStatus(msg, type){ motivationStatus.textContent = msg || ''; motivationStatus.className = 'status' + (type ? ' ' + type : ''); clearTimeout(motivationStatusTimer); if (msg && type && type !== 'error') motivationStatusTimer = setTimeout(() => { motivationStatus.textContent = ''; motivationStatus.className = 'status'; }, 5200); }
  function setRateStatus(msg, type){ rateStatus.textContent = msg || ''; rateStatus.className = 'status' + (type ? ' ' + type : ''); clearTimeout(rateStatusTimer); if (msg && type && type !== 'error') rateStatusTimer = setTimeout(() => { rateStatus.textContent = ''; rateStatus.className = 'status'; }, 5200); }
  async function copyToClipboard(text){
    if (!text) return false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) {}

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.left = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return Boolean(ok);
    } catch (_) {
      return false;
    }
  }
  function blinkCopied(btn){
    if (!btn) return;
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1100);
  }
  function collectCalculatorState(){
    return {
      delay: {
        debt: debtInput.value,
        turnover: turnoverInput.value,
        days: daysInput.value
      },
      motivation: {
        planTurnover: byId('planTurnover').value,
        planPercent: byId('planPercent').value,
        avgDiscount: byId('avgDiscount').value,
        avgDelayFact: byId('avgDelayFact').value,
        overdue1: byId('overdue1').value,
        overdue2: byId('overdue2').value,
        overdue3: byId('overdue3').value,
        eurRate: byId('eurRate').value,
        tiresOver: byId('tiresOver').value,
        crmDone: byId('crmDone').checked,
        tiresMinMet: byId('tiresMinMet').checked,
        groups: Array.from(groupsBody.querySelectorAll('input')).map((input) => input.value)
      }
    };
  }
  function persistCalculatorState(){
    try {
      const nextRaw = JSON.stringify(collectCalculatorState());
      if (nextRaw === lastSavedStateRaw) return;
      localStorage.setItem(storageKey, nextRaw);
      lastSavedStateRaw = nextRaw;
    } catch (_) {}
  }
  function saveCalculatorState(options = {}){
    const immediate = Boolean(options.immediate);
    clearTimeout(autosaveTimer);
    if (immediate) {
      persistCalculatorState();
      return;
    }
    autosaveTimer = setTimeout(() => {
      persistCalculatorState();
    }, 260);
  }
  function restoreCalculatorState(){
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return false;
      lastSavedStateRaw = raw;
      const saved = JSON.parse(raw);
      if (saved.delay) {
        debtInput.value = saved.delay.debt ?? debtInput.value;
        turnoverInput.value = saved.delay.turnover ?? turnoverInput.value;
        daysInput.value = saved.delay.days ?? daysInput.value;
      }
      if (saved.motivation) {
        ['planTurnover','planPercent','avgDiscount','avgDelayFact','overdue1','overdue2','overdue3','eurRate','tiresOver'].forEach((id) => {
          if (saved.motivation[id] !== undefined) byId(id).value = saved.motivation[id];
        });
        if (typeof saved.motivation.crmDone === 'boolean') byId('crmDone').checked = saved.motivation.crmDone;
        if (typeof saved.motivation.tiresMinMet === 'boolean') byId('tiresMinMet').checked = saved.motivation.tiresMinMet;
        if (Array.isArray(saved.motivation.groups)) {
          groupsBody.querySelectorAll('input').forEach((input, idx) => {
            if (saved.motivation.groups[idx] !== undefined) input.value = saved.motivation.groups[idx];
          });
        }
      }
      return true;
    } catch (_) {
      return false;
    }
  }
  function clearSavedCalculatorState(){
    clearTimeout(autosaveTimer);
    try {
      localStorage.removeItem(storageKey);
      lastSavedStateRaw = '';
    } catch (_) {}
  }
  function setCatLine(nextIndex, paused){
    if (!easterCatBubble) return;
    catLineIndex = nextIndex % catLines.length;
    const nextLine = catLines[catLineIndex];
    if (easterCatBubble.textContent !== nextLine) easterCatBubble.textContent = nextLine;
    easterCat.classList.toggle('is-paused', Boolean(paused));
  }
  function stopCatCycle(){
    clearTimeout(catCycleTimer);
    catCycleTimer = null;
  }
  function scheduleCatCycle(delay = 12000){
    if (!easterCat || !catVisible || document.hidden) return;
    stopCatCycle();
    catCycleTimer = setTimeout(() => {
      if (!easterCat.classList.contains('is-paused')) setCatLine(catLineIndex + 1, false);
      scheduleCatCycle(12000);
    }, delay);
  }
  function pauseCatTemporarily(duration = 1600){
    if (!easterCat) return;
    clearTimeout(catResumeTimer);
    stopCatCycle();
    easterCat.classList.add('is-paused');
    catResumeTimer = setTimeout(() => {
      easterCat.classList.remove('is-paused');
      scheduleCatCycle();
    }, duration);
  }
  function toneClass(value){ return value > 0 ? 'is-positive' : value < 0 ? 'is-negative' : 'is-neutral'; }
  function setFieldMessage(id, msg, kind){
    const input = byId(id);
    const field = input && input.closest('.field');
    const msgEl = document.querySelector(`[data-msg-for="${id}"]`);
    if (!field || !msgEl) return;
    field.classList.remove('invalid', 'valid');
    msgEl.className = 'field-msg';
    msgEl.textContent = msg || '';
    if (msg && kind === 'error') { field.classList.add('invalid'); msgEl.classList.add('error'); }
    if (msg && kind === 'ok') { field.classList.add('valid'); msgEl.classList.add('ok'); }
  }
  function validateField(id){
    const val = parseFloat(byId(id).value);
    const finite = Number.isFinite(val);
    if (!touched.has(id)) { setFieldMessage(id, '', ''); return true; }
    const rules = {
      planTurnover: () => !finite || val < 0 ? 'Введіть число ≥ 0.' : '',
      planPercent: () => !finite || val < 0 || val > 200 ? 'Діапазон: 0–200%.' : '',
      avgDiscount: () => !finite || val < 0 || val > 200 ? 'Діапазон: 0–200%.' : '',
      avgDelayFact: () => !finite || val < 0 ? 'Значення має бути ≥ 0.' : '',
      overdue1: () => !finite || val < 0 ? 'Сума EUR має бути ≥ 0.' : '',
      overdue2: () => !finite || val < 0 ? 'Сума EUR має бути ≥ 0.' : '',
      overdue3: () => !finite || val < 0 ? 'Сума EUR має бути ≥ 0.' : '',
      eurRate: () => !finite || val <= 0 ? 'Курс має бути > 0.' : '',
      tiresOver: () => !finite || val < 0 || !Number.isInteger(val) ? 'Вкажіть ціле число ≥ 0.' : ''
    };
    const err = rules[id] ? rules[id]() : '';
    if (err) { setFieldMessage(id, err, 'error'); return false; }
    setFieldMessage(id, '✓', 'ok');
    return true;
  }
  function validateAllInputs(){
    const ids = ['planTurnover','planPercent','avgDiscount','avgDelayFact','overdue1','overdue2','overdue3','eurRate','tiresOver'];
    ids.forEach((id) => touched.add(id));
    const invalid = ids.filter((id) => !validateField(id));
    if (invalid.length) {
      errorSummary.hidden = false;
      errorSummary.textContent = `Перевірте заповнення полів (${invalid.length}). Наприклад: ${invalid.slice(0,3).join(', ')}.`;
      return false;
    }
    errorSummary.hidden = true;
    return true;
  }
  function animateSummaryCards(){
    summaryItems.forEach((el)=>el.classList.remove('flash'));
    requestAnimationFrame(() => {
      summaryItems.forEach((el)=>{ el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'), 360); });
    });
  }
  function animateNumber(el, from, to, formatter){
    if (from === to) { el.textContent = formatter(to); return; }
    const reduced = prefersReducedMotion.matches;
    if (reduced) { el.textContent = formatter(to); return; }
    const duration = 280;
    const start = performance.now();
    function tick(now){
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatter(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function planBonusByPercent(percent){
    const p = clamp(percent,0,200);
    if (p <= 90) return 0;
    return Math.max(0, Math.min(p,100)-90)*1000 + Math.max(0, Math.min(p,110)-100)*1500 + Math.max(0, p-110)*500;
  }

  function mixHexColor(from, to, weight){
    const t = clamp(weight, 0, 1);
    const start = from.replace('#', '');
    const end = to.replace('#', '');
    const channels = [0, 2, 4].map((offset) => {
      const a = parseInt(start.slice(offset, offset + 2), 16);
      const b = parseInt(end.slice(offset, offset + 2), 16);
      return Math.round(a + (b - a) * t).toString(16).padStart(2, '0');
    });
    return `#${channels.join('')}`;
  }

  function progressGradient(avg){
    const value = clamp(avg, 0, 100);
    const low = '#4b5565';
    const lowHi = '#5b6676';
    const mid = '#c89a3d';
    const midHi = '#d7aa52';
    const success = '#39a96b';
    const successHi = '#53b87c';

    if (value < 70) {
      const blend = value / 70;
      return `linear-gradient(90deg, ${mixHexColor(low, lowHi, blend * .45)} 0%, ${mixHexColor(lowHi, mid, blend * .55)} 100%)`;
    }
    if (value < 95) {
      const blend = (value - 70) / 25;
      return `linear-gradient(90deg, ${mixHexColor(lowHi, mid, blend * .65)} 0%, ${mixHexColor(mid, midHi, .45 + blend * .35)} 100%)`;
    }
    const blend = (value - 95) / 5;
    return `linear-gradient(90deg, ${mixHexColor(midHi, success, blend * .55)} 0%, ${mixHexColor(success, successHi, .35 + blend * .45)} 100%)`;
  }

  function setPriority(id, tone, label = ''){
    const input = byId(id);
    const field = input && input.closest('.field');
    if (!field) return;
    const fieldLabel = field.querySelector('label');
    field.classList.add('is-priority');
    priorityFields.add(field);
    field.classList.toggle('is-priority-high', tone === 'high');
    field.classList.toggle('is-priority-soft', tone !== 'high');
    if (fieldLabel) {
      if (label) fieldLabel.dataset.priority = label;
      else delete fieldLabel.dataset.priority;
    }
  }

  function resetPriorities(){
    priorityFields.forEach((field) => {
      field.classList.remove('is-priority', 'is-priority-high', 'is-priority-soft');
      const fieldLabel = field.querySelector('label');
      if (fieldLabel) delete fieldLabel.dataset.priority;
    });
    priorityFields.clear();
  }

  function updateFieldPriorities(monthly, quarter){
    resetPriorities();
    if (monthly.avgDelay > 7) setPriority('avgDelayFact', monthly.avgDelay > 14 ? 'high' : 'soft');
    if (monthly.avgDiscount >= 24) setPriority('avgDiscount', monthly.avgDiscount >= 27.5 ? 'high' : 'soft');
    if (!byId('crmDone').checked) setPriority('planTurnover', 'soft', 'Плече');
    const overdueMap = [
      { id: 'overdue1', value: monthly.overdue1 },
      { id: 'overdue2', value: monthly.overdue2 },
      { id: 'overdue3', value: monthly.overdue3 }
    ].sort((a, b) => b.value - a.value);
    if (overdueMap[0].value > 0) setPriority(overdueMap[0].id, 'high');
    if (!byId('tiresMinMet').checked || quarter.doneCount < 7) setPriority('tiresOver', quarter.doneCount < 7 ? 'high' : 'soft', 'Квартал');
  }

  function updateSummaryNotes(monthly, quarter, total){
    const isEmpty = monthly.total === 0 && quarter.total === 0 && monthly.planPercent === 0 && quarter.doneCount === 0;
    monthlySummaryCard.classList.toggle('is-empty', isEmpty);
    quarterSummaryCard.classList.toggle('is-empty', isEmpty);
    totalSummaryCard.classList.toggle('is-empty', isEmpty);

    monthSummaryNote.textContent = isEmpty
      ? 'Внесіть фактичні дані, щоб тут зʼявився зрозумілий розклад по важелях.'
      : monthly.planPercent < 100
        ? `Найбільший резерв зараз у виконанні плану: до 100% бракує ${(100 - monthly.planPercent).toFixed(1)}%.`
        : monthly.avgDelay > 7
          ? `План уже тримається добре; наступний сильний важіль — відтермінування (${monthly.avgDelay.toFixed(1)} дн.).`
          : 'Місячний блок виглядає зібрано: основні важелі вже працюють у плюс.';

    quarterSummaryNote.textContent = isEmpty
      ? 'Квартальний бонус ще порожній: групи й шини почнуть рухати його одразу після перших значень.'
      : quarter.doneCount < 7
        ? `Щоб увімкнути квартальний бонус, залишилося добрати ${7 - quarter.doneCount} груп(и) до порогу.`
        : quarter.doneCount < groupNames.length
          ? `Квартал уже активний. Ще ${groupNames.length - quarter.doneCount} груп(и) залишаються поза зеленою зоною.`
          : 'Усі групи в зеленій зоні — квартальний блок працює на максимум.';

    totalSummaryNote.textContent = isEmpty
      ? 'Загальний результат зʼявиться тут після першого сценарію або ручного вводу.'
      : total > 0
        ? `Разом зараз ${money(total)}. Найбільший приріст дадуть підсвічені поля з пріоритетом.`
        : 'Підсумок поки стриманий: перегляньте підсвічені поля, вони найсильніше впливають на фінал.';
  }

  function updateRewardState(monthly, quarter){
    const allGreen = quarter.doneCount === groupNames.length;
    [monthlySummaryCard, quarterSummaryCard, totalSummaryCard].forEach((card) => card.classList.toggle('has-success', allGreen));
    const miniCard = document.querySelector('.summary-mini');
    if (miniCard) miniCard.classList.toggle('is-celebrating', allGreen);
    if (allGreen && easterCatBubble && !easterCat.classList.contains('is-paused')) {
      const celebrationLine = celebrationCatLines[quarter.doneCount % celebrationCatLines.length];
      if (easterCatBubble.textContent !== celebrationLine) easterCatBubble.textContent = celebrationLine;
    }
  }

  function renderPdfReport(monthly, quarter){
    const keyMetricsMarkup = [
      `<div class="pdf-metric"><span class="pdf-metric-label">Загальна сума</span><span class="pdf-metric-value mono">${money(monthly.total + quarter.total)}</span></div>`,
      `<div class="pdf-metric"><span class="pdf-metric-label">План продажів</span><span class="pdf-metric-value mono">${monthly.planPercent.toFixed(1)}%</span></div>`,
      `<div class="pdf-metric"><span class="pdf-metric-label">Виконано груп</span><span class="pdf-metric-value mono">${quarter.doneCount} / ${groupNames.length}</span></div>`,
      `<div class="pdf-metric"><span class="pdf-metric-label">Середнє відтермінування</span><span class="pdf-metric-value mono">${monthly.avgDelay.toFixed(1)} дн.</span></div>`
    ].join('');
    const snapshot = [
      keyMetricsMarkup,
      monthlyTable.innerHTML,
      quarterTable.innerHTML,
      totalTable.innerHTML,
      monthly.total,
      quarter.total,
      monthly.total + quarter.total
    ].join('|');
    if (snapshot === previousPdfSnapshot) return;
    previousPdfSnapshot = snapshot;
    pdfKeyMetrics.innerHTML = keyMetricsMarkup;

    pdfMonthlyBreakdown.innerHTML = monthlyTable.innerHTML;
    pdfQuarterBreakdown.innerHTML = quarterTable.innerHTML;
    pdfTotalBreakdown.innerHTML = totalTable.innerHTML;
    pdfMonthTotal.textContent = money(monthly.total);
    pdfQuarterTotal.textContent = money(quarter.total);
    pdfAllTotal.textContent = money(monthly.total + quarter.total);
  }

  function calcMonthly(){
    const planTurnover = num('planTurnover');
    const crmBonus = byId('crmDone').checked ? 10000 : 0;
    const planPercent = clamp(num('planPercent'),0,200);
    const avgDiscount = num('avgDiscount');
    const avgDelay = num('avgDelayFact');
    const overdue1 = Math.max(0, num('overdue1'));
    const overdue2 = Math.max(0, num('overdue2'));
    const overdue3 = Math.max(0, num('overdue3'));
    const rate = Math.max(0, num('eurRate'));

    const tpBonus = planTurnover < 50000 ? 10000 : planTurnover > 150000 ? 25000 : 20000;
    const planBase = planBonusByPercent(planPercent);
    const discountReduce = avgDiscount >= 27.5 ? planBase * 0.5 : 0;
    const planFinal = planBase - discountReduce;
    const delayBonus = avgDelay <= 7 ? 6000 : avgDelay <= 14 ? 3000 : 0;

    const overdueEur = overdue1*0.005 + overdue2*0.01 + overdue3*0.02;
    const overdueLocal = overdueEur * rate;

    const total = tpBonus + crmBonus + planFinal + delayBonus - overdueLocal;

    return { tpBonus, crmBonus, planBase, discountReduce, planFinal, delayBonus, overdueEur, rate, overdueLocal, total, planPercent, avgDelay, avgDiscount, overdue1, overdue2, overdue3 };
  }

  function groupsBonusByCount(count){
    if (count < 7) return 0;
    if (count === 7) return 12000;
    if (count === 8) return 16000;
    if (count === 9) return 22000;
    return 30000;
  }

  function calcQuarter(){
    const tiresOver = Math.max(0, num('tiresOver'));
    const tiresAdj = (byId('tiresMinMet').checked ? 0 : -5000) + tiresOver*300;

    const results = groupNames.map((name, idx)=>{
      const inputOffset = idx * 3;
      const m1 = clamp(parseFloat(groupInputs[inputOffset].value) || 0,0,200);
      const m2 = clamp(parseFloat(groupInputs[inputOffset + 1].value) || 0,0,200);
      const m3 = clamp(parseFloat(groupInputs[inputOffset + 2].value) || 0,0,200);
      const avg = (m1+m2+m3)/3;
      const done = avg >= 95;
      return { name, avg, done };
    });

    const doneCount = results.filter(r=>r.done).length;
    const doneNames = results.filter(r=>r.done).map(r=>r.name);
    const groupBonus = groupsBonusByCount(doneCount);
    const allGroupsBonus = doneCount === groupNames.length ? 10000 : 0;
    const total = tiresAdj + groupBonus + allGroupsBonus;

    const nextProgressSnapshot = [];
    results.forEach((r, idx)=>{
      const ui = groupCells[idx];
      const avgText = `${r.avg.toFixed(2)}%`;
      if (ui.avg.textContent !== avgText) ui.avg.textContent = avgText;
      const near = !r.done && r.avg >= 85;
      const rowClass = r.done ? 'done' : near ? 'near' : 'fail';
      if (!ui.row.classList.contains(rowClass) || ui.row.classList.length > 1) {
        ui.row.classList.remove('done', 'near', 'fail');
        ui.row.classList.add(rowClass);
      }
      const okHtml = r.done ? '<span class="pill-ok">Виконано</span>' : near ? '<span class="pill-near">Близько</span>' : '<span class="pill-no">Не виконано</span>';
      if (ui.ok.innerHTML !== okHtml) ui.ok.innerHTML = okHtml;
      const p = Math.max(0, Math.min(100, (r.avg / 95) * 100));
      const progressWidth = `${p}%`;
      const progressBg = progressGradient(r.avg);
      nextProgressSnapshot.push(`${progressWidth}|${progressBg}`);
      if (!previousProgressSnapshot || previousProgressSnapshot[idx] !== nextProgressSnapshot[idx]) {
        ui.progress.style.width = progressWidth;
        ui.progress.style.background = progressBg;
      }
    });
    previousProgressSnapshot = nextProgressSnapshot;

    groupsDoneCount.textContent = `Виконано ${doneCount} з ${groupNames.length} груп`;
    const nextThreshold = [7,8,9,10].find((t) => doneCount < t);
    groupsNextHint.textContent = doneCount >= 10
      ? (doneCount === groupNames.length ? 'Виконано максимум: діє додатковий бонус за всі групи.' : 'До наступного рівня бонусу за групи залишився статус “10+”.')
      : `Ще ${nextThreshold - doneCount} груп(и) до бонусу ${groupsBonusByCount(nextThreshold)}.`;

    return { tiresAdj, doneCount, doneNames, groupBonus, allGroupsBonus, total, results };
  }

  function renderBreakdown(monthly, quarter){
    monthlyTable.innerHTML = [
      row('Бонус ТП', money(monthly.tpBonus)),
      row('Бонус CRM', money(monthly.crmBonus)),
      row('Бонус за виконання плану', money(monthly.planBase)),
      row('Зменшення через знижку', `- ${money(monthly.discountReduce)}`),
      row('Бонус за відтермінування', money(monthly.delayBonus)),
      row('Штраф за прострочку (EUR)', eur(monthly.overdueEur)),
      row('Курс EUR', monthly.rate.toFixed(4)),
      row('Штраф в бонусній валюті', `- ${money(monthly.overdueLocal)}`)
    ].join('');

    quarterTable.innerHTML = [
      row('Штраф/бонус по шинам', money(quarter.tiresAdj)),
      row('Кількість виконаних груп', String(quarter.doneCount)),
      row('Бонус за групи', money(quarter.groupBonus)),
      row('Додатковий бонус за всі групи', money(quarter.allGroupsBonus)),
      row('Виконані групи', quarter.doneNames.length ? quarter.doneNames.join(', ') : '—')
    ].join('');

    totalTable.innerHTML = [
      row('Місячна мотивація', money(monthly.total)),
      row('Квартальний бонус', money(quarter.total)),
      row('Курс EUR', monthly.rate.toFixed(4)),
      row('Виконані квартальні групи', `${quarter.doneCount} / ${groupNames.length}`)
    ].join('');
    const nextSnapshot = {
      month: monthly.total,
      quarter: quarter.total,
      total: monthly.total + quarter.total
    };

    const prev = previousSnapshot || nextSnapshot;
    animateNumber(monthTotalEl, prev.month, nextSnapshot.month, money);
    animateNumber(quarterTotalEl, prev.quarter, nextSnapshot.quarter, money);
    animateNumber(allTotalEl, prev.total, nextSnapshot.total, money);

    [monthTotalEl, quarterTotalEl, allTotalEl].forEach((el, idx) => {
      const value = idx === 0 ? nextSnapshot.month : idx === 1 ? nextSnapshot.quarter : nextSnapshot.total;
      el.classList.remove('is-positive', 'is-negative', 'is-neutral');
      el.classList.add(toneClass(value));
    });

    const tables = [monthlyTable, quarterTable, totalTable];
    tables.forEach((table) => {
      table.querySelectorAll('tr').forEach((tr) => {
        const key = tr.children[0]?.textContent || '';
        const val = tr.children[1]?.textContent || '';
        if (previousSnapshot && previousSnapshot.rows && previousSnapshot.rows[key] !== undefined && previousSnapshot.rows[key] !== val) {
          tr.classList.add('row-changed');
          setTimeout(() => tr.classList.remove('row-changed'), 620);
        }
      });
    });

    const rowsMap = {};
    tables.forEach((table) => table.querySelectorAll('tr').forEach((tr) => {
      const key = tr.children[0]?.textContent || '';
      const val = tr.children[1]?.textContent || '';
      if (key) rowsMap[key] = val;
    }));
    const shouldAnimateSummary = !previousSnapshot || prev.total !== nextSnapshot.total || prev.month !== nextSnapshot.month || prev.quarter !== nextSnapshot.quarter;
    previousSnapshot = { ...nextSnapshot, rows: rowsMap };
    if (stickyAllTotal) stickyAllTotal.textContent = money(nextSnapshot.total);
    if (stickyMonthTotal) stickyMonthTotal.textContent = money(nextSnapshot.month);
    if (stickyQuarterTotal) stickyQuarterTotal.textContent = money(nextSnapshot.quarter);
    if (shouldAnimateSummary) animateSummaryCards();
  }

  function renderHints(el, items) {
    const nextMarkup = items.slice(0, 6).map((i) => `<li class="${i.type}">${i.text}</li>`).join('');
    if (hintsMarkupCache.get(el) === nextMarkup) return;
    el.innerHTML = nextMarkup;
    hintsMarkupCache.set(el, nextMarkup);
  }

  function buildMonthlyHints(monthly) {
    const hints = [];
    if (monthly.planPercent < 90) hints.push({ type: 'warn', text: `До старту бонусу за план залишилось +${(90 - monthly.planPercent).toFixed(1)}%.` });
    else if (monthly.planPercent < 100) hints.push({ type: 'info', text: `До наступного порогу 100% залишилось +${(100 - monthly.planPercent).toFixed(1)}%.` });
    else if (monthly.planPercent < 110) hints.push({ type: 'info', text: `До порогу 110% залишилось +${(110 - monthly.planPercent).toFixed(1)}%.` });
    else hints.push({ type: 'success', text: 'План перевищує 110% — бонус на максимальному базовому порозі.' });

    if (monthly.avgDelay > 14) hints.push({ type: 'warn', text: `Щоб отримати 3000, зменшіть відтермінування ще на ${(monthly.avgDelay - 14).toFixed(1)} дн.` });
    else if (monthly.avgDelay > 7) hints.push({ type: 'info', text: `Щоб отримати 6000, зменшіть відтермінування ще на ${(monthly.avgDelay - 7).toFixed(1)} дн.` });
    else hints.push({ type: 'success', text: 'Максимальний бонус за відтермінування вже досягнуто.' });

    hints.push(byId('crmDone').checked
      ? { type: 'success', text: 'CRM-бонус активний.' }
      : { type: 'info', text: 'Виконання CRM на 100% додасть +10000.' });

    hints.push(monthly.avgDiscount >= 27.5
      ? { type: 'warn', text: 'Середня знижка зменшує бонус за план на 50%.' }
      : { type: 'info', text: 'Поточна знижка ще не впливає на бонус за план.' });
    if (monthly.avgDiscount < 27.5 && monthly.avgDiscount >= 25.5) {
      hints.push({ type: 'warn', text: `До порогу знижки 27.5% залишилось ${(27.5 - monthly.avgDiscount).toFixed(1)}%.` });
    }

    const overdueMax = Math.max(monthly.overdue1, monthly.overdue2, monthly.overdue3);
    if (monthly.overdueEur <= 0) hints.push({ type: 'success', text: 'Прострочення відсутнє — утримання немає.' });
    else {
      const worst = overdueMax === monthly.overdue3 ? '20+ днів' : overdueMax === monthly.overdue2 ? '11–20 днів' : '1–10 днів';
      hints.push({ type: 'warn', text: `Найбільше утримання дає прострочка ${worst}. Загалом: ${eur(monthly.overdueEur)} / ${money(monthly.overdueLocal)}.` });
    }
    return hints;
  }

  function buildQuarterHints(quarter) {
    const hints = [];
    if (quarter.doneCount < 7) hints.push({ type: 'warn', text: `До мінімального квартального бонусу не вистачає ${7 - quarter.doneCount} груп(и).` });
    else if (quarter.doneCount < 8) hints.push({ type: 'info', text: 'Ще 1 група — і бонус зросте до 16000.' });
    else if (quarter.doneCount < 9) hints.push({ type: 'info', text: 'Ще 1 група — і бонус зросте до 22000.' });
    else if (quarter.doneCount < 10) hints.push({ type: 'info', text: 'До порогу 30000 залишилась 1 група.' });
    else hints.push({ type: 'success', text: 'Базовий максимум по групах досягнуто.' });

    if (quarter.doneCount >= 10 && quarter.doneCount < groupNames.length) hints.push({ type: 'info', text: 'Якщо виконати всі 12 груп, додатково буде +10000.' });
    if (quarter.doneCount === groupNames.length) hints.push({ type: 'success', text: 'Додатковий бонус за всі 12 груп активовано.' });

    hints.push(byId('tiresMinMet').checked
      ? { type: 'info', text: 'Кожна шина понад мінімум додає +300.' }
      : { type: 'warn', text: 'Мінімальний план шин не виконано: штраф -5000.' });

    const weakest = quarter.results.filter((r) => !r.done).sort((a, b) => a.avg - b.avg).slice(0, 2);
    weakest.forEach((r) => hints.push({ type: 'warn', text: `${r.name}: не вистачає +${(95 - r.avg).toFixed(1)}% до 95%.` }));
    const nearDone = quarter.results
      .filter((r) => !r.done && (95 - r.avg) <= 2)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 2);
    nearDone.forEach((r) => hints.push({ type: 'info', text: `${r.name}: майже готово, лишилось ${(95 - r.avg).toFixed(1)}% до порогу 95%.` }));
    if (!weakest.length) hints.push({ type: 'success', text: 'Усі квартальні групи вже виконуються.' });

    return hints;
  }

  function scheduleMotivationCalculation(){
    if (motivationFrameId) return;
    motivationFrameId = requestAnimationFrame(() => {
      motivationFrameId = 0;
      calculateMotivation();
      syncPanelRate(result.source === 'minfin' ? 'ok' : 'muted');
    });
  }

  function renderDiagnostics(monthly, quarter, total){
    if (!diagnosticsMode || !diagnosticsEl) return;
    const payload = { monthly, quarter: { ...quarter, results: quarter.results.map(({ name, avg, done }) => ({ name, avg, done })) }, total };
    diagnosticsEl.hidden = false;
    diagnosticsEl.textContent = JSON.stringify(payload, null, 2);
  }

  function calculateMotivation(){
    const monthly = calcMonthly();
    const quarter = calcQuarter();
    renderBreakdown(monthly, quarter);
    renderHints(monthlyHintsEl, buildMonthlyHints(monthly));
    renderHints(quarterHintsEl, buildQuarterHints(quarter));
    updateFieldPriorities(monthly, quarter);
    updateSummaryNotes(monthly, quarter, monthly.total + quarter.total);
    updateRewardState(monthly, quarter);
    renderPdfReport(monthly, quarter);
    const total = monthly.total + quarter.total;
    renderDiagnostics(monthly, quarter, total);
    saveCalculatorState();
    return { monthly, quarter, total };
  }

  function parseMinfinRateFromHtml(html){
    if (!html) return null;
    const normalized = String(html)
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ');

    const patterns = [
      /Курс НБУ[^0-9]{0,40}(\d{1,3}[.,]\d{2,4})/i,
      /Валюта[^]*?EUR[^0-9]{1,20}\d{1,3}[.,]\d{2,4}[^0-9]{1,20}\d{1,3}[.,]\d{2,4}[^0-9]{1,20}(\d{1,3}[.,]\d{2,4})/i,
      /EUR\/UAH[^0-9]{0,20}1\s*EUR[^0-9]{0,20}(\d{1,3}[.,]\d{2,4})/i,
      /"ask"\s*:\s*"(\d{1,3}[.,]\d{2,4})"/i,
      /"sale"\s*:\s*"(\d{1,3}[.,]\d{2,4})"/i
    ];

    for (const pattern of patterns) {
      const match = normalized.match(pattern);
      if (!match) continue;
      const value = Number(String(match[1]).replace(',', '.'));
      if (Number.isFinite(value) && value > 0) return value;
    }

    return null;
  }

  async function fetchMinfinRate(){
    const minfinUrl = 'https://minfin.com.ua/currency/eur/';
    const sources = [
      { url: minfinUrl, parser: (res) => res.text() },
      { url: `https://api.allorigins.win/raw?url=${encodeURIComponent(minfinUrl)}`, parser: (res) => res.text() },
      { url: `https://r.jina.ai/http://minfin.com.ua/currency/eur/`, parser: (res) => res.text() }
    ];

    for (const source of sources) {
      try {
        const res = await fetch(source.url, { cache: 'no-store' });
        if (!res.ok) continue;
        const payload = await source.parser(res);
        const rate = parseMinfinRateFromHtml(payload);
        if (rate) return { rate, source: 'minfin' };
      } catch (_) {}
    }

    return null;
  }

  async function fetchFallbackRate(){
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=UAH', { cache: 'no-store' });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      const rate = data && data.rates && data.rates.UAH;
      if (!rate) throw new Error('no rate');
      return { rate: Number(rate), source: 'fallback' };
    } catch (_) {
      return null;
    }
  }

  async function refreshRate(){
    const btn = byId('refreshRate');
    btn.disabled = true;
    btn.classList.add('is-loading');
    setRateStatus('', '');

    try {
      const result = await fetchMinfinRate() || await fetchFallbackRate();
      if (!result || !Number.isFinite(result.rate) || result.rate <= 0) throw new Error('no rate');

      byId('eurRate').value = Number(result.rate).toFixed(4);
      touched.add('eurRate');
      validateField('eurRate');
      calculateMotivation();
      syncPanelRate();
      setRateStatus(
        result.source === 'minfin'
          ? `Автокурс оновлено з Minfin: 1 EUR = ${Number(result.rate).toFixed(4)}`
          : `Minfin недоступний, використано резервне джерело: 1 EUR = ${Number(result.rate).toFixed(4)}`,
        'ok'
      );
    } catch (e) {
      syncPanelRate('error');
      setRateStatus('Не вдалося отримати курс. Введіть значення вручну.', 'error');
    } finally {
      btn.disabled = false;
      btn.classList.remove('is-loading');
    }
  }

  function bindRecalc(){
    const ids = ['planTurnover','planPercent','avgDiscount','avgDelayFact','overdue1','overdue2','overdue3','eurRate','tiresOver'];
    ids.forEach((id)=>{
      byId(id).addEventListener('blur', () => { touched.add(id); validateField(id); });
      byId(id).addEventListener('input', () => { if (touched.has(id)) validateField(id); scheduleMotivationCalculation(); if (id === 'eurRate') syncPanelRate(); });
    });
    ['crmDone','tiresMinMet'].forEach(id=>byId(id).addEventListener('change', scheduleMotivationCalculation));
    groupInputs.forEach((input)=>input.addEventListener('input', scheduleMotivationCalculation));
  }

  byId('refreshRate').addEventListener('click', refreshRate);
  byId('recalcMotivation').addEventListener('click', ()=>{ if (!validateAllInputs()) { setMStatus('Виправте помилки перед перерахунком.', 'error'); return; } calculateMotivation(); setMStatus('Розрахунок оновлено.', 'ok'); });
  byId('downloadPdf').addEventListener('click', ()=>{ const stamp = new Date().toLocaleString('uk-UA'); printMeta.textContent = `Дата друку: ${stamp}`; pdfTimestamp.textContent = `Сформовано: ${stamp}`; setMStatus('Підготовлено короткий PDF-звіт.', 'ok'); window.print(); });
  byId('clearAll').addEventListener('click', ()=>{
    debtInput.value='58617'; turnoverInput.value='155775'; daysInput.value='31'; exampleInputs.forEach(refreshExampleState);
    ['planTurnover','planPercent','avgDiscount','avgDelayFact','overdue1','overdue2','overdue3','tiresOver'].forEach(id=>byId(id).value='0');
    byId('eurRate').value='45'; byId('crmDone').checked=false; byId('tiresMinMet').checked=true;
    syncPanelRate();
    groupsBody.querySelectorAll('input').forEach(i=>i.value='0');
    ['planTurnover','planPercent','avgDiscount','avgDelayFact','overdue1','overdue2','overdue3','eurRate','tiresOver'].forEach((id)=>{ touched.delete(id); setFieldMessage(id, '', ''); });
    errorSummary.hidden = true;
    clearSavedCalculatorState();
    calculateDelay(); calculateMotivation(); setMStatus('Усі поля очищено.', 'ok');
  });
  if (easterCat) {
    if (catLiteMode) easterCat.classList.add('is-lite');
    easterCat.addEventListener('click', () => {
      setCatLine(catLineIndex + 1, true);
      pauseCatTemporarily(1600);
    });
    if ('IntersectionObserver' in window && summaryMiniCard) {
      const catObserver = new IntersectionObserver(([entry]) => {
        catVisible = Boolean(entry && entry.isIntersecting);
        if (!catVisible) {
          stopCatCycle();
          easterCat.classList.add('is-paused');
          return;
        }
        easterCat.classList.remove('is-paused');
        scheduleCatCycle(9000);
      }, { threshold: 0.15 });
      catObserver.observe(summaryMiniCard);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopCatCycle();
        easterCat.classList.add('is-paused');
        return;
      }
      easterCat.classList.remove('is-paused');
      scheduleCatCycle(9000);
    });
    scheduleCatCycle(9000);
  }

  bindRecalc();
  const restoredState = restoreCalculatorState();
  exampleInputs.forEach(refreshExampleState);
  calculateDelay();
  calculateMotivation();
  syncPanelTime();
  syncPanelRate();
  setInterval(syncPanelTime, 60000);
  if (!restoredState) refreshRate();
})();
