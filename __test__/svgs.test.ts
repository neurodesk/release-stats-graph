import { graphSvg, invalidUserSvg } from '../src/svgs';
import { Card } from '../src/GraphCards';
import { fakeGraphArgs, fakeQueryStringRes } from './fakeInputs';

describe('SVG Testing', () => {
    //- Svg testing ✔
    it('Test SVGs', () => {
        let fakeInvalidSvgArg = 'User not found!';
        expect.assertions(4);
        expect(graphSvg(fakeGraphArgs)).toEqual(expect.any(String));
        expect(graphSvg(fakeGraphArgs)).toMatchSnapshot();
        expect(invalidUserSvg(fakeInvalidSvgArg)).toEqual(expect.any(String));
        expect(invalidUserSvg(fakeInvalidSvgArg)).toMatchSnapshot();
    });

    //- Svg testing Promise<string> (GrapgCards.ts)✔
    it('chart SVGs', async () => {
        expect.assertions(1);
        expect(
            await new Card(
                420,
                1200,
                fakeQueryStringRes[0].radius,
                fakeQueryStringRes[0].colors,
                'owner/repo Downloads',
                fakeQueryStringRes[0].area
            ).buildGraph([
                { quarter: 'Q1 2024', macos: 2000, linux: 1500, windows: 1000 },
                { quarter: 'Q2 2024', macos: 1500, linux: 1000, windows: 700 },
                { quarter: 'Q3 2024', macos: 800, linux: 600, windows: 400 },
                { quarter: 'Q4 2024', macos: 400, linux: 300, windows: 200 },
            ])
        ).toMatchSnapshot();
    });
});
