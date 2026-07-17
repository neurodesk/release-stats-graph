import axios from 'axios';
import * as dotenv from 'dotenv';
import {
    ReleaseDetails,
    ReleaseApiResponse,
    ReleaseDownload,
    ReleaseAsset,
} from 'src/interfaces/interface';

dotenv.config();

function classifyAssets(assets: ReleaseAsset[]) {
    let macos = 0;
    let linux = 0;
    let windows = 0;
    for (const asset of assets) {
        const name = asset.name.toLowerCase();
        if (name.endsWith('.dmg') || name.endsWith('.zip')) {
            macos += asset.download_count;
        } else if (name.endsWith('.deb') || name.endsWith('.rpm')) {
            linux += asset.download_count;
        } else if (name.endsWith('.exe')) {
            windows += asset.download_count;
        }
    }
    return { macos, linux, windows };
}

export class Fetcher {
    constructor(private readonly owner: string, private readonly repo: string) {}

    public async fetchReleases(): Promise<ReleaseDetails | string> {
        try {
            const apiResponse = await axios({
                url: `https://api.github.com/repos/${encodeURIComponent(
                    this.owner
                )}/${encodeURIComponent(this.repo)}/releases`,
                method: 'GET',
                headers: {
                    Authorization: `bearer ${process.env.TOKEN}`,
                    Accept: 'application/vnd.github+json',
                },
            });

            const releases: ReleaseApiResponse[] = apiResponse.data;

            if (!releases || releases.length === 0) {
                return `No releases found for ${this.owner}/${this.repo}`;
            }

            // Classify asset downloads by platform
            const releaseDownloads: ReleaseDownload[] = releases
                .map((release) => {
                    const assets = (release.assets || []).filter(
                        (asset) => asset.name !== 'latest.yml'
                    );
                    return {
                        tag_name: release.tag_name,
                        published_at: release.published_at,
                        platforms: classifyAssets(assets),
                    };
                })
                .reverse(); // chronological order (oldest first)

            if (releaseDownloads.length === 0) {
                return `No release assets found for ${this.owner}/${this.repo}`;
            }

            return {
                releases: releaseDownloads,
            };
        } catch (error) {
            console.log('error: ', error);
            if (error.response && error.response.status === 404) {
                return `No releases found for ${this.owner}/${this.repo}. Please check the owner and repo name.`;
            }
            return `Failed to fetch release data for ${this.owner}/${this.repo}`;
        }
    }
}
