//importa las funciones desde la biblioteca @playwright/test. 
import { test, expect } from "@playwright/test"	                                
import exp from "constants"
import { basename } from "path"

//define una nueva prueba utilizando la función test. 
test.skip('Product Page Add To Basket', async ({ page }) => {
     await page.goto('http://localhost:2221')                                           //el código navega a la URL proporcionada 

    const addToBasketButton = page.locator('[data-qa="product-button"]').first()
    const basketCounter = page.locator('[data-qa="header-basket-count"]')
    
    await addToBasketButton.waitFor()    
    await expect(addToBasketButton).toHaveText("Add to Basket")        
    await expect(basketCounter).toHaveText("0")
    
    await addToBasketButton.click()                         

    // haría un registro en la consola del número de botones con el texto 'Add to Basket' en la página. getByRole('button', { name: 'Add to Basket' }) busca botones con el texto exacto 'Add to Basket', y .count() devuelve cuántos botones coinciden con ese criterio. En este caso, está comentado, probablemente para depuración o pruebas anteriores.
    //console.log(await page.getByRole('button',{ name:'Add to Basket'}).count())
    
    await expect(addToBasketButton).toHaveText("Remove from Basket")        
    await expect(basketCounter).toHaveText("1")

    const checkoutLink = page.getByRole('link',{name:'Checkout'})
    await checkoutLink.waitFor()
    await checkoutLink.click()
    await page.waitForURL("/basket")
    
    
    
    //await page.pause()
})

