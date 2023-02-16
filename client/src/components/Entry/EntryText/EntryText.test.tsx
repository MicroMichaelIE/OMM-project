import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { EntryText } from './EntryText';

describe('<EntryText />', () => {
    test('it should mount', () => {
        render(<EntryText id="1" name="signin-username" label="Username" type="text" Icon={{ name: 'mail' }} />);

        const button = screen.getByTestId('EntryText');

        expect(button).toBeInTheDocument();
    });
});
