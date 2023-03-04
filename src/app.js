const chromium = require('@sparticuz/chrome-aws-lambda');

exports.handler = async (event) => {
  const agent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
  const url = process.env.SITE_URL;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();
    await page.setUserAgent(agent);

    console.log('Navigating to page: ', url);
    await page.goto(url, { waitUntil: 'networkidle0' });

    console.log('Starting login');
    const loginElement = await page.waitForXPath(
      '/html/body/app-root/div/fengstlayout-header/header/nav/a[1]'
    );
    await loginElement.click();

    console.log('Typing e-mail');
    const inputEmailElement = await page.waitForXPath(
      '//fengstauth-modal-auth-st/div/div/mat-dialog-content/div[3]/form/fengstui-input[1]'
    );
    await inputEmailElement.click();
    await inputEmailElement.type(process.env.SITE_USER, { delay: 200 });

    console.log('Typing password');
    const inputSenhaElement = await page.waitForXPath(
      '//fengstauth-modal-auth-st/div/div/mat-dialog-content/div[3]/form/fengstui-input[2]'
    );
    await inputSenhaElement.click();
    await inputSenhaElement.type(process.env.SITE_PASS, { delay: 200 });

    const btnEntrarElement = await page.waitForXPath(
      '//fengstauth-modal-auth-st/div/div/mat-dialog-content/div[3]/form/fengstui-button/button'
    );
    await btnEntrarElement.click();
    console.log('Login successfully');

    await page.waitForTimeout(2500);
    const content = await page.evaluate(() => document.body.innerHTML);
    await browser.close();
    return {
      statusCode: 200,
      body: JSON.stringify({
        content,
      }),
    };
  } catch (error) {
    console.log('Erro ao Realizar o Login', error);
    await browser.close();
    return {
      statusCode: 500,
      body: error,
    };
  }
};
