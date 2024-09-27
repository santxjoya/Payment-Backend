const request = require('supertest');
const express = require('express');
const { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier } = require('../controllers/SuppliersController');
const Suppliers = require('../models/Suppliers');
const app = express();

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes
app.post('/suppliers', createSupplier);
app.get('/suppliers', getSuppliers);
app.get('/suppliers/:id', getSupplierById);
app.put('/suppliers/:id', updateSupplier);
app.delete('/suppliers/:id', deleteSupplier);

jest.mock('../models/Suppliers'); // Mocks para el modelo Suppliers

describe('Suppliers Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('Debería crear un proveedor correctamente', async () => {
        Suppliers.create.mockResolvedValue({ sup_id: 1, sup_name: 'NUEVO PROVEEDOR' });

        const response = await request(app)
            .post('/suppliers')
            .send({ sup_name: 'NUEVO PROVEEDOR' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ sup_id: 1, sup_name: 'NUEVO PROVEEDOR' });
    });

    it('Debería retornar error si falta el nombre al crear un proveedor', async () => {
        const response = await request(app)
            .post('/suppliers')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('El nombre es requerido.');
    });

    it('Debería obtener todos los proveedores', async () => {
        Suppliers.findAll.mockResolvedValue([{ sup_id: 1, sup_name: 'PROVEEDOR 1' }, { sup_id: 2, sup_name: 'PROVEEDOR 2' }]);

        const response = await request(app).get('/suppliers');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ sup_id: 1, sup_name: 'PROVEEDOR 1' }, { sup_id: 2, sup_name: 'PROVEEDOR 2' }]);
    });

    it('Debería obtener un proveedor por ID', async () => {
        Suppliers.findByPk.mockResolvedValue({ sup_id: 1, sup_name: 'PROVEEDOR 1' });

        const response = await request(app).get('/suppliers/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ sup_id: 1, sup_name: 'PROVEEDOR 1' });
    });

    it('Debería retornar 404 si el proveedor no se encuentra', async () => {
        Suppliers.findByPk.mockResolvedValue(null);

        const response = await request(app).get('/suppliers/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Proveedor no encontrado' });
    });

    it('Debería actualizar un proveedor', async () => {
        Suppliers.findByPk.mockResolvedValue({
            sup_id: 1,
            sup_name: 'PROVEEDOR ACTUALIZADO',
            update: jest.fn().mockResolvedValue({ sup_id: 1, sup_name: 'PROVEEDOR ACTUALIZADO' }),
        });

        const response = await request(app)
            .put('/suppliers/1')
            .send({ sup_name: 'PROVEEDOR ACTUALIZADO' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ sup_id: 1, sup_name: 'PROVEEDOR ACTUALIZADO' });
    });

    it('Debería eliminar un proveedor', async () => {
        Suppliers.findByPk.mockResolvedValue({
            sup_id: 1,
            destroy: jest.fn().mockResolvedValue(true),
        });

        const response = await request(app).delete('/suppliers/1');

        expect(response.status).toBe(204);
    });

    it('Debería retornar 404 al intentar eliminar un proveedor que no existe', async () => {
        Suppliers.findByPk.mockResolvedValue(null);

        const response = await request(app).delete('/suppliers/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Proveedor no encontrado' });
    });
});