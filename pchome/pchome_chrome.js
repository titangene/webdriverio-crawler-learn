const common = require('../common')
const cheerio = require('cheerio')
const webdriverio = require('webdriverio')
const chromedriver = require('chromedriver')

chromedriver.start(common.args)
var client = webdriverio.remote(common.options_chrome)

var x = 0, y = 2000
var productSum = 0, products = []
var $

var keyword = process.argv[2]
keyword = keyword || "logitech mouse"   // 未自訂 keyword 時，預設值為 "logitech mouse"

client
  .init()
  .url('http://24h.pchome.com.tw/')
  .pause(common.getRandomInt(2000, 5000))   // 模擬人延遲
  .setValue('input#keyword', keyword).then(() => {
    console.log(`查詢 "${keyword}" 相關商品`)
  })
  .click('input#doSearch')
  .waitForExist('div#ItemContainer', 3000)
  .getText('span#SearchInfo span').then(res => {
    productSum = res
    console.log(`共找到 ${res} 筆商品`)
  })
  .pause(2000).then(() => {
    for (var i = 0; i < productSum; i += 1) {
      client.scroll(x, y)
      .getSource().then(body => {
        $ = cheerio.load(body)
        products = $('dl.col3f')
      })
      x += 1500
      y += 1500
      if (products.length == productSum) break
    }
  })
  .pause(3000)
  .then(() => {
    products.each(function (index, product) {
      if (products.length - 1 == index) {
        productName = $(this).find('h5').text()
        productPrice = $(this).find('.price').text()
        console.log(`No.${index + 1}: ${productPrice} - ${productName}`)
      }
    })
  })
  .then(function() {
    return this.catch(function(e) {
        console.log('[webdriverio error] ' + e.message)
    });
  })
  .then(function() {
    this.end().then(function() {
      chromedriver.stop()
    })
  })
  .catch(function(err) {
      console.log(err)
      chromedriver.stop()
  })