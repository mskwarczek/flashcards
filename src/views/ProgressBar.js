import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import ProgressBarBox from './ProgressBarBox';

const ProgressBar = (props) => {

    const { t } = useTranslation('session');

    const calculateWidth = (box) => {
        return ((props.cards.filter(card => card.box === box).length) / props.cards.filter(card => card.box > 0 && card.box < 6).length) * 100 + '%';
    };
    const calculateAmount = (box) => {
        return props.cards.filter(card => card.box === box).length;
    };
    const calculateOverall = () => {
        return ((props.current - props.cards.filter(card => card.box >= 6).length) / props.cards.filter(card => card.box > 0 && card.box < 6).length) * 100 + '%';
    };
    return (
        <div className='progress-bar-container'>
            <ProgressBarBox text={t('boxKnown')} amount={calculateAmount(6)} type={'edge-box'}/>
            <div className='progress-bar'>
                <ProgressBarBox text={'V'} width={calculateWidth(5)} amount={calculateAmount(5)} type={'progress-bar__box'}/>
                <ProgressBarBox text={'IV'} width={calculateWidth(4)} amount={calculateAmount(4)} type={'progress-bar__box'}/>
                <ProgressBarBox text={'III'} width={calculateWidth(3)} amount={calculateAmount(3)} type={'progress-bar__box'}/>
                <ProgressBarBox text={'II'} width={calculateWidth(2)} amount={calculateAmount(2)} type={'progress-bar__box'}/>
                <ProgressBarBox text={'I'} width={calculateWidth(1)} amount={calculateAmount(1)} type={'progress-bar__box'}/>
                <div className='progress-bar__overall' style={{width: calculateOverall()}}></div>
            </div>
            <ProgressBarBox text={t('boxUnknown')} amount={calculateAmount(0)} type={'edge-box'}/>
        </div>
    );
};

ProgressBar.propTypes = {
    cards: PropTypes.array.isRequired,
    current: PropTypes.number.isRequired
};

export default ProgressBar;
