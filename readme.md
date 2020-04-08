### SCRAPPING TABLE FROM WIKIPEDIA USING PUPPETEER 

1. Initialze the project with  ```npm init``` 
2. Couple of questions will come regarding the project just answer and proceed.

Lets Move on to Puppeteer
Two ways you can install puppeteer
1. ```npm i puppeteer```
    Note: When you install Puppeteer, it downloads a recent version of Chromium (~170MB Mac, ~282MB Linux, ~280MB Win) that is guaranteed to work with the API.
2. ```npm i puppeteer-core```
    puppeteer-core is a lightweight version of Puppeteer which does not install chromium by default and uses a existing browser. 

It's your wish to proceed with any of the above, I am going to move on with ```npm i puppeteer```.

1. Import puppeteer 
    ```javascript
    const puppeteer =  require('puppeteer');
    ```
2. Launch browser -> Open new page -> Goto the respective page
    ```javascript
   const browser = await puppeteer.launch({headless : false}); //browser initiate
    const page = await browser.newPage();  // opening a new blank page
    await page.goto('https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory', {waitUntil : 'domcontentloaded'}) // navigate to url and wait until page loads completely
    ```
3. Scrapping the covid data from wikipedia table
    ```javascript
    const recordList = await page.$$eval('div#covid19-container table#thetable tbody tr',(trows)=>{
        let rowList = []    
        trows.forEach(row => {
                let record = {'country' : '','cases' :'', 'death' : '', 'recovered':''}
                record.country = row.querySelector('a').innerText; // (tr < th < a) anchor tag text contains country name
                const tdList = Array.from(row.querySelectorAll('td'), column => column.innerText); // getting textvalue of each column of a row and adding them to a list.
                record.cases = tdList[0];       // first column contains number of cases
                record.death = tdList[1];       // second column contains number of deaths
                record.recovered = tdList[2];   // third column contains number of recovered
                if(tdList.length >= 3){         // push only valid rows.
                    rowList.push(record)
                }
            });
        return rowList;
    })
    console.log(recordList)
    await page.screenshot({ path: 'screenshots/wikipedia.png' }); //screenshot 
    browser.close();
    ```
4. Storing in File
    ```javascript
    // writting to a file 
    fs.writeFile('covid-19.json',JSON.stringify(recordList, null, 2),(err)=>{
        if(err){console.log(err)}
        else{console.log('Saved Successfully!')}
    })
    ```