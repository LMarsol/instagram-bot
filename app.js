const puppeteer = require('puppeteer')
const url = 'https://www.instagram.com/p/B_yVsMrnbvt/'
const searchBtnTimeout = 5000
const moreBtnSelector = '.dCJp8'
const commentSelector = '.C4VMK span'

async function scanPage(url) {
    //load instagram page
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    //loading all commentS

    await loadComments(page, moreBtnSelector)
    const comments = await getComments(page, commentSelector)

    console.log(comments)
}

async function loadComments(page, selector) {
    const loadMoreBtn = await page.$(selector)

    if(loadMoreBtn) {
        console.log('clicked for more comments...')
        await loadMoreBtn.click()
        await page.waitFor(selector, {timeout: searchBtnTimeout}).catch(() => {console.log('no more comments to read')})
        await loadComments(page, selector)
    }
}

async function getComments(page, selector) {
    const comments = await page.$$eval(selector, comments => comments.map(comment => comment.innerText))
    return comments
}

scanPage(url)