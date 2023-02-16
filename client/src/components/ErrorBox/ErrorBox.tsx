import './ErrorBox.scss';

interface ErrorBoxProps {
    errorMessage: string;
}

export const ErrorBox = ({ errorMessage }: ErrorBoxProps) => {
    return (
        <div className="ErrorBoxContainer">
            <div className="ErrorBox">
                <div className="errorIcon">
                    <span className="material-symbols-outlined">error</span>
                </div>
                <div className="errorText">
                    <span>{errorMessage}</span>
                </div>
            </div>
        </div>
    );
};
