const util = require('../util/mongodbutil.js');
const {URI} = require('../_config.js');
const puppeteer = require('puppeteer');

describe('Calendar View', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5500/calander');
  });

  test('should render correctly', async () => {
    const allTasksFromMongoDB = await util.read(URI, 'todoapp', 'posts', {});
    let current_date = new Date();
    let current_month = current_date.getUTCMonth();
    let year = current_date.getUTCFullYear();

    const tasks = await page.evaluate(() => {
      const taskElements = document.querySelectorAll('.date-cell div');
      return Array.from(taskElements).map(taskElement => taskElement.textContent);
    });

    //since the calander will load the month of the current date, it is expected that all the tasks in the 
    //database that are set to this month and year should be displayed onto the page.
    let totalTasks = 0;
    for(let task=0; task<allTasksFromMongoDB.length; task++){
      let date = new Date(allTasksFromMongoDB[task].date);
      if (date.getUTCMonth() === current_month && date.getUTCFullYear() === year){
        expect(tasks).toContain(allTasksFromMongoDB[task].title);
        totalTasks++;
      }
    }
    expect(tasks.length).toEqual(totalTasks);
  });

  afterAll(async () => {
    await browser.close();
  });
});