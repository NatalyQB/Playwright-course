import {test} from "@playwright/test"
import { ProductsPage } from "../page-objects/ProductsPage.js"
import { Navigation } from "./../page-objects/Navigation.js"
import { Checkout} from "./../page-objects/Checkout.js"
import { LoginPage } from "./../page-objects/LoginPage.js"
import {RegisterPage} from "./../page-objects/RegisterPage.js"
import {v4 as uuid4} from 'uuid'  // Importa la función v4 del paquete uuid, renombrada como uuid4, para generar identificadores únicos
import {DeliveryDetails} from './../page-objects/DeliveryDetails.js'
import { deliveryDetails as userAddress } from "./../data/deliveryDetails.js"
import {PaymentPage } from "./../page-objects/PaymentPage.js"
import { paymentDetails } from "../data/paymentDetails.js"

test("New user full end to end test journey", async ({page})=>{
   // ProductsPage.visit()
   const productsPage= new ProductsPage (page)
   await productsPage.visit()
   await productsPage.sortByCheapest()
   await productsPage.addProductToBasket(0)
   await productsPage.addProductToBasket(1)
   await productsPage.addProductToBasket(2)
   const navigation = new Navigation(page)
   await navigation.goToCheckout()
   
   const checkout = new Checkout(page)
   await checkout.removeCheapestProduct()
   await checkout.continueToCheckout()

   const login = new LoginPage(page)
   await login.moveToSignup()

   const registerPage = new RegisterPage(page)
   // ***Genera un correo electrónico aleatorio utilizando UUID y lo concatena con el dominio "yopmail.com"
   const email = uuid4() + "yopmail.com"
   // Genera una contraseña aleatoria utilizando UUID
   const password = uuid4()
   await registerPage.signUpAsNewUser(email,password)
   
   const deliveryDetails = new DeliveryDetails(page)
   await deliveryDetails.fillDetails(userAddress)
   await deliveryDetails.saveDetails()
   await deliveryDetails.continueToPayment()

   const paymentPage = new PaymentPage(page)
   await paymentPage.activateDiscount()
   await paymentPage.fillPaymentDetails(paymentDetails)
   await paymentPage.completePayment()
})