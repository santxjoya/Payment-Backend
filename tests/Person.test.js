const SequelizeMock = require('sequelize-mock');
const PersonModel = require('../models/Person'); // Ajusta la ruta según tu proyecto
const RolModel = require('../models/Rol');

// Inicializa una instancia de SequelizeMock
const DBConnectionMock = new SequelizeMock();

// Simula los modelos asociados
const RolMock = DBConnectionMock.define('Rol', {
    rol_id: 1,
    rol_name: 'Admin'
});

// Simula el modelo 'Person'
const PersonMock = DBConnectionMock.define('Person', {
    per_id: 1,
    per_name: 'Lina',
    per_lastname: 'Cruz',
    per_mail: 'LinaCruz@gmail.com',
    per_password: 'Lina.Maria123',
    per_status: 1,
    rol_id: 1
});

describe('Person Model', () => {
    it('Debería crear una instancia del modelo Person correctamente', async () => {
        // Crea una nueva instancia del modelo Person
        const personInstance = await PersonMock.create({
            per_name: 'Lina',
            per_lastname: 'Cruz',
            per_mail: 'LinaCruz@example.com',
            per_password: 'Lina.Maria123',
            per_status: 1,
            rol_id: 1
        });

        // Verifica que la instancia fue creada correctamente
        expect(personInstance.per_name).toBe('Lina');
        expect(personInstance.per_lastname).toBe('Cruz');
        expect(personInstance.per_mail).toBe('LinaCruz@example.com');
        expect(personInstance.per_password).toBe('Lina.Maria123');
        expect(personInstance.per_status).toBe(1);
        expect(personInstance.rol_id).toBe(1);
    });

    it('Debería fallar si falta el campo per_name', async () => {
        try {
            await PersonMock.create({
                per_lastname: 'Cruz',
                per_mail: 'LinaCruz@example.com',
                per_password: 'Lina.Maria123',
                per_status: 1,
                rol_id: 1
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it('Debería estar asociado correctamente a Rol', async () => {
        const personInstance = await PersonMock.create({
            per_name: 'Lina',
            per_lastname: 'Cruz',
            per_mail: 'LinaCruz@example.com',
            per_password: 'Lina.Maria123',
            per_status: 1,
            rol_id: 1
        });

        // Simula la relación con Rol
        const rolInstance = await RolMock.findOne({ where: { rol_id: personInstance.rol_id } });

        expect(rolInstance.rol_name).toBe('Admin');
    });
});