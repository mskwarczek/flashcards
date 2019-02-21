import React from 'react';
import PropTypes from 'prop-types';

export default function SummaryBox(props) {

    return (
        <div className='summary-box__elem'>
            <h3>{props.boxNumber}</h3>
            <p>Fiszki: {props.boxAmount}</p>
        </div>
    );
}

SummaryBox.propTypes = {
    boxNumber: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    boxAmount: PropTypes.number.isRequired
}