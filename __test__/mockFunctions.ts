import { ReleaseDetails } from '../src/interfaces/interface';

//For valid releases (total downloads per version)
export const mockFetchReleasesCorrect = jest.fn().mockReturnValue(
    Promise.resolve({
        releases: [
            {
                tag_name: 'v1.0.0',
                published_at: '2024-01-15T00:00:00Z',
                platforms: { macos: 2000, linux: 1500, windows: 1500 },
            },
            {
                tag_name: 'v1.1.0',
                published_at: '2024-03-15T00:00:00Z',
                platforms: { macos: 1200, linux: 1000, windows: 1000 },
            },
            {
                tag_name: 'v2.0.0',
                published_at: '2024-06-01T00:00:00Z',
                platforms: { macos: 800, linux: 500, windows: 500 },
            },
        ],
    } as ReleaseDetails)
);

//For repo with no releases
export const mockFetchReleasesNotFound = jest
    .fn()
    .mockReturnValue(
        Promise.resolve(
            'No releases found for testowner/testrepo. Please check the owner and repo name.'
        )
    );
