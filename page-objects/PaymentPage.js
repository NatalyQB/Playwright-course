import { expect } from "@playwright/test"
import exp from "constants"

export class PaymentPage {
    constructor(page){
        this.page = page
        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]')
        this.discountInput = page.getByPlaceholder('Discount code')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
        this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]')
        this.creditCardOwnerInpunt = page.getByPlaceholder("Credit card owner")
        this.creditCardNumberInpunt = page.getByPlaceholder("Credit card number")
        this.creditCardValidUntilInput = page.getByPlaceholder("Valid until")
        this.creditCardCvcInput = page.getByPlaceholder("Credit card CVC")
        this.payButton = page.locator('[data-qa="pay-button"]')


                            }
    activateDiscount = async() =>{
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor()

        //Option 1 for Laggy inputs : using .fill()with await expect()
        await this.discountInput.fill(code)
           //----expect (await this.discountInput.inputValue()).toBe(code)
        await expect (this.discountInput).toHaveValue(code)


        //Option 2 for Laggy inputs: using slow_typing (escribir lentamente el codigo)
        //await this. discountInput.focus()
        //await this.page.keyboard.type(code, {delay:1000})
        //expect(await this.discountInput.inputValue()).toBe(code)



        expect (await this.discountedValue.isVisible()).toBe(false)
        expect (await this.discountActiveMessage.isVisible()).toBe(false)
        await this.activateDiscountButton.waitFor()
        await this.activateDiscountButton.click()
        await this.discountActiveMessage.waitFor()

        await this.discountedValue.waitFor()
        const discountValueText = await this.discountedValue.innerText()
        const discountValueOnlyNumber = discountValueText.replace("$","")
        const discountValueNumber = parseInt (discountValueOnlyNumber,10)
        
        await this.totalValue.waitFor()
        const totalValueText = await this.totalValue.innerText()
        const totalValueOnlyNumber = totalValueText.replace("$","")
        const totalValueNumber = parseInt (totalValueOnlyNumber,10)
    
        expect (discountValueNumber).toBeLessThan(totalValueNumber)
    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.creditCardOwnerInpunt.waitFor()
        await this.creditCardOwnerInpunt.fill(paymentDetails.owner)
        await this.creditCardNumberInpunt.waitFor()
        await this.creditCardNumberInpunt.fill(paymentDetails.number)
        await this.creditCardValidUntilInput.waitFor()
        await this.creditCardValidUntilInput.fill(paymentDetails.validUntil)
        await this.creditCardCvcInput.waitFor()
        await this.creditCardCvcInput.fill(paymentDetails.cvc)
        
    }

    completePayment = async() =>{
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, {timeout:3000})

    }


}