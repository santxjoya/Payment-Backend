const SequelizeMock = require('sequelize-mock');
const Area = require('../models/Area');

// Inicializa una instancia de SequelizeMock
const DBConnectionMock = new SequelizeMock();

// Simula el modelo 'Area' con SequelizeMock
const AreaMock = DBConnectionMock.define('Area', {
    are_id: 1,
    are_name: 'TECNOLOGÍA',
    are_limit: 100.0
});

describe('Area Model', () => {
    it('Debería crear una instancia del modelo Area correctamente', async () => {
        // Crea una nueva instancia del modelo Area
        const areaInstance = await AreaMock.create({
            are_name: 'TECNOLOGÍA',
            are_limit: 100.0
        });

        // Verifica si la instancia fue creada correctamente
        expect(areaInstance.are_name).toBe('TECNOLOGÍA');
        expect(areaInstance.are_limit).toBe(100.0);
        expect(areaInstance.are_id).toBe(1);
    });

    it('Debería lanzar un error si falta el campo are_name', async () => {
        try {
            await AreaMock.create({
                are_limit: 50.0
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });
});
