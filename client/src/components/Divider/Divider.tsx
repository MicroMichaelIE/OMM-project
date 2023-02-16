import './Divider.scss';

interface DividerProps {
    children: React.ReactNode | string;
}

export default function Divider(props: DividerProps) {
    return (
        <div className="container">
            <div className="border" />
            <span className="content">{props.children}</span>
            <div className="border" />
        </div>
    );
}
