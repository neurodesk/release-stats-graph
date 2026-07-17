export const graphStyle = (color: string, _line: string, _point: string, _area: string) =>
    `
    .ct-label {
      fill: #${color};
      color: #${color};
      font-size: .75rem;
      line-height: 1;
    }

    .ct-grid-background,
    .ct-line {
      fill: none;
    }

    .ct-chart-bar .ct-label,
    .ct-chart-line .ct-label {
      display: block;
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
    }

    .ct-label.ct-horizontal.ct-start {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-align: left;
      text-anchor: start;
    }

    .ct-label.ct-horizontal.ct-end {
      -webkit-box-align: flex-start;
      -webkit-align-items: flex-start;
      -ms-flex-align: flex-start;
      align-items: flex-start;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-anchor: end;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      transform-box: fill-box;
      transform-origin: 100% 0;
    }

    .ct-label.ct-vertical.ct-start {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-end;
      -webkit-justify-content: flex-end;
      -ms-flex-pack: flex-end;
      justify-content: flex-end;
      text-align: right;
      text-anchor: end;
    }

    .ct-label.ct-vertical.ct-end {
      -webkit-box-align: flex-end;
      -webkit-align-items: flex-end;
      -ms-flex-align: flex-end;
      align-items: flex-end;
      -webkit-box-pack: flex-start;
      -webkit-justify-content: flex-start;
      -ms-flex-pack: flex-start;
      justify-content: flex-start;
      text-align: left;
      text-anchor: start;
    }

    .ct-grid {
      stroke: #${color};
      stroke-width: 1px;
      stroke-opacity: 0.3;
      stroke-dasharray: 2px;
    }

    .ct-point {
      stroke-width: 10px;
      stroke-linecap: round;
      animation: blink 1s ease-in-out forwards;
    }

    .ct-line {
      stroke-width: 4px;
      stroke-dasharray: 5000;
      stroke-dashoffset: 5000;
      animation: dash 5s ease-in-out forwards;
    }

    .ct-area {
      stroke: none;
      fill-opacity: 0.1;
    }

    /* macOS series */
    .ct-series-a .ct-line { stroke: #5bcdec; }
    .ct-series-a .ct-point { stroke: #5bcdec; }
    .ct-series-a .ct-area { fill: #5bcdec; }

    /* Linux series */
    .ct-series-b .ct-line { stroke: #f9a825; }
    .ct-series-b .ct-point { stroke: #f9a825; }
    .ct-series-b .ct-area { fill: #f9a825; }

    /* Windows series */
    .ct-series-c .ct-line { stroke: #4caf50; }
    .ct-series-c .ct-point { stroke: #4caf50; }
    .ct-series-c .ct-area { fill: #4caf50; }

    .ct-label .ct-horizontal {
      transform: rotate(-90deg)
    }
    `;

/** Unused style for dates feature #85 */
export const diagonalTiltStyle = () => {
    return `
    .ct-label.ct-horizontal.ct-end {
      transform: rotate(-30deg);
      -webkit-transform: rotate(-30deg);
      -moz-transform: rotate(-30deg);
      -o-transform: rotate(-30deg);
      -ms-transform: rotate(-30deg);
      transform-box: fill-box;
      transform-origin: 100% 0;
      text-anchor: end;
    }
  `;
};
