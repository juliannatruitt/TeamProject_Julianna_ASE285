const util = require('../util/mongodbutil.js');
const {URI} = require('../_config.js');
const puppeteer = require('puppeteer');
jest.setTimeout(60000);

describe('Adding new tag to task', () => {
    let browser;
    let page;
  
    beforeAll(async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
      await page.goto('http://localhost:5500/');
    });
    test('Adding a new tag to a task gets stored in database correctly', async () => {

        await page.type('input[name="title"]', 'Unit Test New Tag');
        await page.type('input[name="date"]', '2024-04-14');
        await page.select('select[name=priority]', 'none');

        await page.click('#gotoNewTagModal');
        await page.waitForSelector('#newTagModal');
        await page.type('#newTagInput', 'UnitTestTag');
        await page.click('#saveChanges');
        await page.waitForSelector('#newTagModal', { hidden: true });
        await page.select('select[name=tag]', 'UnitTestTag');

        await Promise.all([
            page.waitForNavigation(),
            page.click('button[type="submit"]'),
          ]);

        const unit_test_task = await util.read(URI, 'todoapp', 'posts', {title: 'Unit Test New Tag'});
        expect(unit_test_task[0].tag).toBe("UnitTestTag");
    });
  
    afterAll(async () => {
      await browser.close();
    });
});


describe('Using a tag that already exists', () => {
    let browser;
    let page;
  
    beforeAll(async () => {
      browser = await puppeteer.launch();
      page = await browser.newPage();
      await page.goto('http://localhost:5500/');
    });
    test('using a tag that already exists to make a new tag', async () => {

        const all_tasks = await util.read(URI, 'todoapp', 'posts', {});
        let allTags = new Set();
          for (var i=0; i < all_tasks.length; i++){
            if (all_tasks[i].tag){
              allTags.add(all_tasks[i].tag)
            } 
        } 
        allTags = Array.from(allTags);
        console.log(allTags[0]);

        //using the first tag found in database, assuming that a tag has already been created
        await page.type('input[name="title"]', 'Unit Test Using Already Created Tag');
        await page.type('input[name="date"]', '2024-04-14');
        await page.select('select[name=priority]', 'none');
        await page.select('select[name=tag]', `${allTags[0]}`);

        await Promise.all([
            page.waitForNavigation(),
            page.click('button[type="submit"]'), 
          ]);

        const unit_test_task = await util.read(URI, 'todoapp', 'posts', {title: 'Unit Test Using Already Created Tag'});
        expect(unit_test_task[0].tag).toBe(`${allTags[0]}`);
    });
  
    afterAll(async () => {
      await browser.close();
    });
 });
  