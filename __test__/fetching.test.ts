import { Fetcher } from '../src/fetcher';
import { mockFetchReleasesCorrect, mockFetchReleasesNotFound } from './mockFunctions';
import { ReleaseDetails } from '../src/interfaces/interface';

describe('Fetching Tests', () => {
    const fetcher = new Fetcher('Ashutosh00710', 'github-readme-activity-graph');

    it('Fetching Releases Download Totals Test', async () => {
        const originalFetch = fetcher.fetchReleases;
        fetcher.fetchReleases = mockFetchReleasesCorrect;

        const data = (await fetcher.fetchReleases()) as ReleaseDetails;
        expect(data.releases).toEqual(expect.any(Array));
        expect(data.releases.length).toEqual(3);
        expect(data.releases[0].tag_name).toEqual('v1.0.0');
        expect(data.releases[0].published_at).toEqual('2024-01-15T00:00:00Z');
        expect(data.releases[0].platforms).toEqual({ macos: 2000, linux: 1500, windows: 1500 });

        fetcher.fetchReleases = originalFetch;
    });

    it('Fetching Releases Not Found Test', async () => {
        const originalFetch = fetcher.fetchReleases;
        fetcher.fetchReleases = mockFetchReleasesNotFound;

        const data = await fetcher.fetchReleases();
        expect(typeof data).toEqual('string');
        expect(data).toContain('No releases found');

        fetcher.fetchReleases = originalFetch;
    });
});
