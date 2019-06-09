import React from 'react';
import PropTypes from 'prop-types';

const Card = (props) => {

    const flipCard = () => {
        const front = document.querySelector('.card__front');
        const back = document.querySelector('.card__back');
        front.classList.toggle('flip-front');
        back.classList.toggle('flip-back');
    };

    const { id, front, back } = props.card;

    return (
        <div className='card'>
            <div className='card__front'>
                <div className="empty"></div>
                <p className='card__title'>{ front }</p>
                <div className='card__button-box'>
                    <div className='button' onClick={ () => flipCard() }>Sprawdź</div>
                </div>
            </div>
            <div className='card__back '>
                <p className='card__title'>{ front }</p>
                <p className='card__description'>{ back }</p>
                { props.test
                    ? <div className='card__button-box'>
                        <div className='button' onClick={ () => {
                            flipCard();
                            props.pushBackward(id)
                        }}>Nie umiem</div>
                        <div className='button' onClick={ () => {
                            flipCard();
                            props.pushForward(id)
                        }}>Umiem!</div>
                    </div>
                    : <div className='card__button-box'>
                        <div className='button' onClick={ () => {
                            flipCard();
                            props.nextCard()
                        }}>Dalej</div>
                    </div>
                }
            </div>
        </div>
    );
};

Card.propTypes = {
    card: PropTypes.object.isRequired,
    pushForward: PropTypes.func,
    pushBackward: PropTypes.func,
    nextCard: PropTypes.func,
    test: PropTypes.bool
};

export default Card;
