const puppeteer =  require('puppeteer')

const scrap = async () =>{
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/1896_Summer_Olympics', {waitUntil : 'domcontentloaded'}) // wait until page loads completely
    
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
    // browser.close();
};

scrap();