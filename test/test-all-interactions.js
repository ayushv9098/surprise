import { spawn } from 'node:child_process';

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9231',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9231/json/version');
  const ver = await res.json();
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pendingPromises = new Map();

  const caughtErrors = [];

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pendingPromises.has(msg.id)) {
      const { resolve } = pendingPromises.get(msg.id);
      pendingPromises.delete(msg.id);
      resolve(msg.result);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description).join(' ');
      if (msg.params.type === 'error') {
        console.error('CONSOLE ERROR:', text);
        caughtErrors.push(text);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails?.exception?.description || JSON.stringify(msg.params.exceptionDetails);
      console.error('EXCEPTION THROWN:', desc);
      caughtErrors.push(desc);
    }
  };

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pendingPromises.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  async function evaluate(expression) {
    const result = await sendCommand('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return result?.result?.value;
  }

  const checkErrorBoundary = async (stepName) => {
    const text = await evaluate('document.body.innerText') || '';
    if (text.includes('Something went wrong')) {
      const errRes = await evaluate('document.querySelector(".text-slate-500")?.innerText');
      console.error(`❌ CRASH AT [${stepName}]:`, errRes);
      return true;
    }
    return false;
  };

  console.log('=== TEST 1: Builder Studio Flow ===');
  await sendCommand('Page.navigate', { url: 'http://localhost:5174/' });
  await new Promise(r => setTimeout(r, 2000));
  await checkErrorBoundary('Initial Builder load');

  // Test selecting each template card in Step 1
  console.log('Testing template switching in Step 1...');
  for (let i = 0; i < 3; i++) {
    await evaluate(`(() => {
      const cards = document.querySelectorAll('.grid > div');
      if (cards[${i}]) cards[${i}].click();
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await checkErrorBoundary(`Select card ${i}`);
  }

  // Click Proceed to Form (Step 2)
  console.log('Testing Proceed to Form button...');
  await evaluate(`(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const proceed = btns.find(b => b.innerText.includes('Proceed to Form') || b.innerText.includes('Next'));
    if (proceed) proceed.click();
  })()`);
  await new Promise(r => setTimeout(r, 1000));
  await checkErrorBoundary('After Proceed to Form');

  // Test form tabs (Details, Photos & Music, Surprises)
  console.log('Testing form tabs...');
  const formTabNames = ['Details', 'Photos & Music', 'Letter & Surprises'];
  for (const tab of formTabNames) {
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(btn => btn.innerText.includes('${tab}'));
      if (b) b.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));
    await checkErrorBoundary(`Form tab ${tab}`);
  }

  // Test clicking inside the phone simulator tabs (Photos, Letter, Quiz)
  console.log('Testing Phone simulator tabs...');
  for (const simTab of ['Photos', 'Letter', 'Quiz']) {
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find(btn => btn.innerText.trim() === '${simTab}' || btn.innerText.includes('${simTab}'));
      if (b) b.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await checkErrorBoundary(`Simulator tab ${simTab}`);
  }

  // Test clicking wax seal
  console.log('Testing wax seal click...');
  await evaluate(`(() => {
    const seal = document.querySelector('[title*="unseal"]');
    if (seal) seal.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await checkErrorBoundary('After wax seal click');

  // Test quiz runaway & YES click
  console.log('Testing quiz tab game buttons...');
  await evaluate(`(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const quizTab = btns.find(btn => btn.innerText.includes('Quiz'));
    if (quizTab) quizTab.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));

  await evaluate(`(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const yesBtn = btns.find(b => b.innerText.includes('YES'));
    if (yesBtn) yesBtn.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await checkErrorBoundary('After quiz YES click');

  console.log('=== TEST 2: BlushRomanceView Keepsake Page (maya-eq97c) ===');
  await sendCommand('Page.navigate', { url: 'http://localhost:5174/?v=maya-eq97c' });
  await new Promise(r => setTimeout(r, 2000));
  await checkErrorBoundary('Keepsake load');

  // Click "Tap to Open Surprise"
  console.log('Testing Tap to Open Surprise...');
  await evaluate(`(() => {
    const introBtn = document.querySelector('.intro-enter-btn') || Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tap to Open'));
    if (introBtn) introBtn.click();
  })()`);
  await new Promise(r => setTimeout(r, 1000));
  await checkErrorBoundary('After Tap to Open');

  // Test audio toggle
  console.log('Testing music pill toggle...');
  await evaluate(`(() => {
    const pill = document.querySelector('.soft-music-pill');
    if (pill) pill.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await checkErrorBoundary('After music pill click');

  // Test tabs
  console.log('Testing Keepsake nav tabs...');
  for (const tab of ['Photos', 'Letter', 'Quiz', 'game']) {
    await evaluate(`(() => {
      const pills = document.querySelectorAll('.nav-pill');
      pills.forEach(p => {
        if (p.innerText.includes('${tab}')) p.click();
      });
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await checkErrorBoundary(`Keepsake tab ${tab}`);
  }

  // Test wax seal in letter tab
  console.log('Testing envelope unseal in keepsake...');
  await evaluate(`(() => {
    const env = document.querySelector('.khat-envelope');
    if (env) env.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await checkErrorBoundary('After khat envelope click');

  // Test quiz in keepsake
  console.log('Testing quiz in keepsake...');
  await evaluate(`(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const gameTab = btns.find(b => b.className?.includes('nav-pill') && (b.innerText.includes('Quiz') || b.innerText.includes('🙈')));
    if (gameTab) gameTab.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));

  await evaluate(`(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const yesBtn = btns.find(b => b.innerText.includes('YES'));
    if (yesBtn) yesBtn.click();
  })()`);
  await new Promise(r => setTimeout(r, 500));
  await checkErrorBoundary('After keepsake quiz YES click');

  console.log('\n=== SUMMARY ===');
  console.log('Total caught errors:', caughtErrors.length);
  if (caughtErrors.length > 0) {
    console.error('ERRORS:', caughtErrors);
  } else {
    console.log('🎉 ZERO ERRORS ENCOUNTERED ACROSS ALL FLOWS!');
  }

  chrome.kill();
  process.exit(caughtErrors.length > 0 ? 1 : 0);
}

run();
