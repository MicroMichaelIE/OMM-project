import { Slider } from '@mui/material';
import './EntrySlider.scss';

function EntrySlider(props) {
    // FUNCTIONS

    const handleChange = (e) => {
        if (e.target.value.length > 2) {
            if (e.target.value == 100) {
                e.target.value = e.target.value.slice(0, 3);
            } else if (
                e.target.value == 1000 ||
                e.target.value == 1001 ||
                e.target.value == 1002 ||
                e.target.value == 1003 ||
                e.target.value == 1004 ||
                e.target.value == 1005 ||
                e.target.value == 1006 ||
                e.target.value == 1007 ||
                e.target.value == 1008 ||
                e.target.value == 1009
            ) {
                e.target.value = e.target.value.slice(0, 3);
            } else {
                e.target.value = e.target.value.slice(0, 2);
            }
        }
        props.onChange(e, props.id);
    };

    //RENDER

    return (
        <div className={'EntrySlider ' + props.SliderData.color}>
            <div className="Manual">
                <div className="PercentWrapper">
                    <input
                        type="number"
                        name={props.name}
                        id=""
                        value={props.value}
                        onChange={handleChange}
                        min={0}
                        max={100}
                    />
                    <div className="InnerWrapper">
                        <p> %</p>
                    </div>
                </div>
            </div>
            <Slider
                defaultValue={props.value}
                valueLabelDisplay="off"
                min={0}
                max={100}
                value={Math.round(props.value)}
                onChange={handleChange}
                name={props.name}
                id={props.id}
            />
            <div className="Scale">
                <p>0 %</p>
                <p>100 %</p>
            </div>
        </div>
    );
}

export default EntrySlider;
