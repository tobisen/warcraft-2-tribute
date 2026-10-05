import assert from 'node:assert/strict';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
// Headless macOS does not expose the native select popup through :open.

 for(const width of [800,1280])for(const mode of ['campaign','skirmish'])for(const id of ['faction-select','difficulty-select']) {
  const browser=await chromium.launch({executablePath:process.env.W2T_BROWSER_EXECUTABLE,headless:false});
  try {const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5184');
  await page.locator(`#menu-${mode}`).click();
  if(mode==='campaign'&&id==='difficulty-select')await page.locator('#campaign-next-faction').click();
  const select=page.locator(`#${id}`);
  const next=await select.evaluate(node=>{const options=[...node.options].filter(option=>!option.disabled&&!option.hidden);return options[(options.findIndex(option=>option.value===node.value)+1)%options.length].value;});
  // Persistence is checked separately; selectOption does not test the popup.
  await select.selectOption(next);await page.waitForTimeout(600);assert.equal(await select.inputValue(),next);
  await page.bringToFront();await select.click();await page.waitForTimeout(600);
  assert(await select.evaluate(node=>node.matches(':open')),`${mode}/${id}: popup closed during scene updates`);
  assert.deepEqual(errors,[]);console.log(`${width}/${mode}/${id} PASS`);
  }finally{await browser.close();}
 }
 console.log('Native mouse-open popup survives 600ms of scene updates; separate value persistence: campaign/skirmish faction/difficulty at 800/1280 PASS');

