import { v4 as uuid4 } from 'uuid';  // Asegúrate de importar uuid

export class RegisterPage {
    constructor(page) {
        this.page = page;

        // Selectores de los campos de la página de registro
        this.emailInput = page.getByPlaceholder('E-Mail');
        this.passwordInput = page.getByPlaceholder('password');
        this.registerButton = page.getByRole('button', { name: 'Register' });
    }

    // Método para registrar un nuevo usuario con un correo electrónico y contraseña aleatorios
    signUpAsNewUser = async () => {
        // Genera un email único utilizando uuid
        const emailId = uuid4();  // Genera un UUID único
        const email = `${emailId}@yopmail.com`;  // Crea una dirección de correo electrónico única

        // Genera una contraseña utilizando uuid
        const password = uuid4();  // Genera una contraseña única

        // Espera a que el campo de correo electrónico esté visible y listo para interactuar
        await this.emailInput.waitFor();
        // Rellena el campo de correo electrónico con el correo generado
        await this.emailInput.fill(email);

        // Espera a que el campo de contraseña esté visible y listo para interactuar
        await this.passwordInput.waitFor();
        // Rellena el campo de contraseña con la contraseña generada
        await this.passwordInput.fill(password);

        // Espera a que el botón de registro esté visible y listo para hacer clic
        await this.registerButton.waitFor();
        // Hace clic en el botón de registro
        await this.registerButton.click();

        // Pausa la ejecución para poder revisar el estado de la página después del registro
        //await this.page.pause();
    }
}
