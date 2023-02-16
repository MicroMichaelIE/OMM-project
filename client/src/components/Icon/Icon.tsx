import './Icon.scss';

interface IconProps {
    name: string;
}

export function Icon(props: IconProps) {
    return (
        <>
            <span className="material-symbols-outlined">{props.name}</span>
        </>
    );
}
