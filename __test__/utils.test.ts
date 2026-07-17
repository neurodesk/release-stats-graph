import express from 'express';
import request from 'supertest';
import { Utilities } from '../src/utils';
import { fakeQueryString, fakeQueryStringRes, options } from './fakeInputs';
import { Handlers } from '../src/handlers';
import { createGraph } from '../src/createChart';

describe('Utilities Test', () => {
    const handlers = new Handlers();
    it('Query Options', () => {
        expect(
            fakeQueryString.map((arg) => {
                const utils = new Utilities(arg);
                return utils.queryOptions();
            }),
        ).toEqual(fakeQueryStringRes);
    });

    // Testing express routes
    const fakeServer = () => {
        const app = express();
        app.use(express.urlencoded({ extended: false }));
        return app;
    };

    describe('GET /graph with correct credential', () => {
        test('responding', (done) => {
            const app = fakeServer();
            app.get('/graph', handlers.getGraph);
            request(app)
                .get('/graph?owner=cli&repo=cli')
                .expect('Content-Type', 'image/svg+xml; charset=utf-8')
                .expect(200, done);
        });
    });

    describe('GET /graph with incorrect credential', () => {
        test('responding', (done) => {
            const app = fakeServer();
            app.get('/graph', handlers.getGraph);
            request(app)
                .get('/graph?owner=&repo=')
                .expect('Content-Type', 'image/svg+xml; charset=utf-8')
                .expect('Cache-Control', 'no-store, max-age=0')
                .expect(200, done);
        });
    });

    //- Chart Function ([Promise] Inside Graph Cards Class) ✔
    it('Graph Generation', async () => {
        expect.assertions(1);

        const quarterlyData = [
            { quarter: 'Q1 2024', macos: 2000, linux: 1500, windows: 1000 },
            { quarter: 'Q2 2024', macos: 1500, linux: 1000, windows: 700 },
            { quarter: 'Q3 2024', macos: 800, linux: 600, windows: 400 },
            { quarter: 'Q4 2024', macos: 400, linux: 300, windows: 200 },
        ];
        const graph: Promise<string> = await createGraph('line', options, {
            labels: quarterlyData.map((q) => q.quarter),
            series: [
                { value: quarterlyData.map((q) => q.macos) },
                { value: quarterlyData.map((q) => q.linux) },
                { value: quarterlyData.map((q) => q.windows) },
            ],
        });
        expect(graph).toMatchSnapshot();
    });
});
