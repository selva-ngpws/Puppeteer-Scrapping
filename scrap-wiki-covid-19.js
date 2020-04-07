const puppeteer =  require('puppeteer')
const fs = require('fs')

const scrap = async () =>{
    const browser = await puppeteer.launch({headless : false}); //browser initiate
    const page = await browser.newPage();  // opening a new blank page
    await page.goto('https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory', {waitUntil : 'domcontentloaded'}) // navigate to url and wait until page loads completely

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

    // writting to a file 
    fs.writeFile('covid-19.json',JSON.stringify(recordList, null, 2),(err)=>{
        if(err){console.log(err)}
        else{console.log('Saved Successfully!')}
    })

};

scrap();