const request = require('supertest');
const express = require('express');
const { createRol, getAllRoles, getRolById, updateRol, deleteRol } = require('../controllers/RolController');
const Rol = require('../models/Rol');
const Area = require('../models/Area');
const app = express();

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes
app.post('/roles', createRol);
app.get('/roles', getAllRoles);
app.get('/roles/:id', getRolById);
app.put('/roles/:id', updateRol);
app.delete('/roles/:id', deleteRol);

jest.mock('../models/Rol', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
    };
});

jest.mock('../models/Area', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
    };
});

describe('Rol Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('Debería crear un rol correctamente', async () => {
        Rol.create.mockResolvedValue({ rol_id: 1, rol_name: 'ADMINISTRADOR', are_id: 1 });

        const response = await request(app)
            .post('/roles')
            .send({ rol_name: 'ADMINISTRADOR', are_id: 1 });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ rol_id: 1, rol_name: 'ADMINISTRADOR', are_id: 1 });
    });

    it('Debería retornar error si falta el nombre o área al crear un rol', async () => {
        const response = await request(app)
            .post('/roles')
            .send({ are_id: 1 });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('El nombre es requerido.');

        const response2 = await request(app)
            .post('/roles')
            .send({ rol_name: 'ADMINISTRADOR' });

        expect(response2.status).toBe(400);
        expect(response2.body.errors).toContain('El area es requerida.');
    });

    it('Debería obtener todos los roles', async () => {
        Rol.findAll.mockResolvedValue([
            { rol_id: 1, rol_name: 'ADMINISTRADOR', are_id: 1 },
            { rol_id: 2, rol_name: 'SUPERVISOR', are_id: 2 }
        ]);

        const response = await request(app).get('/roles');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { rol_id: 1, rol_name: 'ADMINISTRADOR', are_id: 1 },
            { rol_id: 2, rol_name: 'SUPERVISOR', are_id: 2 }
        ]);
    });

    it('Debería obtener un rol por ID', async () => {
        Rol.findByPk.mockResolvedValue({ rol_id: 1, rol_name: 'ADMINISTRADOR', are_id: 1 });

        const response = await request(app).get('/roles/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ rol_id: 1, rol_name: 'ADMINISTRADOR', are_id: 1 });
    });

    it('Debería retornar 404 si el rol no se encuentra', async () => {
        Rol.findByPk.mockResolvedValue(null);

        const response = await request(app).get('/roles/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Rol no encontrado' });
    });

    it('Debería actualizar un rol', async () => {
        Rol.findByPk.mockResolvedValue({
            rol_id: 1,
            rol_name: 'ADMINISTRADOR',
            are_id: 1,
            update: jest.fn().mockResolvedValue({ rol_id: 1, rol_name: 'SUPER ADMIN', are_id: 1 }),
        });

        const response = await request(app)
            .put('/roles/1')
            .send({ rol_name: 'SUPER ADMIN' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ rol_id: 1, rol_name: 'ADMINISTRADOR', are_id: 1 });
    });

    it('Debería retornar error si la validación falla al actualizar un rol', async () => {
        const response = await request(app)
            .put('/roles/1')
            .send({ rol_name: 'ADM' }); // Nombre muy corto
        expect(response.status).toBe(400);
        // Aquí verificamos que haya un error en el array de errores
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    msg: 'El nombre debe tener entre 4 y 255 caracteres.',
                    path: 'rol_name',
                }),
            ])
        );
    });

    it('Debería eliminar un rol', async () => {
        Rol.findByPk.mockResolvedValue({
            rol_id: 1,
            destroy: jest.fn().mockResolvedValue(true),
        });

        const response = await request(app).delete('/roles/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Rol eliminado' });
    });

    it('Debería retornar 404 al intentar eliminar un rol que no existe', async () => {
        Rol.findByPk.mockResolvedValue(null);

        const response = await request(app).delete('/roles/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Rol no encontrado' });
    });
});
