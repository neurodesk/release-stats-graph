import moment from 'moment';
import { estimateQuarterlyDownloads } from '../src/quarterlyEstimator';
import { ReleaseDownload } from '../src/interfaces/interface';

describe('Quarterly Estimator', () => {
    const today = moment('2024-10-15');

    it('two releases spanning multiple quarters with per-platform counts', () => {
        const releases: ReleaseDownload[] = [
            { tag_name: 'v1.0.0', published_at: '2024-01-15T00:00:00Z', platforms: { macos: 4000, linux: 3000, windows: 2000 } },
            { tag_name: 'v2.0.0', published_at: '2024-07-01T00:00:00Z', platforms: { macos: 1500, linux: 1000, windows: 500 } },
        ];

        const result = estimateQuarterlyDownloads(releases, today);

        expect(result.length).toBe(4);
        expect(result[0].quarter).toBe('Q1 2024');
        expect(result[3].quarter).toBe('Q4 2024');

        result.forEach((q) => {
            expect(q.macos).toBeGreaterThanOrEqual(0);
            expect(q.linux).toBeGreaterThanOrEqual(0);
            expect(q.windows).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(q.macos)).toBe(true);
            expect(Number.isInteger(q.linux)).toBe(true);
            expect(Number.isInteger(q.windows)).toBe(true);
        });

        const totalMacos = result.reduce((sum, q) => sum + q.macos, 0);
        expect(totalMacos).toBeGreaterThan(0);
    });

    it('single release, lifespan to today', () => {
        const releases: ReleaseDownload[] = [
            { tag_name: 'v1.0.0', published_at: '2024-01-01T00:00:00Z', platforms: { macos: 3000, linux: 3000, windows: 3000 } },
        ];

        const result = estimateQuarterlyDownloads(releases, today);

        expect(result.length).toBe(4);
        expect(result[0].quarter).toBe('Q1 2024');

        const totalMacos = result.reduce((sum, q) => sum + q.macos, 0);
        expect(Math.abs(totalMacos - 3000)).toBeLessThan(200);
    });

    it('same-day releases (no division by zero)', () => {
        const releases: ReleaseDownload[] = [
            { tag_name: 'v1.0.0', published_at: '2024-03-15T00:00:00Z', platforms: { macos: 50, linux: 30, windows: 20 } },
            { tag_name: 'v1.0.1', published_at: '2024-03-15T00:00:00Z', platforms: { macos: 100, linux: 60, windows: 40 } },
        ];

        const result = estimateQuarterlyDownloads(releases, today);

        result.forEach((q) => {
            expect(Number.isFinite(q.macos)).toBe(true);
            expect(Number.isFinite(q.linux)).toBe(true);
            expect(Number.isFinite(q.windows)).toBe(true);
        });
    });

    it('zero downloads', () => {
        const releases: ReleaseDownload[] = [
            { tag_name: 'v1.0.0', published_at: '2024-03-01T00:00:00Z', platforms: { macos: 0, linux: 0, windows: 0 } },
        ];

        const result = estimateQuarterlyDownloads(releases, today);

        result.forEach((q) => {
            expect(q.macos).toBe(0);
            expect(q.linux).toBe(0);
            expect(q.windows).toBe(0);
        });
    });

    it('empty releases array', () => {
        const result = estimateQuarterlyDownloads([], today);
        expect(result).toEqual([]);
    });
});
