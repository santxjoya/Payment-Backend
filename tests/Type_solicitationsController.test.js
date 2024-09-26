const request = require('supertest');
const express = require('express');
const {
    createTypeSolicitation,
    getAllTypeSolicitations,
    getTypeSolicitationById,
    updateTypeSolicitation,
    deleteTypeSolicitation
} = require('../controllers/TypeSolicitationController');
const Type_Solicitation = require('../models/Type_solicitation');
const app = express();

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes
app.post('/type-solicitations', createTypeSolicitation);
app.get('/type-solicitations', getAllTypeSolicitations);
app.get('/type-solicitations/:id', getTypeSolicitationById);
app.put('/type-solicitations/:id', updateTypeSolicitation);
app.delete('/type-solicitations/:id', deleteTypeSolicitation);

jest.mock('../models/Type_solicitation', () => {
    return {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    };
});

describe('Type Solicitation Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('Debería crear un tipo de solicitud correctamente', async () => {
        Type_Solicitation.create.mockResolvedValue({ typ_sol_id: 1, typ_sol_name: 'TIPO A' });

        const response = await request(app)
            .post('/type-solicitations')
            .send({ typ_sol_name: 'TIPO A' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ typ_sol_id: 1, typ_sol_name: 'TIPO A' });
    });

    it('Debería retornar error si falta el nombre al crear un tipo de solicitud', async () => {
        const response = await request(app)
            .post('/type-solicitations')
            .send({}); // Enviamos un objeto vacío

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('El nombre es requerido.');
    });

    it('Debería obtener todos los tipos de solicitudes', async () => {
        Type_Solicitation.findAll.mockResolvedValue([
            { typ_sol_id: 1, typ_sol_name: 'TIPO A' },
            { typ_sol_id: 2, typ_sol_name: 'TIPO B' }
        ]);

        const response = await request(app).get('/type-solicitations');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { typ_sol_id: 1, typ_sol_name: 'TIPO A' },
            { typ_sol_id: 2, typ_sol_name: 'TIPO B' }
        ]);
    });

    it('Debería obtener un tipo de solicitud por ID', async () => {
        Type_Solicitation.findByPk.mockResolvedValue({ typ_sol_id: 1, typ_sol_name: 'TIPO A' });

        const response = await request(app).get('/type-solicitations/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ typ_sol_id: 1, typ_sol_name: 'TIPO A' });
    });

    it('Debería retornar 404 si el tipo de solicitud no se encuentra', async () => {
        Type_Solicitation.findByPk.mockResolvedValue(null); // Asegúrate de que esto esté bien
    
        const response = await request(app).get('/type-solicitations/999'); // Usamos un ID que no existe
    
        expect(response.status).toBe(404); // Esperamos un 404
        expect(response.body).toEqual({ message: 'Tipo de solicitud no encontrado' }); // Mensaje esperado
    });
    

    it('Debería actualizar un tipo de solicitud', async () => {
        Type_Solicitation.findByPk.mockResolvedValue({
            typ_sol_id: 1,
            typ_sol_name: 'TIPO MODIFICADO',
            update: jest.fn().mockResolvedValue({ typ_sol_id: 1, typ_sol_name: 'TIPO MODIFICADO' }),
        });

        const response = await request(app)
            .put('/type-solicitations/1')
            .send({ typ_sol_name: 'TIPO MODIFICADO' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ typ_sol_id: 1, typ_sol_name: 'TIPO MODIFICADO' });
    });

    it('Debería retornar error si la validación falla al actualizar un tipo de solicitud', async () => {
        const response = await request(app)
            .put('/type-solicitations/1')
            .send({ typ_sol_name: 'A' }); // Nombre muy corto

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.stringContaining('El nombre debe tener entre 4 y 255 caracteres.'),
            ])
        );
    });

    it('Debería eliminar un tipo de solicitud', async () => {
        Type_Solicitation.findByPk.mockResolvedValue({
            typ_sol_id: 1,
            destroy: jest.fn().mockResolvedValue(true),
        });

        const response = await request(app).delete('/type-solicitations/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Tipo de solicitud eliminado' });
    });

    it('Debería retornar 404 al intentar eliminar un tipo de solicitud que no existe', async () => {
        Type_Solicitation.findByPk.mockResolvedValue(null);

        const response = await request(app).delete('/type-solicitations/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Tipo de solicitud no encontrado' });
    });
});