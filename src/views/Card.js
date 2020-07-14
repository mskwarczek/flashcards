import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const Card = (props) => {

    const { t } = useTranslation('session');

    const flipCard = () => {
        const front = document.querySelector('.card__front');
        const back = document.querySelector('.card__back');
        front.classList.toggle('flip-front');
        back.classList.toggle('flip-back');
    };

    let { id, front, back } = props.card;
    if (props.reverse) {
        let temp = front;
        front = back;
        back = temp;
    };

    return (
        <div className='card'>
            <div className='card__front'>
                <div className="empty"></div>
                <p className='card__title'>{ front.text }</p>
                { front.note && <p className='note'>{ front.note }</p> }
                <div className='card__button-box'>
                    <div className='button' onClick={ () => flipCard() }>{t('check')}</div>
                </div>
            </div>
            <div className='card__back '>
                <p className='card__title'>{ front.text }</p>
                <p className='card__description'>{ back.text }</p>
                { back.note && <p className='card__description note'>{ back.note }</p> }
                { props.test
                    ? <div className='card__button-box'>
                        <div className='button' onClick={ () => {
                            flipCard();
                            props.pushBackward(id)
                        }}>{t('unknown')}</div>
                        <div className='button' onClick={ () => {
                            flipCard();
                            props.pushForward(id)
                        }}>{t('known')}</div>
                    </div>
                    : <div className='card__button-box'>
                        <div className='button' onClick={ () => {
                            flipCard();
                            props.nextCard()
                        }}>{t('next')}</div>
                    </div>
                }
            </div>
        </div>
    );
};

Card.propTypes = {
    card: PropTypes.object.isRequired,
    reverse: PropTypes.bool,
    pushForward: PropTypes.func,
    pushBackward: PropTypes.func,
    nextCard: PropTypes.func,
    test: PropTypes.bool
};

export default Card;
