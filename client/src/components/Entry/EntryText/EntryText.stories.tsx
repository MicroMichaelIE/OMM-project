/* eslint-disable */
import { EntryText, Props as EntryTextProps } from './EntryText';

export default {
    title: 'EntryText',
};

export const Default = () => <EntryText id="id" name="Name" label="Label" type="text" Icon={{ name: 'mail' }} />;

Default.story = {
    name: 'default',
};
