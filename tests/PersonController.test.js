const request = require('supertest');
const express = require('express');
const { createPerson, getAllPersons, getPersonById, updatePerson, deletePerson } = require('../controllers/PersonController');
const Person = require('../models/Person');
const app = express();

app.use(express.json());

app.post('/persons', createPerson);
app.get('/persons', getAllPersons);
app.get('/persons/:id', getPersonById);
app.put('/persons/:id', updatePerson);
app.delete('/persons/:id', deletePerson);

jest.mock('../models/Person.js');

describe('Person Controller', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Limpia los mocks después de cada prueba
    });

    it('Debería crear una persona correctamente', async () => {
        const mockPerson = { per_id: 1, per_name: 'JOHN', per_lastname: 'DOE', per_mail: 'john@example.com', per_password: 'password', rol_id: 1 };
        Person.create.mockResolvedValue(mockPerson);

        const response = await request(app)
            .post('/persons')
            .send(mockPerson);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockPerson);
    });

    it('Debería retornar error si falta información al crear una persona', async () => {
        const response = await request(app)
            .post('/persons')
            .send({}); // Enviar objeto vacío

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain('El nombre es requerido.'); // Ajustar según tu lógica de validación
    });

    it('Debería obtener todas las personas', async () => {
        const mockPersons = [{ per_id: 1, per_name: 'JOHN', per_lastname: 'DOE' }, { per_id: 2, per_name: 'JANE', per_lastname: 'DOE' }];
        Person.findAll.mockResolvedValue(mockPersons);

        const response = await request(app).get('/persons');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPersons);
    });

    it('Debería obtener una persona por ID', async () => {
        const mockPerson = { per_id: 1, per_name: 'JOHN', per_lastname: 'DOE' };
        Person.findByPk.mockResolvedValue(mockPerson);

        const response = await request(app).get('/persons/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPerson);
    });

    it('Debería retornar 404 si la persona no se encuentra', async () => {
        Person.findByPk.mockResolvedValue(null);

        const response = await request(app).get('/persons/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Persona no encontrada' });
    });

    it('Debería actualizar una persona', async () => {
        const mockPerson = { per_id: 1, per_name: 'JOHN', per_lastname: 'DOE', update: jest.fn().mockResolvedValue({ per_name: 'JANE' }) };
        Person.findByPk.mockResolvedValue(mockPerson);

        const response = await request(app).put('/persons/1').send({ per_name: 'JANE' });

        expect(mockPerson.update).toHaveBeenCalledWith({ per_name: 'JANE' });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ per_id: 1, per_name: 'JOHN' , per_lastname: 'DOE'});
    });

    it('Debería retornar 404 al intentar actualizar una persona que no existe', async () => {
        Person.findByPk.mockResolvedValue(null);

        const response = await request(app).put('/persons/999').send({ per_name: 'JANE' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Persona no encontrada' });
    });

    it('Debería eliminar una persona', async () => {
        const mockPerson = {
            per_id: 1,
            destroy: jest.fn().mockResolvedValue(true), // Simulamos la eliminación exitosa
        };

        Person.findByPk.mockResolvedValue(mockPerson); // Simular que se encuentra la persona

        const response = await request(app).delete('/persons/1');

        expect(response.status).toBe(200);
    });

    it('Debería retornar 404 al intentar eliminar una persona que no existe', async () => {
        Person.findByPk.mockResolvedValue(null);

        const response = await request(app).delete('/persons/999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Persona no encontrada' });
    });
});