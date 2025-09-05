// @ts-check
import { expect, test } from '@playwright/test';
import AllPages from '../pages/AllPages.js';
import dotenv from 'dotenv';
dotenv.config({ override: true });

let allPages;

test.beforeEach(async ({ page }) => {
  allPages = new AllPages(page);
  await page.goto('/');
});

async function login(username = process.env.USERNAME, password = process.env.PASSWORD) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

async function login1(username = process.env.USERNAME1, password = process.env.PASSWORD) {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.validateSignInPage();
  await allPages.loginPage.login(username, password);
}

async function logout() {
  await allPages.loginPage.clickOnUserProfileIcon();
  await allPages.loginPage.clickOnLogoutButton();
}

test('Verify that user can login and logout successfully', async () => {
  await login();
  await logout();
});

// test('Verify that user can update personal information', async () => {
//   await login();
//   await allPages.userPage.clickOnUserProfileIcon();
//   await allPages.userPage.updatePersonalInfo();
//   await allPages.userPage.verifyPersonalInfoUpdated();
// });

// test('Verify that User Can Add, Edit, and Delete Addresses after Logging In', async () => {
//     await login();

//   await test.step('Verify that user is able to add address successfully', async () => {
//     await allPages.userPage.clickOnUserProfileIcon();
//     await allPages.userPage.clickOnAddressTab();
//     await allPages.userPage.clickOnAddAddressButton();
//     await allPages.userPage.fillAddressForm();
//     await allPages.userPage.verifytheAddressIsAdded();
//   });

//   await test.step('Verify that user is able to edit address successfully', async () => {
//     await allPages.userPage.clickOnEditAddressButton();
//     await allPages.userPage.updateAddressForm();
//     await allPages.userPage.verifytheUpdatedAddressIsAdded();
//   })

//   await test.step('Verify that user is able to delete address successfully', async () => {
//     await allPages.userPage.clickOnDeleteAddressButton();
//   });
// });

// test('Verify that user can change password successfully', async () => {
//   await test.step('Login with existing password', async () => {
//     await login1();
//   });

//   await test.step('Change password and verify login with new password', async () => {
//     await allPages.userPage.clickOnUserProfileIcon();
//     await allPages.userPage.clickOnSecurityButton();
//     await allPages.userPage.enterNewPassword();
//     await allPages.userPage.enterConfirmNewPassword();
//     await allPages.userPage.clickOnUpdatePasswordButton();
//     await allPages.userPage.getUpdatePasswordNotification();
//   });
//   await test.step('Verify login with new password and revert back to original password', async () => {
//     // Re-login with new password
//     await logout();
//     await allPages.loginPage.login(process.env.USERNAME1, process.env.NEW_PASSWORD);

//     // Revert back
//     await allPages.userPage.clickOnUserProfileIcon();
//     await allPages.userPage.clickOnSecurityButton();
//     await allPages.userPage.revertPasswordBackToOriginal();
//     await allPages.userPage.getUpdatePasswordNotification();
//   })
// });


test('Verify new user views and cancels an order in my orders', async () => {
    const email = `test+${Date.now()}@test.com`;
    const firstName = 'Test';
    const lastName = 'User';

    let productName= `Rode NT1-A Condenser Mic`;

  await test.step('Verify that user can register successfully', async () => {
    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.clickOnSignupLink();
    await allPages.signupPage.assertSignupPage();
    await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
    await allPages.signupPage.verifySuccessSignUp();
  })

  await test.step('Verify that user can login successfully', async () => {
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.login(email, process.env.PASSWORD);
    await allPages.loginPage.verifySuccessSignIn();
    await expect(allPages.homePage.getHomeNav()).toBeVisible({ timeout: 30000 });
  })

  await test.step('Navigate to All Products and add view details of a random product', async () => {
    await allPages.homePage.clickAllProductsNav();
    await allPages.allProductsPage.assertAllProductsTitle();
    productName = await allPages.allProductsPage.getNthProductName(1);
    await allPages.allProductsPage.clickNthProduct(1);
    await allPages.productDetailsPage.clickAddToCartButton();
  })

  await test.step('Add product to cart, add new address and checkout', async () => {
    await allPages.productDetailsPage.clickCartIcon();
    await allPages.cartPage.assertYourCartTitle();
    await expect(allPages.cartPage.getCartItemName()).toContainText(productName, { timeout: 10000 });
    await allPages.cartPage.clickOnCheckoutButton();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.fillShippingAddress(
      firstName, email, 'New York', 'New York', '123 Main St', '10001', 'United States'
    );
    await allPages.checkoutPage.clickSaveAddressButton();
    await allPages.checkoutPage.assertAddressAddedToast();
  })

  await test.step('Complete order and verify in my orders', async () => {
    await allPages.checkoutPage.selectCashOnDelivery();
    await allPages.checkoutPage.verifyCheckoutTitle();
    await allPages.checkoutPage.clickOnPlaceOrder();
    await allPages.checkoutPage.verifyOrderPlacedSuccessfully();
    await allPages.inventoryPage.clickOnContinueShopping();

    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.orderPage.clickOnMyOrdersTab();
    await allPages.orderPage.clickCancelOrderButton();
    await allPages.orderPage.confirmCancellation();
  });
});


test('Verify that the new user is able to Sign Up, Log In, and Navigate to the Home Page Successfully', async () => {
    const email = `test+${Date.now()}@test.com`;
    const firstName = 'Test';
    const lastName = 'User';

  await test.step('Verify that user can register successfully', async () => {
    await allPages.loginPage.clickOnUserProfileIcon();
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.clickOnSignupLink();
    await allPages.signupPage.assertSignupPage();
    await allPages.signupPage.signup(firstName, lastName, email, process.env.PASSWORD);
    await allPages.signupPage.verifySuccessSignUp();
  })

  await test.step('Verify that user can login successfully', async () => {
    await allPages.loginPage.validateSignInPage();
    await allPages.loginPage.login(email, process.env.PASSWORD);
    await allPages.loginPage.verifySuccessSignIn();
    await expect(allPages.homePage.getHomeNav()).toBeVisible({ timeout: 30000 });
  })
})
