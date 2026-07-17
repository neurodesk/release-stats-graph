import { createGraph } from './createChart';
import { graphSvg } from './svgs';
import moment from 'moment';
import { Colors, QuarterlyDownload, ReleaseDownload, ReleaseMarker } from './interfaces/interface';

export class Card {
    constructor(
        private readonly height: number,
        private readonly width: number,
        private readonly radius: number,
        private readonly colors: Colors,
        private readonly title = '',
        private readonly area = false,
        private readonly showGrid = true,
    ) {}

    private static formatLogLabel(value: number): string {
        const actual = Math.round(Math.pow(10, value));
        if (actual >= 1000000) return `${(actual / 1000000).toFixed(0)}M`;
        if (actual >= 1000) return `${(actual / 1000).toFixed(0)}K`;
        return `${actual}`;
    }

    // log10 ticks: 10, 100, 1K, 10K, 100K
    private static readonly LOG_TICKS = [2, 3, 4, 5];

    private getOptions() {
        const self = this;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (Chartist: any) => ({
            width: self.width,
            height: self.height,
            axisY: {
                type: Chartist.FixedScaleAxis,
                ticks: Card.LOG_TICKS,
                title: 'Downloads (log)',
                offset: 70,
                labelOffset: {
                    y: 4.5,
                },
                low: 0,
                high: 5,
                showGrid: self.showGrid,
                labelInterpolationFnc: Card.formatLogLabel,
            },
            axisX: {
                title: 'Quarter',
                offset: 80,
                labelOffset: {
                    x: -4.5,
                },
                showGrid: self.showGrid,
            },
            chartPadding: {
                top: 80,
                right: 50,
                bottom: 20,
                left: 20,
            },
            showArea: self.area,
            fullWidth: true,
        });
    }

    /** Unused Code ref #85 */
    // private getContrubutionDates() {
    //     const days = [];
    //     for (const date = new Date(); days.length < 31; date.setDate(date.getUTCDate() - 1)) {
    //         const current = new Date(date);
    //         days.push(
    //             current.toLocaleString('default', { month: 'short' }) +
    //                 ' ' +
    //                 current.getUTCDate().toString()
    //         );
    //     }

    //     return days.reverse();
    // }

    private static toLog(v: number): number {
        return Math.log10(v + 1);
    }

    private static parseQuarterLabel(label: string): moment.Moment {
        const match = label.match(/Q(\d) (\d{4})/);
        if (!match) return moment();
        const q = parseInt(match[1]);
        const y = parseInt(match[2]);
        return moment({ year: y, month: (q - 1) * 3, day: 1 });
    }

    private static computeReleaseMarkers(
        releases: ReleaseDownload[],
        quarterlyData: QuarterlyDownload[]
    ): ReleaseMarker[] {
        if (quarterlyData.length === 0) return [];

        const numQuarters = quarterlyData.length;
        // Each quarter occupies equal width; compute position within each segment
        const quarterStarts = quarterlyData.map((q) => Card.parseQuarterLabel(q.quarter));
        const timelineStart = quarterStarts[0];
        const timelineEnd = quarterStarts[numQuarters - 1].clone().endOf('quarter');

        return releases
            .filter((r) => {
                const d = moment(r.published_at);
                return d.isSameOrAfter(timelineStart) && d.isSameOrBefore(timelineEnd);
            })
            .map((r) => {
                const d = moment(r.published_at);
                // Find which quarter segment this release falls into
                let qIdx = 0;
                for (let i = numQuarters - 1; i >= 0; i--) {
                    if (d.isSameOrAfter(quarterStarts[i])) {
                        qIdx = i;
                        break;
                    }
                }
                const qStart = quarterStarts[qIdx];
                const qEnd = qStart.clone().endOf('quarter');
                const daysInQuarter = qEnd.diff(qStart, 'days');
                const dayOffset = d.diff(qStart, 'days');
                const fractionInQuarter = daysInQuarter > 0 ? dayOffset / daysInQuarter : 0;

                // Chartist fullWidth: first label at 0, last at 1
                // Each quarter segment spans 1/(numQuarters-1) when numQuarters > 1
                let xPercent: number;
                if (numQuarters === 1) {
                    xPercent = fractionInQuarter;
                } else {
                    xPercent = (qIdx + fractionInQuarter) / (numQuarters - 1);
                }

                return { xPercent: Math.min(1, Math.max(0, xPercent)), tag_name: r.tag_name };
            });
    }

    async buildGraph(
        quarterlyData: QuarterlyDownload[],
        releases: ReleaseDownload[] = []
    ): Promise<string> {
        //Options to pass in createGraph function
        const options = this.getOptions();

        //Construction of graph from node-chartist (3 stacked series: macOS, Linux, Windows)
        //Values are log10-transformed so the Y axis uses logarithmic scale
        const line: Promise<string> = await createGraph('line', options, {
            labels: quarterlyData.map((q) => q.quarter),
            series: [
                { value: quarterlyData.map((q) => Card.toLog(q.macos)) },
                { value: quarterlyData.map((q) => Card.toLog(q.linux)) },
                { value: quarterlyData.map((q) => Card.toLog(q.windows)) },
            ],
        });

        const releaseMarkers = Card.computeReleaseMarkers(releases, quarterlyData);

        //Arguments to construct graphs with rect and other options
        const args = {
            height: this.height,
            width: this.width,
            colors: this.colors,
            title: this.title,
            radius: this.radius,
            line,
            releaseMarkers,
        };

        return graphSvg(args);
    }
}
