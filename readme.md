### SCRAPPING TABLE FROM WIKIPEDIA USING PUPPETEER 

1. To initialze a project ```npm init``` 
2. Couple of questions will come regading the project just answer and proceed.

Lets Move on to Puppeteer
Two ways you can install puppeteer
1. ```npm i puppeteer```
    Note: When you install Puppeteer, it downloads a recent version of Chromium (~170MB Mac, ~282MB Linux, ~280MB Win) that is guaranteed to work with the API.
2. ```npm i puppeteer-core```
    puppeteer-core is a lightweight version of Puppeteer which does not install chromium by default and uses a existing browser. 

It's your wish to proceed with any of the above, I am going to move on with ```npm i puppeteer```.

1. Import puppeteer 
    ```
    const puppeteer =  require('puppeteer');
    ```
2. Launch browser -> Open new page -> Goto the respective page
    ```
    const browser = await puppeteer.launch({headless : false}); 
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/1896_Summer_Olympics', {waitUntil : 'domcontentloaded'}) // wait until page loads completely
    ```
3. Scrapping the olympic medal table
    ```
    const recordList = await page.$$eval('table.wikitable.sortable.plainrowheaders.jquery-tablesorter tbody tr',(trows) => {
        let rowList = []
        trows.forEach(row =>{
            let record = {'rank' : '','country' : '','gold' :'', 'silver' : '', 'bronze':''}
            record.country  = row.querySelector('th').innerText; 
            const tdList    = Array.from(row.querySelectorAll('td') , column => column.innerText); 
            record.rank     = tdList[0];
            record.gold     = tdList[1];
            record.silver   = tdList[2];
            record.bronze   = tdList[3];
            rowList.push(record)
        });
    });

    recordList.pop() //popping out last element
    console.log(recordList)
    await page.screenshot({ path: 'screenshots/wikipedia.png' }); //screenshot 
    ```