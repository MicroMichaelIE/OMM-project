import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Divider from './Divider';

describe('<Divider />', () => {
    test('it should mount', () => {
        render(<Divider children="Text" />);

        const divider = screen.getByTestId('Divider');

        expect(divider).toBeInTheDocument();
    });
});
