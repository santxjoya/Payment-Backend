const request = require('supertest');
const express = require('express');
const { getAllNews, getNewById } = require('../controllers/NewController');
const New = require('../models/New');
const Person = require('../models/Person');
const Solicitation = require('../models/Solicitation');

const app = express();

app.use(express.json());

app.get('/news', getAllNews);
app.get('/news/:id', getNewById);

jest.mock('../models/New', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
    };
});
jest.mock('../models/Person', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
    };
});

jest.mock('../models/Solicitation', () => {
    return {
        init: jest.fn(),
        belongsTo: jest.fn(),
    };
});

describe('News Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /news', () => {
        it('should return all news with related persons and solicitations', async () => {
            const mockNews = [
                {
                    id: 1,
                    title: 'News 1',
                    Person: { per_id: 1, per_name: 'John Doe' },
                    Solicitation: [
                        {
                            sol_id: 1,
                            sol_status: 'Pending',
                            sol_cost: 100,
                            sol_description: 'Description 1',
                            Person: { per_id: 2, per_name: 'Jane Doe' }
                        }
                    ]
                }
            ];

            New.findAll.mockResolvedValue(mockNews);

            const response = await request(app).get('/news');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockNews);
            expect(New.findAll).toHaveBeenCalled();
        });

        it('should return a 500 error if an exception is thrown', async () => {
            New.findAll.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/news');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });

    describe('GET /news/:id', () => {
        it('should return news by ID', async () => {
            const mockNews = { id: 1, title: 'News 1' };

            New.findByPk.mockResolvedValue(mockNews);

            const response = await request(app).get('/news/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockNews);
            expect(New.findByPk).toHaveBeenCalledWith('1');
        });

        it('should return a 404 error if news not found', async () => {
            New.findByPk.mockResolvedValue(null);

            const response = await request(app).get('/news/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Notificación no encontrada' });
        });

        it('should return a 500 error if an exception is thrown', async () => {
            New.findByPk.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/news/1');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Database error' });
        });
    });
});