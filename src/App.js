import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Test from './views/Test';
import { fillCardsArray } from './views/cardActions.js';
import cards from './data/flashcards.json'; //To be replaced with a function that ask backend to provide app with this data, i.e. getFlashcards();

const mapStateToProps = state => ({
    cards: state.cardsReducer
});

const mapDispatchToProps = dispatch => ({
    fillCardsArray: (cardsArray) => dispatch(fillCardsArray(cardsArray))
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testStart: false
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

    render() {
        return (
            <div className='app'>
                <div onClick = {() => this.setState({testStart: true})}>Click to start</div>
                {this.state.testStart === true
                    ? <Test />
                    : <p>Nothing to do yet</p>
                }
            </div>
        );
    }
}

App.propTypes = {
    cards: PropTypes.array.isRequired,
    fillCardsArray: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
