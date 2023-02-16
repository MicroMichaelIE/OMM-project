// IMPORTS
import './EntryText.scss'

export interface Props {
    id: string
    name: string
    label?: string
    type: string
    placeholder?: string
    value?: string | number
    zIndex?: number
    isAutoFocused?: boolean
    isRequired?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    Icon?: {
        name: string // e.g. <Icon />
        url?: string
        state?: string // can be used for toggling color. e.g. 'active' or 'inactive'
        label?: string // can be used for accessibility
    }
}

export const EntryText = ({
    id,
    name,
    label,
    type,
    placeholder,
    value,
    zIndex,
    isAutoFocused,
    isRequired,
    onChange,
    Icon,
}: Props): JSX.Element => {
    // FUNCTIONS

    // const handleChange = (e: ) => {
    //     onChange(e)
    // }

    // RETURN

    return (
        <div className="EntryText">
            {label && (
                <div className="info">
                    <label htmlFor="" className="Label">
                        {label}
                    </label>
                </div>
            )}
            <div className="InputWrapper">
                <input
                    // onChange={handleChange}
                    name={name}
                    id={id}
                    type={type}
                    aria-label={label}
                    className="InputBox"
                    placeholder={placeholder}
                    required={isRequired}
                    onChange={onChange}
                    autoFocus={isAutoFocused}
                />
                {Icon && Icon.name && (
                    <span className="material-symbols-outlined Icon">
                        {Icon.name}
                    </span>
                )}
            </div>
        </div>
    )
}
