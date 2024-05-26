const { firefox } = require('playwright');

(async () => {
  // Launch a browser
  const browser = await firefox.launch({ headless: true }); // Set headless to true if you don't want to see the browser
  let votes = 0;

  // Create a new browser context with notifications blocked
  const context = await browser.newContext({
    permissions: ['geolocation'], // you can add other permissions if needed
  });

  // Block notifications
  await context.grantPermissions([], { origin: 'https://www.nola.com' });

  
  // Define the main function to be run in a loop
  async function performActions() {
    const page = await context.newPage();

    try {
      // Navigate to the specified URL
      await page.goto('https://www.nola.com/entertainment_life/eat-drink/vote-for-best-burger-in-new-orleans-louisiana/article_ff0ee944-0d66-11ef-8ec2-379be548083f.html');
      // Wait for the input field to appear on the page
    await page.waitForSelector('input[name="Enter response"]');


      // Check if the input with the specific "name" attribute is visible on the page
      const inputLocator = page.locator('input[name="Enter response"]');
      if (await inputLocator.isVisible()) {
        console.log('Input field found.');
        // Fill the input field with "YES"
        await inputLocator.fill('YES');
      } else {
        console.error('Input field not found.');
      }

      // Find the button with the text "Submit" and click it if it's visible
      const submitButtonLocator = page.locator('text=Submit');
      if (await submitButtonLocator.isVisible()) {
        await submitButtonLocator.click();
        console.log('Submit button clicked.');
      } else {
        console.error('Submit button not found.');
      }

      // Wait for the page to transition after submitting
    //   await page.waitForLoadState('networkidle');

      // Wait for the specific div with the text "Atomic Burger, Metairie" to appear and click it
      const atomicBurgerLocator = page.locator('text=Atomic Burger, Metairie');
      await atomicBurgerLocator.waitFor(); // Wait for the element to appear
      await atomicBurgerLocator.click();
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Clicked on "Atomic Burger, Metairie".');
      votes++;
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await page.close();
    }
  }

  // Run the main function in a loop
  while (true) {
    try {
      await performActions();
      // Wait between 3 to 30 seconds before running the loop again
      const delay = Math.floor(Math.random() * 270) + 300; // Random delay between 3000ms (3s) and 30000ms (30s)
      console.log(`Waiting for ${delay / 1000} seconds before next iteration. Total votes: ${votes}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    } catch (error) {
      console.error('An error occurred in the main loop:', error);
      // Wait a short interval before retrying
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 seconds
    }
  }

  // Close the browser after the loop (this will never be reached in the infinite loop)
  // await browser.close();
})();
