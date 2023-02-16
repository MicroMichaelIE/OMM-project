/* eslint-disable */
import { EntryTextArea, Props as EntryTextAreaProps } from './EntryTextArea';

export default {
    title: 'EntryTextArea',
};

export const Default = () => (
    <EntryTextArea id="id" name="Name" label="Label" onChange={(e) => console.log(e.target)} />
);

Default.story = {
    name: 'default',
};
