import { isDesktopViewport } from "./../utils/isDesktopViewport.js"

export class Navigation {
    constructor(page) {
        this.page = page;
        // Se asigna correctamente el localizador del contador de la cesta
        this.basketCounter = page.locator('[data-qa="header-basket-count"]')
        // Usamos un localizador para el enlace de "Checkout"
        this.checkoutLink = page.getByRole('link', { name: 'Checkout' })
        this.mobileBurgerButton = page.locator('[data-qa="burger-button"]')    
    }

    // Método para obtener el contador de la cesta
    getBasketCount = async () => {
        await this.basketCounter.waitFor()        // Espera a que el contador esté visible
        const text = await this.basketCounter.innerText() // Obtiene el texto del contador
        return parseInt(text, 10) // Devuelve el número
    }

    // Método para ir a la página de Checkout
    goToCheckout = async () => {
        if (!isDesktopViewport(this.page)) {
            await this.mobileBurgerButton.waitFor()
            await this.mobileBurgerButton.click()
        }
        await this.checkoutLink.waitFor() // Espera a que el enlace de checkout esté visible
        //console.log('Haciendo clic en el enlace de Checkout');
        await this.checkoutLink.click() // Hace clic en el enlace de checkout
        //console.log('Esperando la URL "/basket"');
        await this.page.waitForURL("http://localhost:2221/basket", { timeout: 30000 }); // Espera a que la URL cambie a "/basket"
        //console.log('URL cambiada a "/basket"');

    }
}
