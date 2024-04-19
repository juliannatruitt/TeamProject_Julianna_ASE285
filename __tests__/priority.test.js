const util = require('../util/mongodbutil.js');
const {URI} = require('../_config.js');
const puppeteer = require('puppeteer');
jest.setTimeout(60000)


describe('Adding low priority task', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5500/');
  });
  test('Selecting low priority task to database', async () => {
    await page.type('input[name="title"]', 'Unit Test Low Priority');
    await page.type('input[name="date"]', '2024-04-14');
    await page.select('select[name=priority]', 'low');

    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]'),
    ]);


    const unit_test_task = await util.read(URI, 'todoapp', 'posts', {title: 'Unit Test Low Priority'});
    expect(unit_test_task[0].priority).toBe("low");
  });

  afterAll(async () => {
    await browser.close();
  });
});


describe('Adding medium priority task', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5500/');
  });
  test('Selecting medium priority task to database', async () => {
    await page.type('input[name="title"]', 'Unit Test Medium Priority');
    await page.type('input[name="date"]', '2024-04-15');
    await page.select('select[name=priority]', 'medium');

    await Promise.all([
      page.waitForNavigation(), 
      page.click('button[type="submit"]'), 
    ]);

    const unit_test_task = await util.read(URI, 'todoapp', 'posts', {title: 'Unit Test Medium Priority'});
    expect(unit_test_task[0].priority).toBe("medium");
  });

  afterAll(async () => {
    await browser.close();
  });
});


describe('Adding high priority task', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5500/');
  });
  test('Selecting high priority task to database', async () => {
    await page.type('input[name="title"]', 'Unit Test High Priority');
    await page.type('input[name="date"]', '2024-04-16');
    await page.select('select[name=priority]', 'high');

    await Promise.all([
      page.waitForNavigation(), 
      page.click('button[type="submit"]'), 
    ]);


    const unit_test_task = await util.read(URI, 'todoapp', 'posts', {title: 'Unit Test High Priority'});
    expect(unit_test_task[0].priority).toBe("high");

  });

  afterAll(async () => {
    await browser.close();
  });
});