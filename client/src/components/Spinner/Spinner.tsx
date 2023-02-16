import './Spinner.scss';

export const Spinner = () => (
    <div className="container-background">
        <div className="container-position">
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p>
                <strong> Loading...</strong>
            </p>
        </div>
    </div>
);
