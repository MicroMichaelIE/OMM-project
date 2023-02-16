import './BlankCard.scss';

export interface Props {
    children: React.ReactNode;
    className?: string;
}

export const BlankCard = ({ children, className }: Props): JSX.Element => {
    return <div className={`BlankCard ${className}`}>{children}</div>;
};
