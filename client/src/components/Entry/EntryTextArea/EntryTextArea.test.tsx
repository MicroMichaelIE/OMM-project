import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { EntryTextArea } from './EntryTextArea';

describe('<EntryTextArea />', () => {
    test('it should mount', () => {
        render(
            <EntryTextArea
                id="1"
                name="signin-username"
                label="Username"
                onChange={(e) => console.log(e.target.value)}
            />
        );

        const button = screen.getByTestId('EntryTextArea');

        expect(button).toBeInTheDocument();
    });
});
