// IMPORTS
import EntrySlider from '../EntrySlider/EntrySlider';
import './BoxSlider.scss';
import InfoButton from '../../Buttons/InfoButton/InfoButton';

function BoxSlider(props) {
    //RENDER

    return (
        <div className="BoxSlider">
            <div className="BoxHeader">
                <h3 className="Title">{props.boxData.label}</h3>
                <InfoButton modalText={props.boxData.modalText} />
            </div>

            <p className="Oeexplain">{props.boxData.explanation}</p>

            <div>
                <EntrySlider
                    onChange={props.onChange}
                    name={props.boxData.name}
                    value={props.value}
                    SliderData={{ color: 'Current' }}
                />
            </div>
        </div>
    );
}

export default BoxSlider;
