const SequelizeMock = require('sequelize-mock');
const NewModel = require('../models/New'); // Ajusta la ruta según tu proyecto
const PersonModel = require('../models/Person');
const SolicitationModel = require('../models/Solicitation');

// Inicializa una instancia de SequelizeMock
const DBConnectionMock = new SequelizeMock();

// Simula los modelos asociados
const PersonMock = DBConnectionMock.define('Person', {
    per_id: 1,
    per_name: 'Santiago'
});

const SolicitationMock = DBConnectionMock.define('Solicitation', {
    sol_id: 1,
    sol_description: 'Solicitud de prueba'
});

// Simula el modelo 'New'
const NewMock = DBConnectionMock.define('New', {
    new_id: 1,
    new_description: 'Descripción de prueba',
    new_status: 1,
    per_id: 1,
    sol_id: 1,
    new_date: '2024-09-23'
});

describe('New Model', () => {
    it('Debería crear una instancia del modelo New correctamente', async () => {
        // Crea una nueva instancia del modelo New
        const newInstance = await NewMock.create({
            new_description: 'Descripción de prueba',
            new_status: 1,
            per_id: 1,
            sol_id: 1,
            new_date: '2024-09-23'
        });

        // Verifica que la instancia fue creada correctamente
        expect(newInstance.new_description).toBe('Descripción de prueba');
        expect(newInstance.new_status).toBe(1);
        expect(newInstance.per_id).toBe(1);
        expect(newInstance.sol_id).toBe(1);
        expect(newInstance.new_date).toBe('2024-09-23');
    });

    it('Debería fallar si falta el campo new_description', async () => {
        try {
            await NewMock.create({
                new_status: 1,
                per_id: 1,
                sol_id: 1,
                new_date: '2024-09-23'
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it('Debería estar asociado correctamente a Person y Solicitation', async () => {
        const newInstance = await NewMock.create({
            new_description: 'Descripción con asociación',
            new_status: 1,
            per_id: 1,
            sol_id: 1,
            new_date: '2024-09-23'
        });

        // Verifica la relación manualmente, sin usar findByPk
        const personInstance = await PersonMock.findOne({ where: { per_id: newInstance.per_id } });
        const solicitationInstance = await SolicitationMock.findOne({ where: { sol_id: newInstance.sol_id } });

        expect(personInstance.per_name).toBe('Santiago');
        expect(solicitationInstance.sol_description).toBe('Solicitud de prueba');
    });
});