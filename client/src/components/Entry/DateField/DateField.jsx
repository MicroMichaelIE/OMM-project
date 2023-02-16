import { DateField } from '@hoffmann/designsystem-components';

export function DateFieldExtended(props) {
    // FUNCTIONS
    const onDivClick = (e) => {
        if (props.dateRange.length > 1 && e.target.value === '') {
            props.setDateRange([]);
        }
    };

    //RENDER

    return (
        <div onClick={(e) => onDivClick(e)}>
            <DateField
                className="dateField"
                monthNames={[
                    'Januar',
                    'Februar',
                    'März',
                    'April',
                    'Mai',
                    'Juni',
                    'Juli',
                    'August',
                    'September',
                    'Oktober',
                    'November',
                    'Dezember',
                ]}
                weekdayNames={['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']}
                clearLabel="Zurücksetzen"
                range
                value={props.dateRange}
                onChange={(v) => props.onChange(v)}
            />
        </div>
    );
}
