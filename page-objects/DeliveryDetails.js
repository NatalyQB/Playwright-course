import { expect } from "@playwright/test"

export class DeliveryDetails {
    constructor(page){
        this.page = page
        this.firstNameInput = page.locator('[data-qa="delivery-first-name"]')
        this.lastNameInput = page.locator('[data-qa="delivery-last-name"]')
        this.streetInput = page.locator('[data-qa="delivery-address-street"]')
        this.postcodeInput = page.locator('[data-qa="delivery-postcode"]')
        this.cityInput = page.locator('[data-qa="delivery-city"]')
        this.countryDropdown = page.locator('[data-qa="country-dropdown"]')
        this.saveAddressButton = page.getByRole('button', { name: 'Save address for next time' })
        this.savedAddressContainer = page.locator('[data-qa="saved-address-container"]')
        this.saveAddressFirstName = page.locator('[data-qa="saved-address-firstName"]') // Corregir nombre aquí
        this.saveAddressLastName = page.locator('[data-qa="saved-address-lastName"]')
        this.saveAddressStreet = page.locator('[data-qa="saved-address-street"]')
        this.saveAddressPostcode = page.locator('[data-qa="saved-address-postcode"]')
        this.saveAddressCity = page.locator('[data-qa="saved-address-city"]')
        this.saveAddressCountry = page.locator('[data-qa="saved-address-country"]')
        this.continueToPaymentButton = page.getByRole('button', {name:'Continue to payment'})

    }

    fillDetails = async (userAddress) => {
        await this.firstNameInput.fill(userAddress.firstName) 
        await this.lastNameInput.fill(userAddress.lastName)
        await this.streetInput.fill(userAddress.street)
        await this.postcodeInput.fill(userAddress.postcode)
        await this.cityInput.fill(userAddress.city)
        await this.countryDropdown.selectOption(userAddress.country)
    }

    saveDetails = async () => {
        const addressCountBeforeSaving = await this.savedAddressContainer.count()
        await this.saveAddressButton.waitFor()
        await this.saveAddressButton.click()
        await expect(this.savedAddressContainer).toHaveCount(addressCountBeforeSaving + 1)

        await this.saveAddressFirstName.first().waitFor({ state: 'visible', timeout: 60000 })
        expect(await this.saveAddressFirstName.first().innerText()).toBe(await this.firstNameInput.inputValue())

        await this.saveAddressLastName.first().waitFor({ state: 'visible' })
        expect(await this.saveAddressLastName.first().innerText()).toBe(await this.lastNameInput.inputValue())

        await this.saveAddressStreet.first().waitFor({ state: 'visible' })
        expect(await this.saveAddressStreet.first().innerText()).toBe(await this.streetInput.inputValue())

        await this.saveAddressCity.first().waitFor({ state: 'visible' })
        expect(await this.saveAddressCity.first().innerText()).toBe(await this.cityInput.inputValue())

        await this.saveAddressPostcode.first().waitFor({ state: 'visible' })
        expect(await this.saveAddressPostcode.first().innerText()).toBe(await this.postcodeInput.inputValue())

        await this.saveAddressCountry.first().waitFor({ state: 'visible' })
        expect(await this.saveAddressCountry.first().innerText()).toBe(await this.countryDropdown.inputValue())
    }     

    continueToPayment = async () => {
        await this.continueToPaymentButton.waitFor()
        await this.continueToPaymentButton.click()
        await this.page.waitForURL("http://localhost:2221/payment", {timeout:6000})
        
    }
}
