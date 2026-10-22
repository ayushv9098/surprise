import { spawn } from 'node:child_process';

async function run() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9230',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9230/json/version');
  const ver = await res.json();
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const pendingPromises = new Map();

  ws.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.id && pendingPromises.has(msg.id)) {
      const { resolve } = pendingPromises.get(msg.id);
      pendingPromises.delete(msg.id);
      resolve(msg.result);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION:', msg.params.exceptionDetails?.exception?.description || JSON.stringify(msg.params.exceptionDetails));
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

  const checkError = async (name) => {
    const text = await evaluate('document.body.innerText') || '';
    if (text.includes('Something went wrong')) {
      console.error('❌ FAILED ON:', name, '-> FOUND ERROR BOUNDARY!');
      const errRes = await evaluate('document.querySelector(".text-slate-500")?.innerText');
      console.error('   ERROR DETAILS:', errRes);
      return true;
    } else {
      console.log('✓ OK ON:', name);
      return false;
    }
  };

  const urls = [
    ['Builder Home', 'http://localhost:5174/'],
    ['maya-eq97c', 'http://localhost:5174/?v=maya-eq97c'],
    ['preview=velvet-romance', 'http://localhost:5174/?preview=velvet-romance'],
    ['preview=sunset-romance', 'http://localhost:5174/?preview=sunset-romance'],
    ['preview=celestial-love', 'http://localhost:5174/?preview=celestial-love'],
    ['preview=royal-sapphire', 'http://localhost:5174/?preview=royal-sapphire'],
    ['preview=blush-rose', 'http://localhost:5174/?preview=blush-rose'],
    ['preview=golden-birthday', 'http://localhost:5174/?preview=golden-birthday'],
    ['preview=polaroid-scrapbook', 'http://localhost:5174/?preview=polaroid-scrapbook'],
    ['preview=vintage-kodak', 'http://localhost:5174/?preview=vintage-kodak'],
    ['preview=neon-nostalgia', 'http://localhost:5174/?preview=neon-nostalgia'],
    ['preview=cozy-memories', 'http://localhost:5174/?preview=cozy-memories'],
    ['preview=gentle-peace', 'http://localhost:5174/?preview=gentle-peace'],
    ['preview=sweet-forgive', 'http://localhost:5174/?preview=sweet-forgive'],
    ['preview=fresh-start', 'http://localhost:5174/?preview=fresh-start'],
    ['Admin', 'http://localhost:5174/admin']
  ];

  for (const [name, url] of urls) {
    console.log(`Checking ${name}...`);
    await sendCommand('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1200));
    await checkError(name);
  }

  // Also check production URLs
  const prodUrls = [
    ['Prod Home', 'https://wishcraft-surprise.vercel.app/'],
    ['Prod maya-eq97c', 'https://wishcraft-surprise.vercel.app/?v=maya-eq97c'],
    ['Prod preview=velvet-romance', 'https://wishcraft-surprise.vercel.app/?preview=velvet-romance']
  ];
  for (const [name, url] of prodUrls) {
    console.log(`Checking ${name}...`);
    await sendCommand('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 2000));
    await checkError(name);
  }

  chrome.kill();
  process.exit(0);
}

run();
