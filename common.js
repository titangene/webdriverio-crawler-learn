class Common {
  constructor() {
    this.port = 9515;
  }
  
  get args() {
    return [
      '--url-base=wd/hub',
      `--port=${this.port}`
    ]
  }

  get options_chrome() {
    return {
      port: this.port,
      desiredCapabilities: {
        browserName: 'chrome'
      }
    }
  }

  get options_phantomjs() {
    return {
      desiredCapabilities: {
        browserName: 'phantomjs'
      }
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = new Common();