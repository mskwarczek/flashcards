import React from 'react';
import PropTypes from 'prop-types';

export default function Card(props) {
    const flipCard = () => {
        const front = document.querySelector('.card__front');
        const back = document.querySelector('.card__back');
        front.classList.toggle('flip-front');
        back.classList.toggle('flip-back');
    }
    return (
        <div className='card'>
            <div className='card__front'>
                <div className="empty"></div>
                <p className='card__title'>{props.card.front}</p>
                <div className='card__button-box'>
                    <div className='button' onClick={() => flipCard()}>Sprawdź</div>
                </div>
            </div>
            <div className='card__back '>
                <p className='card__title'>{props.card.front}</p>
                <p className='card__description'>{props.card.back}</p>
                <div className='card__button-box'>
                    <div className='button' onClick={() => {
                        flipCard();
                        props.pushBackward(props.card.id)
                    }}>Nie umiem</div>
                    <div className='button' onClick={() => {
                        flipCard();
                        props.pushForward(props.card.id)
                    }}>Umiem!</div>
                </div>
            </div>
        </div>
    );
}

Card.propTypes = {
    card: PropTypes.object.isRequired,
    pushForward: PropTypes.func.isRequired,
    pushBackward: PropTypes.func.isRequired
};