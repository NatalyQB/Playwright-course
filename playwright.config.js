
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
*/
const config = {
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  globalSetup: require.resolve("./globalSetup.js"),
  /* Ejecuta pruebas en paralelo */
  fullyParallel: true,
  /* Evita que se ejecute test.only accidentalmente en CI */
  //forbidOnly: !!process.env.CI,
  forbidOnly:false,
  /* Reintentar pruebas solo en CI */
  retries: process.env.CI ? 2 : 0,
  /* Desactivar pruebas en paralelo en CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reportero a utilizar. Ver https://playwright.dev/docs/test-reporters */
  reporter: 'line',
  /* Configuración compartida para todos los proyectos */
  use: {
    /* Tiempo de espera global para cada prueba */
    actionTimeout: 0,  //  segundos de tiempo de espera global
    baseURL: 'http://localhost:2221',
    trace: 'on-first-retry',  // Recolecta trace cuando una prueba falla y se reintenta
  },
  /* Configuración de proyectos para los navegadores principales */
  projects: [
   {
      name: 'chromium',
     use: { ...devices['Desktop Chrome'] },  // Utiliza la configuración de Chrome en escritorio
   },

    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'],}
    },]
  }




