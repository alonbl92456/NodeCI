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
});


describe('When logged in !', async () =>{
    beforeEach( async ()=>{
        await page.login();
        await page.click('a[href="/blogs/new"]');
    });

    test('Can see create blog form', async ()=>{
        const label = await page.getContent('form label');
    
        expect(label).toEqual("Blog Title");
    
    });

    describe('And using invalid inputs', async() =>{

        beforeEach(async ()=>{
            await page.click("form button")
        });

        test('the form show an error message', async () =>{
            const titleError = await page.getContent('.title .red-text');
            const contentError = await page.getContent('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');

        });
    });

    describe('And using valid inputs', async() =>{

        beforeEach(async ()=>{
            await page.type('form input[name=title]',"Some rand title");
            await page.type('form input[name=content]',"Some rand content");
            await page.click("form button");

        });

        test('Submitting takes user to review screen', async () =>{
            const saveBtn = await page.getContent('form .green');
            expect(saveBtn).toEqual('Save Blog<i class=\"material-icons right\">email</i>');
            
        });

        test('submeeting and saving adds to blog to index page', async ()=>{
            await page.click('form .green');
            await page.waitFor('.card-title');
            const blogTitle = await page.getContent('.card-title');

            expect(blogTitle).toEqual('Some rand title');

        });
    });
});