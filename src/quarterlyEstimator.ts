import moment from 'moment';
import { ReleaseDownload, QuarterlyDownload } from './interfaces/interface';

type Platform = 'macos' | 'linux' | 'windows';
const PLATFORMS: Platform[] = ['macos', 'linux', 'windows'];

function quarterStart(m: moment.Moment): moment.Moment {
    return m.clone().startOf('quarter');
}

function quarterEnd(m: moment.Moment): moment.Moment {
    return m.clone().endOf('quarter');
}

function quarterLabel(m: moment.Moment): string {
    return `Q${m.quarter()} ${m.format('YYYY')}`;
}

export function estimateQuarterlyDownloads(
    releases: ReleaseDownload[],
    today: moment.Moment = moment(),
    from?: string,
    to?: string
): QuarterlyDownload[] {
    if (releases.length === 0) return [];

    // Build per-platform release spans with daily averages
    const releaseSpans = releases.map((release, i) => {
        const start = moment(release.published_at);
        const end = i < releases.length - 1 ? moment(releases[i + 1].published_at) : today;
        const activeDays = Math.max(1, end.diff(start, 'days'));
        const dailyAvg: Record<Platform, number> = {
            macos: release.platforms.macos / activeDays,
            linux: release.platforms.linux / activeDays,
            windows: release.platforms.windows / activeDays,
        };
        return { start, end, dailyAvg };
    });

    const fromDate = from ? moment(from) : null;
    const toDate = to ? moment(to) : null;

    const earliest = fromDate && fromDate.isValid()
        ? quarterStart(fromDate)
        : quarterStart(moment(releases[0].published_at));
    const lastQuarter = toDate && toDate.isValid()
        ? quarterStart(toDate)
        : quarterStart(today);

    const result: QuarterlyDownload[] = [];

    const current = earliest.clone();
    while (current.isSameOrBefore(lastQuarter)) {
        const qStart = quarterStart(current);
        const qEnd = quarterEnd(current);

        const totals: Record<Platform, number> = { macos: 0, linux: 0, windows: 0 };

        for (const span of releaseSpans) {
            const overlapStart = moment.max(span.start, qStart);
            const overlapEnd = moment.min(span.end, qEnd);
            const overlapDays = overlapEnd.diff(overlapStart, 'days') + 1;
            if (overlapDays > 0) {
                for (const p of PLATFORMS) {
                    totals[p] += overlapDays * span.dailyAvg[p];
                }
            }
        }

        result.push({
            quarter: quarterLabel(current),
            macos: Math.round(totals.macos),
            linux: Math.round(totals.linux),
            windows: Math.round(totals.windows),
        });

        current.add(1, 'quarter');
    }

    return result;
}
