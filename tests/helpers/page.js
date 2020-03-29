const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/session');
const userFactory = require('../factories/user');

class MyPage {

    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args:['--no-sandbox']
        });

        const page = await browser.newPage();
        const myPage = new MyPage(page);

        return new Proxy(myPage, {
            get: function (target, property) {
                return myPage[property] || browser[property] || page[property];
            }
        });

    }

    constructor(page) {

        this.page = page;
    }

    async login() {
        const { session, sig } = sessionFactory(await userFactory())
        await this.page.setCookie({ name: "session", value: session });
        await this.page.setCookie({ name: "session.sig", value: sig });
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContent(selector){
        return this.page.$eval(selector, el => el.innerHTML);
    }

}

module.exports = MyPage;