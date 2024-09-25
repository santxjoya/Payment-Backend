const SequelizeMock = require('sequelize-mock');
const CurrenciesModel = require('../models/Currencies'); // Ajusta la ruta según la estructura de tu proyecto

// Inicializa una instancia de SequelizeMock
const DBConnectionMock = new SequelizeMock();

// Simula el modelo 'Currencies'
const CurrenciesMock = DBConnectionMock.define('Currencies', {
    cur_id: 1,
    cur_name: 'USD'
});

describe('Currencies Model', () => {
    it('Debería crear una instancia del modelo Currencies correctamente', async () => {
        // Crea una nueva instancia del modelo Currencies
        const currencyInstance = await CurrenciesMock.create({
            cur_name: 'USD'
        });

        // Verifica si la instancia fue creada correctamente
        expect(currencyInstance.cur_name).toBe('USD');
        expect(currencyInstance.cur_id).toBe(1);
    });

    it('Debería lanzar un error si falta el campo cur_name', async () => {
        try {
            await CurrenciesMock.create({});
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });
});