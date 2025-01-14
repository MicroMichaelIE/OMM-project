import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Button } from './Button';

describe('<Button />', () => {
    test('it should mount', () => {
        render(<Button text="hi" type="button" />);

        const button = screen.getByTestId('Button');

        expect(button).toBeInTheDocument();
    });
});
