import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const _ROOT_DIR = path.resolve(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';
const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runQaRomanceFormAndHome() {
  console.log('================================================================');
  console.log('🧪 QA VERIFICATION: ROMANCE FORM, HOMEPAGE & E2E PARITY');
  console.log(`   Target URL: ${BASE_URL}`);
  console.log('================================================================\n');

  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`Chrome executable not found at ${CHROME_PATH}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1440,900',
    ],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();
  const consoleErrors = [];
  const uncaughtExceptions = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico') && !text.includes('404')) {
        consoleErrors.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    uncaughtExceptions.push(err.toString());
  });

  try {
    // =========================================================================
    // PART 1: HOMEPAGE VERIFICATION
    // =========================================================================
    console.log('[1/4] Testing Homepage Categories & Sections...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('section#occasions', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));

    // 1.1 "Special Someone & Romance" visible
    const romanceCardText = await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('section#occasions h3, h3'));
      const romanceH3 = h3s.find((h) => h.innerText.includes('Special Someone & Romance'));
      return romanceH3 ? romanceH3.innerText.trim() : null;
    });
    assert(
      romanceCardText === 'Special Someone & Romance',
      `"Special Someone & Romance" category card title is visible (found: "${romanceCardText}")`
    );

    // 1.2 "Memory Scrapbook" and "Heartfelt Apology" have "Coming Soon 🚀" badges
    const comingSoonBadges = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('section#occasions button'));
      const results = {};
      for (const card of cards) {
        const text = card.innerText;
        if (text.includes('Memory Scrapbook')) {
          results.scrapbookBadge = text.includes('Coming Soon 🚀');
          results.scrapbookDisabled = card.classList.contains('cursor-not-allowed');
        }
        if (text.includes('Heartfelt Apology')) {
          results.apologyBadge = text.includes('Coming Soon 🚀');
          results.apologyDisabled = card.classList.contains('cursor-not-allowed');
        }
      }
      return results;
    });
    assert(
      comingSoonBadges.scrapbookBadge && comingSoonBadges.scrapbookDisabled,
      'Memory Scrapbook card has "Coming Soon 🚀" badge and disabled styling'
    );
    assert(
      comingSoonBadges.apologyBadge && comingSoonBadges.apologyDisabled,
      'Heartfelt Apology card has "Coming Soon 🚀" badge and disabled styling'
    );

    // 1.3 Clicking "Coming Soon" card does not navigate to builder
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('section#occasions button'));
      const scrapbookBtn = buttons.find((b) => b.innerText.includes('Memory Scrapbook'));
      if (scrapbookBtn) scrapbookBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const stillOnHome = await page.evaluate(() => {
      const occasionsSection = document.querySelector('section#occasions');
      const studioElement = document.querySelector('.soft-app.in-phone-simulator, .romance-phone-simulator');
      return Boolean(occasionsSection && !studioElement);
    });
    assert(
      stillOnHome,
      'Clicking disabled "Coming Soon" card prevented navigation and stayed on Homepage'
    );

    // 1.4 No redundant "Start Creating →" button in "How it works" section
    const howItWorksCheck = await page.evaluate(() => {
      const allSections = Array.from(document.querySelectorAll('section'));
      const howItWorksSection = allSections.find((s) => {
        const h2 = s.querySelector('h2');
        return h2 && h2.innerText.toLowerCase().includes('how it works');
      });
      if (!howItWorksSection) return { sectionFound: false, buttonCount: 0 };
      const buttons = Array.from(howItWorksSection.querySelectorAll('button'));
      return { sectionFound: true, buttonCount: buttons.length };
    });
    assert(
      howItWorksCheck.sectionFound && howItWorksCheck.buttonCount === 0,
      `"How it works" section has 0 redundant buttons at the bottom (found: ${howItWorksCheck.buttonCount})`
    );

    // =========================================================================
    // PART 2: BIRTHDAY PREVIEW SINGLE BACK BUTTON CHECK
    // =========================================================================
    console.log('\n[2/4] Verifying Birthday Preview "Back to Wishly" button...');
    await page.goto(`${BASE_URL}/?preview=royal-sapphire`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 1500));

    const backButtonStats = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      const backButtons = allButtons.filter((b) => b.innerText.includes('Back to Wishly'));
      return {
        count: backButtons.length,
        texts: backButtons.map((b) => b.innerText.replace(/\s+/g, ' ').trim()),
      };
    });
    assert(
      backButtonStats.count === 1,
      `Only ONE "Back to Wishly" button present in Birthday Preview (count: ${backButtonStats.count}, duplicate cover button removed)`
    );

    // =========================================================================
    // PART 3: ROMANCE BUILDER STUDIO - STEP 2 (MEDIA DECK)
    // =========================================================================
    console.log('\n[3/4] Navigating to Romance Builder Studio & Step 2 (Media Deck)...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector('section#occasions', { timeout: 15000 });

    // Click "Special Someone & Romance"
    const clickedRomance = await page.evaluate(() => {
      const occasionButtons = Array.from(document.querySelectorAll('section#occasions button'));
      for (const btn of occasionButtons) {
        if (btn.innerText.includes('Special Someone') || btn.innerText.includes('Romance')) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    assert(clickedRomance, 'Clicked "Special Someone & Romance" occasion card');

    // Wait for builder studio to load (Step 1)
    await page.waitForSelector('.soft-app.in-phone-simulator, .romance-phone-simulator', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Click "Proceed to Form" to advance from Step 1 to Step 2 Form
    const clickedProceed = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextBtn = buttons.find((b) => b.innerText.includes('Proceed to Form') || b.innerText.includes('Customize Details'));
      if (nextBtn) {
        nextBtn.click();
        return true;
      }
      return false;
    });
    assert(clickedProceed, 'Advanced from Step 1 to Step 2 Form ("Proceed to Form")');
    await new Promise((r) => setTimeout(r, 1000));

    // Click Tab 2: "2. Photos & Music"
    const clickedTab2 = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tab2 = buttons.find((b) => b.innerText.includes('2. Photos'));
      if (tab2) {
        tab2.click();
        return true;
      }
      return false;
    });
    assert(clickedTab2, 'Switched to Tab 2: "2. Photos & Music" in Builder Studio');
    await new Promise((r) => setTimeout(r, 800));

    // Verify 4 memory photos exist with tag and caption inputs in visible desktop panel
    const photoDeckStats = await page.evaluate(() => {
      // Find all tag and caption inputs in StepMedia desktop panel
      const desktopContainer = document.querySelector('.hidden.lg\\:flex');
      const inputs = Array.from((desktopContainer || document).querySelectorAll('input[type="text"]'));
      const tagInputs = inputs.filter((i) => i.placeholder && (i.placeholder.includes('BEGINNING') || i.placeholder.includes('🌸')));
      const captionInputs = inputs.filter((i) => i.placeholder && (i.placeholder.includes('Forever & Always') || i.placeholder.includes('❤️🌹')));
      const deleteButtons = Array.from((desktopContainer || document).querySelectorAll('button')).filter((b) => b.innerText.includes('Delete'));
      const sampleButtons = Array.from((desktopContainer || document).querySelectorAll('button')).filter((b) => b.innerText.includes('Sample') && !b.innerText.includes('Load 4'));

      return {
        tagInputCount: tagInputs.length,
        captionInputCount: captionInputs.length,
        deleteButtonCount: deleteButtons.length,
        sampleButtonCount: sampleButtons.length,
        firstCaptionValue: captionInputs[0]?.value || '',
        firstTagValue: tagInputs[0]?.value || '',
      };
    });

    assert(
      photoDeckStats.tagInputCount === 4,
      `4 memory photo tag inputs found in StepMedia (actual: ${photoDeckStats.tagInputCount})`
    );
    assert(
      photoDeckStats.captionInputCount === 4,
      `4 memory photo caption inputs found in StepMedia (actual: ${photoDeckStats.captionInputCount})`
    );

    // Modify Photo 1 caption to "Parity Romance Test Caption"
    const testCaption = 'Parity Romance Test Caption';
    await page.evaluate((caption) => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      const captionInputs = inputs.filter((i) => i.placeholder && (i.placeholder.includes('Forever & Always') || i.placeholder.includes('❤️🌹')));
      if (captionInputs.length > 0) {
        const input = captionInputs[0];
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, caption);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, testCaption);

    await new Promise((r) => setTimeout(r, 600));

    // Verify real-time update in phone simulator
    const simulatorCaption = await page.evaluate(() => {
      const captionEl = document.querySelector('.card-active .memory-card-caption') || document.querySelector('.memory-card-caption');
      return captionEl ? captionEl.innerText : '';
    });
    assert(
      simulatorCaption.includes(testCaption),
      `Photo 1 caption immediately reflected in mobile phone simulator: "${simulatorCaption}"`
    );

    // =========================================================================
    // PART 4: ROMANCE BUILDER STUDIO - STEP 3 (LETTER & QUIZ)
    // =========================================================================
    console.log('\n[4/4] Testing Step 3 (Letter & Quiz Controls & Simulator Game)...');

    // Click Tab 3: "3. Letter & Quiz"
    const clickedTab3 = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tab3 = buttons.find((b) => b.innerText.includes('3. Letter & Quiz') || b.innerText.includes('3. Quiz'));
      if (tab3) {
        tab3.click();
        return true;
      }
      return false;
    });
    assert(clickedTab3, 'Switched to Tab 3: "3. Letter & Quiz" in Builder Studio');
    await new Promise((r) => setTimeout(r, 1000));

    // Verify Letter title, content, wax seals, and Quiz Question / Treat inputs exist
    const step3Fields = await page.evaluate(() => {
      const desktopContainer = document.querySelector('.hidden.lg\\:flex') || document;
      const inputs = Array.from(desktopContainer.querySelectorAll('input[type="text"]'));
      const textareas = Array.from(desktopContainer.querySelectorAll('textarea'));

      const letterTitleInput = inputs.find((i) => i.placeholder && i.placeholder.includes('To My Favorite Person'));
      const letterContentTextarea = textareas.find((t) => t.placeholder && t.placeholder.toLowerCase().includes('heartfelt'));
      const waxSealButtons = Array.from(desktopContainer.querySelectorAll('.grid.grid-cols-4 button'));

      const quizQuestionInput = inputs.find((i) => i.placeholder && (i.placeholder.includes('Valentine') || i.placeholder.includes('spending time')));
      const quizYesInput = inputs.find((i) => i.placeholder && i.placeholder.includes('YES'));
      const quizTreatInput = inputs.find((i) => i.placeholder && (i.placeholder.includes('Dairy Milk Silk') || i.placeholder.includes('Starbucks')));
      const quizVictoryNoteTextarea = textareas.find((t) => t.placeholder && t.placeholder.includes('chocolate / sweet treat'));

      return {
        hasLetterTitle: Boolean(letterTitleInput),
        hasLetterContent: Boolean(letterContentTextarea),
        waxSealCount: waxSealButtons.length,
        hasQuizQuestion: Boolean(quizQuestionInput),
        hasQuizYes: Boolean(quizYesInput),
        hasQuizTreat: Boolean(quizTreatInput),
        hasQuizVictoryNote: Boolean(quizVictoryNoteTextarea),
      };
    });

    assert(step3Fields.hasLetterTitle, 'Letter title input exists in Step 3');
    assert(step3Fields.hasLetterContent, 'Letter heartfelt note textarea exists in Step 3');
    assert(step3Fields.waxSealCount === 8, `Wax seal stamp palette buttons exist (count: ${step3Fields.waxSealCount}/8)`);
    assert(step3Fields.hasQuizQuestion, 'Quiz question input exists in Step 3');
    assert(step3Fields.hasQuizTreat, 'Quiz treat/voucher input exists in Step 3');

    // Modify Quiz Question to "Will you go on a coffee date with me?"
    // and Treat to "Special Hazelnut Latte ☕"
    const testQuizQuestion = 'Will you go on a coffee date with me?';
    const testTreat = 'Special Hazelnut Latte ☕';

    await page.evaluate(({ question, treat }) => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      const questionInput = inputs.find((i) => i.placeholder && (i.placeholder.includes('Valentine') || i.placeholder.includes('spending time')));
      if (questionInput) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(questionInput, question);
        questionInput.dispatchEvent(new Event('input', { bubbles: true }));
        questionInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const treatInput = inputs.find((i) => i.placeholder && (i.placeholder.includes('Dairy Milk Silk') || i.placeholder.includes('Starbucks')));
      if (treatInput) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(treatInput, treat);
        treatInput.dispatchEvent(new Event('input', { bubbles: true }));
        treatInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, { question: testQuizQuestion, treat: testTreat });

    await new Promise((r) => setTimeout(r, 800));

    // Ensure simulator is on Tab 3 (Quiz)
    await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.soft-nav-pills .nav-pill'));
      const quizPill = pills.find((p) => p.innerText.includes('Quiz') || p.innerText.includes('Treat'));
      if (quizPill) quizPill.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Verify the custom question reflects in simulator
    const simulatorQuestion = await page.evaluate(() => {
      const qEl = document.querySelector('.game-question');
      return qEl ? qEl.innerText : '';
    });
    assert(
      simulatorQuestion.includes(testQuizQuestion),
      `Custom Quiz Question reflected in simulator Tab 3: "${simulatorQuestion}"`
    );

    // Click the winning "YES" button to unlock dessert voucher
    const clickedYes = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.game-container button, .game-btn-yes'));
      const yesBtn = buttons.find((b) => b.innerText.includes('YES'));
      if (yesBtn) {
        yesBtn.click();
        return true;
      }
      return false;
    });
    assert(clickedYes, 'Clicked winning YES button in interactive Quiz simulator');
    await new Promise((r) => setTimeout(r, 800));

    // Verify custom treat voucher reflects value
    const simulatorTreat = await page.evaluate(() => {
      const ticketTitleEl = document.querySelector('.ticket-main-title');
      return ticketTitleEl ? ticketTitleEl.innerText : '';
    });
    assert(
      simulatorTreat.includes(testTreat) || simulatorTreat.includes('Special Hazelnut Latte'),
      `Custom Treat Voucher reflected in simulator victory ticket: "${simulatorTreat}"`
    );

    // Verify 0 console errors and uncaught exceptions
    assert(
      consoleErrors.length === 0,
      `0 console errors encountered (actual: ${consoleErrors.length}${consoleErrors.length > 0 ? ': ' + consoleErrors.join(' | ') : ''})`
    );
    assert(
      uncaughtExceptions.length === 0,
      `0 uncaught exceptions encountered (actual: ${uncaughtExceptions.length}${uncaughtExceptions.length > 0 ? ': ' + uncaughtExceptions.join(' | ') : ''})`
    );

  } catch (err) {
    console.error('Fatal error during QA script execution:', err);
    failedChecks++;
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`🏆 QA VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} assertions passed (${failedChecks} failed).`);
  console.log('================================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQaRomanceFormAndHome();
