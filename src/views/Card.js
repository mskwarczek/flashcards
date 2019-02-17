import React from 'react';
import PropTypes from 'prop-types';

export default function Card(props) {
    const flipCard = () => {
        const front = document.querySelector('.card-front');
        const back = document.querySelector('.card-back');
        front.classList.toggle('hidden');
        back.classList.toggle('hidden');
    }
    return (
        <div className='card-container'>
            <div className='card-front'>
                <p>{props.card.front}</p>
                <div onClick={() => flipCard()}>Sprawdź</div>
            </div>
            <div className='card-back hidden'>
                <p>{props.card.front}</p>
                <p>{props.card.back}</p>
                <div onClick={() => {
                    flipCard();
                    props.pushBackward(props.card.id)
                }}>Muszę to jeszcze powtórzyć</div>
                <div onClick={() => {
                    flipCard();
                    props.pushForward(props.card.id)
                }}>To już umiem!</div>
            </div>
        </div>
    );
}

Card.propTypes = {
    card: PropTypes.object.isRequired,
    pushForward: PropTypes.func.isRequired,
    pushBackward: PropTypes.func.isRequired
};