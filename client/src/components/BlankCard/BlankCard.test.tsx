import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BlankCard } from './BlankCard';

describe('<BlankCard />', () => {
    test('it should mount', () => {
        render(
            <BlankCard>
                <div>Test</div>
            </BlankCard>
        );

        const blankCard = screen.getByTestId('BlankCard');

        expect(blankCard).toBeInTheDocument();
    });
});
