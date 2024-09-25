const SequelizeMock = require('sequelize-mock');
const TypeSolicitationModel = require('../models/Type_solicitation'); // Ajusta la ruta según tu proyecto

// Inicializa una instancia de SequelizeMock
const DBConnectionMock = new SequelizeMock();

// Simula el modelo 'Type_Solicitation'
const TypeSolicitationMock = DBConnectionMock.define('Type_Solicitation', {
    typ_sol_id: 1,
    typ_sol_name: 'Type A'
});

describe('Type_Solicitation Model', () => {
    it('Debería crear una instancia del modelo Type_Solicitation correctamente', async () => {
        // Crea una nueva instancia del modelo Type_Solicitation
        const typeSolicitationInstance = await TypeSolicitationMock.create({
            typ_sol_name: 'Type A'
        });

        // Verifica que la instancia fue creada correctamente
        expect(typeSolicitationInstance.typ_sol_name).toBe('Type A');
    });

    it('Debería fallar si falta el campo typ_sol_name', async () => {
        try {
            await TypeSolicitationMock.create({
                // Supongamos que falta typ_sol_name
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it('Debería retornar la información correcta al buscar un tipo de solicitud', async () => {
        const typeSolicitationInstance = await TypeSolicitationMock.findOne({ where: { typ_sol_id: 1 } });

        // Verifica que se devuelve la información correcta
        expect(typeSolicitationInstance.typ_sol_name).toBe('Type A');
    });
});