import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Card from './Card';
import { pushForward, pushBackward, fillCardsArray } from './cardActions.js';
import cards from '../data/flashcards.json'; //To be replaced with a function that ask backend to provide app with this data, i.e. getFlashcards();

const mapStateToProps = state => ({
    cards: state.cardsReducer
});

const mapDispatchToProps = dispatch => ({
    pushForward: (id) => dispatch(pushForward(id)),
    pushBackward: (id) => dispatch(pushBackward(id)),
    fillCardsArray: (cardsArray) => dispatch(fillCardsArray(cardsArray))
});

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            isRunning: false
        }
        this.prepareFlashcards();
    }

    fillFirstBox = () => {
        let firstBoxLength = cards.filter(elem => elem.box === 1).length;
        return cards.map(card => {
            if (card.box === 0 && firstBoxLength < 10) {
                firstBoxLength++;
                return { ...card, box: 1 };
            }
            return card;
        });
    }
    
    prepareFlashcards = () => { //This can be moved to backend later
        let preparedCards = cards;
        preparedCards = this.fillFirstBox(preparedCards);
        preparedCards.sort((a, b) => b.box - a.box);
        this.props.fillCardsArray(preparedCards);
    }

    increaseIndex = () => {
        const newIndex = this.state.index + 1;
        if (newIndex < this.props.cards.filter(card => card.box !== 0).length)
            this.setState({
                index: newIndex
            });
        else {
            this.setState({
                isRunning: false
            });
        }
    }

    pushForward = (id) => {
        this.props.pushForward(id);
        this.increaseIndex();
    }

    pushBackward = (id) => {
        this.props.pushBackward(id);
        this.increaseIndex();
    }

    render() {
        return (
            <div className='test'>
            { this.state.isRunning
                ? <Card 
                    card={this.props.cards[this.state.index]}
                    pushForward={this.pushForward}
                    pushBackward={this.pushBackward}/>
                : <div className='button button--big' onClick={() => this.setState({isRunning: true})}>Start</div>
            }
            </div>
        );
    }
}

Test.propTypes = {
    cards: PropTypes.array.isRequired,
    pushForward: PropTypes.func.isRequired,
    pushBackward: PropTypes.func.isRequired,
    fillCardsArray: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
