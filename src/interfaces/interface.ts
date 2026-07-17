export class Colors {
    areaColor: string;
    bgColor: string;
    borderColor: string;
    color: string;
    titleColor: string;
    lineColor: string;
    pointColor: string;
}

export class QueryOption {
    owner: string;
    repo: string;
    hide_title?: boolean;
    custom_title?: string;
    grid: boolean;
    colors: Colors;
    area: boolean;
    radius: number;
    height: number;
}

export class ParsedQs {
    owner?: string;
    repo?: string;
    hide_title?: boolean;
    custom_title?: string;
    bg_color?: string;
    border_color?: string;
    hide_border?: boolean;
    area_color?: string;
    color?: string;
    line?: string;
    point?: string;
    theme?: string;
    area?: boolean;
    radius?: number;
    title_color?: string;
    height?: number;
    grid?: string;
    from?: string;
    to?: string;
}

export class ReleaseMarker {
    xPercent: number;
    tag_name: string;
}

export class GraphArgs {
    height: number;
    width: number;
    colors: Colors;
    title: string;
    radius: number;
    line: Promise<string>;
    releaseMarkers: ReleaseMarker[];
}

export class PlatformDownloads {
    macos: number;
    linux: number;
    windows: number;
}

export class ReleaseDownload {
    tag_name: string;
    published_at: string;
    platforms: PlatformDownloads;
}

export class QuarterlyDownload {
    quarter: string;
    macos: number;
    linux: number;
    windows: number;
}

export class ReleaseDetails {
    releases: Array<ReleaseDownload>;
}

export class ReleaseAsset {
    name: string;
    download_count: number;
}

export class ReleaseApiResponse {
    name: string | null;
    tag_name: string;
    published_at: string;
    assets: Array<ReleaseAsset>;
}
