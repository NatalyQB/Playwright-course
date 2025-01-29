import { expect } from "@playwright/test";

export class Checkout {
    constructor(page) {
        this.page = page;

        // Localizadores para los elementos en la página de checkout
        this.basketCards = page.locator('[data-qa="basket-card"]');  // Tarjetas de los productos en la cesta
        this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');  // Precios de los productos en la cesta
        this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]');  // Botones de eliminar productos
        this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]');  // Botón de continuar al checkout
    }

    // Método para eliminar el producto más barato de la cesta
    removeCheapestProduct = async () => {
        // Espera a que al menos un producto esté visible en la cesta
        await this.basketCards.first().waitFor();
        
        // Obtiene el número total de productos en la cesta antes de la eliminación
        const itemsBeforeRemoval = await this.basketCards.count();
        
        // Espera a que el precio del primer producto esté disponible
        await this.basketItemPrice.first().waitFor();
        
        // Obtiene todos los precios de los productos en la cesta (en formato texto)
        const allPriceTexts = await this.basketItemPrice.allInnerTexts();
        
        // Convierte los precios en texto (por ejemplo, '499$') a números (por ejemplo, 499)
        const justNumbers = allPriceTexts.map((element) => {
            // Elimina el símbolo '$' del precio
            const withoutDollarSign = element.replace("$", "");
            // Convierte el precio a número entero
            return parseInt(withoutDollarSign, 10);
        });
        
        // Encuentra el precio más bajo en la lista de precios
        const smallestPrice = Math.min(...justNumbers);
        
        // Obtiene el índice del producto con el precio más bajo
        const smallestPriceIdx = justNumbers.indexOf(smallestPrice);
        
        // Localiza el botón de eliminación para el producto más barato
        const specificRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIdx);
        
        // Espera a que el botón de eliminar sea visible antes de hacer clic
        await specificRemoveButton.waitFor();
        
        // Hace clic en el botón para eliminar el producto más barato
        await specificRemoveButton.click();
        
        // Verifica que el número de productos en la cesta haya disminuido en uno
        await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1);
    };

    // Método para continuar al proceso de checkout (finalizar compra)
    continueToCheckout = async () => {
        // Espera a que el botón de "continuar al checkout" esté visible
        await this.continueToCheckoutButton.waitFor();
        
        // Hace clic en el botón para continuar al checkout
        await this.continueToCheckoutButton.click();
        
        // Espera a que la URL cambie a la página de login (cuando se redirige al login después de hacer clic en continuar)
        await this.page.waitForURL("http://localhost:2221/login?redirect=/delivery-details", { timeout: 3000 });
    };
}
