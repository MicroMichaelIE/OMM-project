import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ErrorBox } from './ErrorBox';

describe('<ErrorBox />', () => {
    test('it should mount', () => {
        render(<ErrorBox errorMessage={'Error Message'} />);

        const errorBox = screen.getByTestId('ErrorBox');

        expect(errorBox).toBeInTheDocument();
    });
});
