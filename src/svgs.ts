import { graphStyle } from './styles/graphStyle';
import { pointAnimation, lineAnimation } from './styles/graphAnimation';
import { GraphArgs, ReleaseMarker } from './interfaces/interface';

const renderReleaseMarkers = (
    markers: ReleaseMarker[],
    width: number,
    height: number,
    color: string
): string => {
    // Chart area bounds matching Chartist's layout
    const chartLeft = 90; // axisY offset (70) + left padding (20)
    const chartRight = width - 50; // right padding
    const chartTop = 80; // top padding
    const chartBottom = height - 100; // axisX offset (80) + bottom padding (20)
    const chartWidth = chartRight - chartLeft;

    const markerSize = 3;

    return markers
        .map((m) => {
            const x = chartLeft + m.xPercent * chartWidth;
            const diamondY = chartTop;
            const labelY = diamondY - markerSize - 6;
            return `
            <line x1="${x}" y1="${chartTop}" x2="${x}" y2="${chartBottom}"
                stroke="#${color}" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="4,3"/>
            <polygon points="${x},${diamondY - markerSize} ${x + markerSize},${diamondY} ${x},${
                diamondY + markerSize
            } ${x - markerSize},${diamondY}"
                fill="#${color}" fill-opacity="0.6"/>
            <text x="${x}" y="${labelY}" fill="#${color}"
                font-size="8" font-family="'Segoe UI', Ubuntu, Sans-Serif"
                text-anchor="start" opacity="0.6"
                transform="rotate(-45, ${x}, ${labelY})">${m.tag_name}</text>`;
        })
        .join('');
};

export const graphSvg = (props: GraphArgs) => `
    <svg
        width="${props.width}"
        height="${props.height}"
        viewBox="0 0 ${props.width} ${props.height}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
            <rect xmlns="http://www.w3.org/2000/svg" data-testid="card_bg" id="cardBg"
            x="0" y="0" rx="${props.radius}" height="100%" stroke="#E4E2E2" fill-opacity="1"
            width="100%" fill="#${props.colors.bgColor}" stroke-opacity="1" style="stroke:#${
                props.colors.borderColor
            }; stroke-width:1;"/>

            <style>
                body {
                    font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
                }
                .header {
                    font: 600 20px 'Segoe UI', Ubuntu, Sans-Serif;
                    text-align: center;
                    color: #${props.colors.titleColor ?? props.colors.color};
                    margin-top: 20px;
                }
                svg {
                    font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
                    user-select: none;
                }
                ${graphStyle(
                    props.colors.color,
                    props.colors.lineColor,
                    props.colors.pointColor,
                    props.colors.areaColor,
                )}
                ${pointAnimation()}
                ${lineAnimation()}
            </style>

            <foreignObject x="0" y="0" width="${props.width}" height="50">
                <h1 xmlns="http://www.w3.org/1999/xhtml" class="header">
                    ${props.title}
                </h1>
            </foreignObject>
            <g class="legend" transform="translate(${(props.width - 240) / 2}, ${
    props.height - 18
})">
                <rect x="0" y="0" width="12" height="12" fill="#5bcdec"/>
                <text x="18" y="11" fill="#${
                    props.colors.color
                }" font-size="12" font-family="'Segoe UI', Ubuntu, Sans-Serif">macOS</text>
                <rect x="80" y="0" width="12" height="12" fill="#f9a825"/>
                <text x="98" y="11" fill="#${
                    props.colors.color
                }" font-size="12" font-family="'Segoe UI', Ubuntu, Sans-Serif">Linux</text>
                <rect x="150" y="0" width="12" height="12" fill="#4caf50"/>
                <text x="168" y="11" fill="#${
                    props.colors.color
                }" font-size="12" font-family="'Segoe UI', Ubuntu, Sans-Serif">Windows</text>
            </g>
            ${props.line}
            ${renderReleaseMarkers(
                props.releaseMarkers || [],
                props.width,
                props.height,
                props.colors.color
            )}
    </svg>
`;

export const invalidUserSvg = (data: string) => `
    <svg
        width="400"
        height="200"
        viewBox="0 0 420 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <style>
                svg {
                    font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif;
                }
        </style>
        <rect xmlns="http://www.w3.org/2000/svg" data-testid="card_bg" id="cardBg" x="0.5"
        y="0.5" rx="4.5" height="100%" stroke="#E4E2E2" fill-opacity="1" width="100%"
        fill="#44475a" stroke-opacity="1"/>
        <text x="20" y="100" fill="#bd93f9">${data}</text>
    </svg>
`;
