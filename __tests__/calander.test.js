const util = require('../util/mongodbutil.js');
const {URI} = require('../_config.js');
const puppeteer = require('puppeteer');
jest.setTimeout(60000);

describe('Calendar View', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5500/calendar');
  });

  test('should render correctly', async () => {
    const allTasksFromMongoDB = await util.read(URI, 'todoapp', 'posts', {});
    let current_date = new Date();
    let current_month = current_date.getUTCMonth();
    let year = current_date.getUTCFullYear();

    const tasks = await page.evaluate(() => {
      const taskElements = document.querySelectorAll('.date-cell div');
      taskList=[];
      taskElements.forEach(task => {
        taskList.push(task.innerHTML.trim());
      });
      return taskList;
    });

    //since the calander will load the month of the current date, it is expected that all the tasks in the 
    //database that are set to this month and year should be displayed onto the page.
    let totalTasks = 0;
    for(let task=0; task<allTasksFromMongoDB.length; task++){
      let date = new Date(allTasksFromMongoDB[task].date);
      if (date.getUTCMonth() === current_month && date.getUTCFullYear() === year){
        //regular expression to remove html tags and exclamation marks for the tasks that have a priority on them.
        expect(tasks.map(task => task.replace(/<[^>]*>|!{0,3}|\s+/g, '').trim())).toContain(allTasksFromMongoDB[task].title);
        totalTasks++;
      }
    }
    expect(tasks.length).toEqual(totalTasks);
  });

  afterAll(async () => {
    await browser.close();
  });
});


describe('Current month displays properly ', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5500/calendar');
  });

  test('The current month and year should be displayed in calendar.ejs page', async () => {
    let current_date = new Date();
    let allMonthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
      ];
    let current_month = current_date.getUTCMonth();
    let current_year = current_date.getUTCFullYear();

    const month_in_calendar = await page.evaluate(() => {
      return document.getElementById('month').innerHTML;
    });
    const year_in_calendar = await page.evaluate(() => {
      return document.getElementById('year').innerHTML;
    });

    expect(allMonthNames[current_month]).toEqual(month_in_calendar);
    expect(current_year.toString()).toEqual(year_in_calendar);
  });

  afterAll(async () => {
    await browser.close();
  });
});


describe('When the <- button is pressed, the previous month is displayed on the calendar', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5500/calendar');
  });

  test('previous month is displayed', async () => {
    await page.click('#go_back_month');
    let current_date = new Date();
    let allMonthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
      ];
    let current_month = current_date.getUTCMonth();
    let current_year = current_date.getUTCFullYear();

    const month_in_calendar = await page.evaluate(() => {
      return document.getElementById('month').innerHTML;
    });
    const year_in_calendar = await page.evaluate(() => {
      return document.getElementById('year').innerHTML;
    });

    let previous_month=0;
    if (current_month === 0){
      previous_month=11;
      current_year-=1; 
    }else{
      previous_month=current_month-1;
    }
    expect(month_in_calendar).toEqual(allMonthNames[previous_month]);
    expect(year_in_calendar).toEqual(current_year.toString());
    
  });

  afterAll(async () => {
    await browser.close();
  });
});


describe('When the -> button is pressed, the next month is displayed on the calendar', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5500/calendar');
  });

  test('next month is displayed', async () => {
    await page.click('#go_forward_month');
    let current_date = new Date();
    let allMonthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
      ];
    let current_month = current_date.getUTCMonth();
    let current_year = current_date.getUTCFullYear();

    const month_in_calendar = await page.evaluate(() => {
      return document.getElementById('month').innerHTML;
    });
    const year_in_calendar = await page.evaluate(() => {
      return document.getElementById('year').innerHTML;
    });

    let next_month=0;
    if (current_month === 11){
      next_month=0;
      current_year+=1; 
    }else{
      next_month=current_month+1;
    }
    expect(month_in_calendar).toEqual(allMonthNames[next_month]);
    expect(year_in_calendar).toEqual(current_year.toString());
    
  });

  afterAll(async () => {
    await browser.close();
  });
});

