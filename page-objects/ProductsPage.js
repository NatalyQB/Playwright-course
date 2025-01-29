import { expect } from "@playwright/test";
import { Navigation } from "./Navigation.js";

// Función para verificar si estamos en un viewport de escritorio
const isDesktopViewport = (page) => {
    const size = page.viewportSize();
    return size && size.width >= 600; // Devolver verdadero si el ancho es mayor o igual a 600px
}

export class ProductsPage {
    constructor(page) {
        this.page = page;
        this.addButtons = page.locator('[data-qa="product-button"]');
        this.sortDropdown = page.locator('[data-qa="sort-dropdown"]');
        this.productTitle = page.locator('[data-qa="product-title"]');
    }

    // Método para visitar la página de productos
    visit = async () => {
        await this.page.goto('http://localhost:2221');
    }

    // Método para agregar un producto a la cesta en función del índice
    addProductToBasket = async (index) => {
        const specificAddButton = this.addButtons.nth(index);
        // Esperar a que el botón de agregar al carrito sea visible y disponible
        await specificAddButton.waitFor({ state: 'visible' });

        // Verificar que el texto del botón sea "Add to Basket" antes de hacer clic
        await expect(specificAddButton).toHaveText("Add to Basket");
        const navigation = new Navigation(this.page);

        // Obtener el número de la cesta antes de agregar el producto (solo para escritorio)
        let basketCountBeforeAdding = 0;
        if (isDesktopViewport(this.page)) {
            basketCountBeforeAdding = await navigation.getBasketCount();
        }

        // Hacer clic en el botón para agregar el producto al carrito
        await specificAddButton.click();

        // Verificar que el texto cambie a "Remove from Basket" después del clic
        await expect(specificAddButton).toHaveText("Remove from Basket");

        // Obtener el número de la cesta después de agregar el producto (solo para escritorio)
        if (isDesktopViewport(this.page)) {
            const basketCountAfterAdding = await navigation.getBasketCount();

            // Verificar que el contador de la cesta haya aumentado
            expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding);
        }
    }

    // Método para ordenar los productos por precio ascendente
    sortByCheapest = async () => {
        await this.sortDropdown.waitFor({ state: 'visible' });

        // Obtener el orden de los productos antes de la ordenación
        const producTitlesBeforeSorting = await this.productTitle.allInnerTexts();

        // Seleccionar la opción para ordenar por precio ascendente
        await this.sortDropdown.selectOption({ label: "Price: Low to High" });

        // Esperar a que los productos se hayan actualizado
        const producTitlesAfterSorting = await this.productTitle.allInnerTexts();

        // Verificar que los productos hayan cambiado de orden
        expect(producTitlesAfterSorting).not.toEqual(producTitlesBeforeSorting);
    }
}
