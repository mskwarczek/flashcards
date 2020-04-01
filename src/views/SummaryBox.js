import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const SummaryBox = (props) => {

    const { t } = useTranslation('summary');

    return (
        <div className='summary-box__elem'>
            <h3>{ props.boxNumber }</h3>
            <p>{t('flashcards')}: { props.boxAmount }</p>
        </div>
    );
};

SummaryBox.propTypes = {
    boxNumber: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    boxAmount: PropTypes.number.isRequired
};

export default SummaryBox;
