import React from 'react';
import PropTypes from 'prop-types';

export default function ProgressBarBox(props) {
    return (
        <div className={props.type} style={{ width: props.width }}>
            <p className='progress-bar__number'>{props.text}</p>
            <p className='progress-bar__amount'>{props.amount}</p>
        </div>
    );
};

ProgressBarBox.propTypes = {
    text: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    width: PropTypes.string,
    type: PropTypes.string
};
