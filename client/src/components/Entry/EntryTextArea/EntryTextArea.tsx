// IMPORTS
import './EntryTextArea.scss';

export interface Props {
    id: string;
    name: string;
    label?: string;
    placeholder?: string;
    value?: string;
    zIndex?: number;
    isAutoFocused?: boolean;
    isRequired?: boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const EntryTextArea = (props: Props): JSX.Element => {
    return (
        <div className="EntryTextArea">
            {props.label && (
                <div className="info">
                    <label htmlFor="" className="Label">
                        {props.label}
                    </label>
                </div>
            )}
            <div className="InputWrapper">
                <textarea
                    // onChange={handleChange}
                    name={props.name}
                    id={props.id}
                    aria-label={props.label}
                    className="InputBox"
                    placeholder={props.placeholder}
                    required={props.isRequired}
                    onChange={props.onChange}
                    value={props.value}
                    autoFocus={props.isAutoFocused}
                />
            </div>
        </div>
    );
};
