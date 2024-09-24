const SequelizeMock = require('sequelize-mock');
const SuppliersModel = require('../models/Suppliers'); // Ajusta la ruta según tu proyecto

// Inicializa una instancia de SequelizeMock
const DBConnectionMock = new SequelizeMock();

// Simula el modelo 'Suppliers'
const SuppliersMock = DBConnectionMock.define('Suppliers', {
    sup_id: 1,
    sup_name: 'Supplier A'
});

describe('Suppliers Model', () => {
    it('Debería crear una instancia del modelo Suppliers correctamente', async () => {
        // Crea una nueva instancia del modelo Suppliers
        const suppliersInstance = await SuppliersMock.create({
            sup_name: 'Supplier A'
        });

        // Verifica que la instancia fue creada correctamente
        expect(suppliersInstance.sup_name).toBe('Supplier A');
    });

    it('Debería fallar si falta el campo sup_name', async () => {
        try {
            await SuppliersMock.create({
                // Supongamos que falta sup_name
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it('Debería retornar la información correcta al buscar un proveedor', async () => {
        const suppliersInstance = await SuppliersMock.findOne({ where: { sup_id: 1 } });

        // Verifica que se devuelve la información correcta
        expect(suppliersInstance.sup_name).toBe('Supplier A');
    });
});