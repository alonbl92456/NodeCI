let  page;
const Page = require('./helpers/page');

// Inits chrome before every test
beforeEach( async()=>{
  
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

// Closes chrome after every test
afterEach(async ()=>{
   
     await page.close();
})

test('We can launch it!', async () => {
    const text = await page.getContent('a.brand-logo');

    expect(text).toEqual("Blogster");

});

test('Press google oAuth buttom', async () => {
    const text = await page.click('.right a', el => el.innerHTML);
    const url = page.url();

    expect(url).toContain("google");

});

test('When sign in, show logout button', async () => {

    await page.login();
    const text = await page.getContent('a[href="/auth/logout"]');

    expect(text).toEqual("Logout");

});


