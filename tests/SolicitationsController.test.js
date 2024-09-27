const request = require('supertest');
const express = require('express');
const {
    createSolicitation,
    getAllSolicitations,
    getSolicitationById,
    updateSolicitation,
    deleteSolicitation
} = require('../controllers/SolicitationController');
const Solicitation = require('../models/Solicitation');
const Person = require('../models/Person');
const Suppliers = require('../models/Suppliers');
const Type_Solicitation = require('../models/Type_solicitation');
const Currencies = require('../models/Currencies');

const app = express();
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes

app.post('/solicitations', createSolicitation);
app.get('/solicitations', getAllSolicitations);
app.get('/solicitations/:id', getSolicitationById);
app.put('/solicitations/:id', updateSolicitation);
app.delete('/solicitations/:id', deleteSolicitation);

jest.mock('../models/Solicitation', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
    };
});

jest.mock('../models/Person', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
    };
});

jest.mock('../models/Suppliers', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
    };
});

jest.mock('../models/Type_solicitation', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
    };
});

jest.mock('../models/Currencies', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
    };
});

describe('Solicitation Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('Debería crear una solicitud correctamente', async () => {
        Solicitation.create.mockResolvedValue({ sol_id: 1, sol_cost: 100, sol_description: 'SOLICITUD DE PRUEBA' });

        const response = await request(app)
            .post('/solicitations')
            .send({ sol_cost: 100, sol_description: 'SOLICITUD DE PRUEBA', per_id: 1, sup_id: 1, cur_id: 1, typ_sol_id: 1 });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ sol_id: 1, sol_cost: 100, sol_description: 'SOLICITUD DE PRUEBA' });
    });

    it('Debería retornar error si falta el costo o descripción al crear una solicitud', async () => {
        const response = await request(app)
            .post('/solicitations')
            .send({ sol_description: 'SOLICITUD DE PRUEBA' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('El costo no puede estar vacío.');

        const response2 = await request(app)
            .post('/solicitations')
            .send({ sol_cost: 100 });

        expect(response2.status).toBe(400);
        expect(response2.body.errors).toContain('La descripción es requerida.');
    });

    it('Debería obtener todas las solicitudes', async () => {
        Solicitation.findAll.mockResolvedValue([
            { sol_id: 1, sol_cost: 100, sol_description: 'SOLICITUD DE PRUEBA' },
            { sol_id: 2, sol_cost: 200, sol_description: 'OTRA SOLICITUD' }
        ]);

        const response = await request(app).get('/solicitations');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            { sol_id: 1, sol_cost: 100, sol_description: 'SOLICITUD DE PRUEBA' },
            { sol_id: 2, sol_cost: 200, sol_description: 'OTRA SOLICITUD' }
        ]);
    });

    it('Debería obtener una solicitud por ID', async () => {
        Solicitation.findByPk.mockResolvedValue({ sol_id: 1, sol_cost: 100, sol_description: 'SOLICITUD DE PRUEBA' });

        const response = await request(app).get('/solicitations/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ sol_id: 1, sol_cost: 100, sol_description: 'SOLICITUD DE PRUEBA' });
    });

    it('Debería retornar 404 si la solicitud no se encuentra', async () => {
        Solicitation.findByPk.mockResolvedValue(null);

        const response = await request(app).get('/solicitations/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Solicitud no encontrada' });
    });

    it('Debería actualizar una solicitud', async () => {
        Solicitation.findByPk.mockResolvedValue({
            sol_id: 1,
            sol_cost: 100,
            sol_description: 'SOLICITUD ACTUALIZADA',
            update: jest.fn().mockResolvedValue({ sol_id: 1, sol_cost: 150, sol_description: 'SOLICITUD ACTUALIZADA' }),
        });

        const response = await request(app)
            .put('/solicitations/1')
            .send({ sol_cost: 150 });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ sol_id: 1, sol_cost: 100, sol_description: 'SOLICITUD ACTUALIZADA' });
    });

    it('Debería eliminar una solicitud', async () => {
        Solicitation.findByPk.mockResolvedValue({
            sol_id: 1,
            destroy: jest.fn().mockResolvedValue(true),
        });

        const response = await request(app).delete('/solicitations/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Solicitud eliminada' });
    });

    it('Debería retornar 404 al intentar eliminar una solicitud que no existe', async () => {
        Solicitation.findByPk.mockResolvedValue(null);

        const response = await request(app).delete('/solicitations/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Solicitud no encontrada' });
    });
});
