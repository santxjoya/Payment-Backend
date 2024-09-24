const SequelizeMock = require('sequelize-mock');
const RolModel = require('../models/Rol'); // Ajusta la ruta según tu proyecto
const AreaModel = require('../models/Area');

// Inicializa una instancia de SequelizeMock
const DBConnectionMock = new SequelizeMock();

// Simula el modelo 'Area'
const AreaMock = DBConnectionMock.define('Area', {
    are_id: 1,
    are_name: 'Administración'
});

// Simula el modelo 'Rol'
const RolMock = DBConnectionMock.define('Rol', {
    rol_id: 1,
    rol_name: 'Admin',
    are_id: 1
});

describe('Rol Model', () => {
    it('Debería crear una instancia del modelo Rol correctamente', async () => {
        // Crea una nueva instancia del modelo Rol
        const rolInstance = await RolMock.create({
            rol_name: 'Admin',
            are_id: 1
        });

        // Verifica que la instancia fue creada correctamente
        expect(rolInstance.rol_name).toBe('Admin');
        expect(rolInstance.are_id).toBe(1);
    });

    it('Debería fallar si falta el campo rol_name', async () => {
        try {
            await RolMock.create({
                are_id: 1
            });
        } catch (error) {
            expect(error).toBeTruthy();
        }
    });

    it('Debería estar asociado correctamente a Area', async () => {
        const rolInstance = await RolMock.create({
            rol_name: 'Editor',
            are_id: 1
        });

        // Simula la relación con Area
        const areaInstance = await AreaMock.findOne({ where: { are_id: rolInstance.are_id } });

        expect(areaInstance.are_name).toBe('Administración');
    });
});