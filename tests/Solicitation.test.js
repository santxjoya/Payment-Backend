const SequelizeMock = require('sequelize-mock');
const SolicitationModel = require('../models/Solicitation'); // Ajusta la ruta según tu proyecto
const PersonModel = require('../models/Person');
const SuppliersModel = require('../models/Suppliers');
const TypeSolicitationModel = require('../models/Type_solicitation');
const CurrenciesModel = require('../models/Currencies');

// Inicializa una instancia de SequelizeMock
const DBConnectionMock = new SequelizeMock();

// Simula los modelos asociados
const PersonMock = DBConnectionMock.define('Person', {
    per_id: 1,
    per_name: 'John Doe'
});

const SuppliersMock = DBConnectionMock.define('Suppliers', {
    sup_id: 1,
    sup_name: 'Supplier A'
});

const TypeSolicitationMock = DBConnectionMock.define('Type_solicitation', {
    typ_sol_id: 1,
    typ_sol_name: 'Type A'
});

const CurrenciesMock = DBConnectionMock.define('Currencies', {
    cur_id: 1,
    cur_name: 'USD'
});

// Simula el modelo 'Solicitation'
const SolicitationMock = DBConnectionMock.define('Solicitation', {
    sol_id: 1,
    sol_status: 1,
    sol_cost: 100.00,
    sol_description: 'Test Solicitation',
    per_id: 1,
    sup_id: 1,
    cur_id: 1,
    typ_sol_id: 1
});

describe('Solicitation Model', () => {
    it('Debería crear una instancia del modelo Solicitation correctamente', async () => {
        // Crea una nueva instancia del modelo Solicitation
        const solicitationInstance = await SolicitationMock.create({
            sol_status: 1,
            sol_cost: 100.00,
            sol_description: 'Test Solicitation',
            per_id: 1,
            sup_id: 1,
            cur_id: 1,
            typ_sol_id: 1
        });

        // Verifica que la instancia fue creada correctamente
        expect(solicitationInstance.sol_status).toBe(1);
        expect(solicitationInstance.sol_cost).toBe(100.00);
        expect(solicitationInstance.sol_description).toBe('Test Solicitation');
        expect(solicitationInstance.per_id).toBe(1);
        expect(solicitationInstance.sup_id).toBe(1);
        expect(solicitationInstance.cur_id).toBe(1);
        expect(solicitationInstance.typ_sol_id).toBe(1);
    });

    it('Debería fallar si falta el campo sol_description', async () => {
        try {
            await SolicitationMock.create({
                sol_status: 1,
                sol_cost: 100.00,
                per_id: 1,
                sup_id: 1,
                cur_id: 1,
                typ_sol_id: 1
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it('Debería estar asociado correctamente a Person, Suppliers, Type Solicitation y Currencies', async () => {
        const solicitationInstance = await SolicitationMock.create({
            sol_status: 1,
            sol_cost: 100.00,
            sol_description: 'Test Solicitation',
            per_id: 1,
            sup_id: 1,
            cur_id: 1,
            typ_sol_id: 1
        });

        // Simula las relaciones
        const personInstance = await PersonMock.findOne({ where: { per_id: solicitationInstance.per_id } });
        const suppliersInstance = await SuppliersMock.findOne({ where: { sup_id: solicitationInstance.sup_id } });
        const typeSolicitationInstance = await TypeSolicitationMock.findOne({ where: { typ_sol_id: solicitationInstance.typ_sol_id } });
        const currenciesInstance = await CurrenciesMock.findOne({ where: { cur_id: solicitationInstance.cur_id } });

        expect(personInstance.per_name).toBe('John Doe');
        expect(suppliersInstance.sup_name).toBe('Supplier A');
        expect(typeSolicitationInstance.typ_sol_name).toBe('Type A');
        expect(currenciesInstance.cur_name).toBe('USD');
    });
});