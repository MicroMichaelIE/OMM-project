/* eslint-disable */
import { ErrorBox } from './ErrorBox';

export default {
    title: 'ErrorBox',
};

export const Default = () => <ErrorBox errorMessage={'Error Message'} />;

Default.story = {
    name: 'default',
};
