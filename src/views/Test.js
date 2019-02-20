import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Card from './Card';
import { pushForward, pushBackward, fillCardsArray } from '../common/reducers/cardActions.js';
import { setUserData } from '../common/reducers/userActions.js';

const mapStateToProps = state => ({
    cards: state.cardsReducer,
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    pushForward: (id) => dispatch(pushForward(id)),
    pushBackward: (id) => dispatch(pushBackward(id)),
    fillCardsArray: (cardsArray) => dispatch(fillCardsArray(cardsArray)),
    setUserData: (user) => dispatch(setUserData(user))
});

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            running: 0, // 0 - test not started, 1 - test running, 2 - test finished, -1 user not logged in
            firstBoxBaseSize: 10
        }
    }

    componentDidMount() {
        if (!this.props.user.flashcards) {
            this.setState({running: -1});
        } else {
        this.getData()
            .then(result => this.prepareFlashcards(result));
        }
    }

    getData = async () => {
        const cards = await this.apiCall('/flashcards');
        return cards;
    }

    apiCall = async (endpoint) => {
        const response = await fetch('/api' + endpoint);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    prepareFlashcards = (cards) => {
        cards = this.combineUserWithCards(cards);
        cards = this.fillFirstBox(cards);
        cards.sort((a, b) => b.box - a.box);
        this.props.fillCardsArray(cards);
        this.setState({running: 1, index: cards.filter(elem => elem.box >= 6).length});
        return true;
    }

    combineUserWithCards = (cards) => {
        return cards.map(card => {
            let newCard = { ...card, box: 0 };
            this.props.user.flashcards.forEach((box, index) => {
                if (box.some(id => id === card.id)) {
                    newCard = { ...card, box: index };
                }
            });
            return newCard;
        });
    }

    fillFirstBox = (cards) => {
        let firstBoxLength = cards.filter(elem => elem.box === 1).length;
        return cards.map(card => {
            if (card.box === 0 && firstBoxLength < this.state.firstBoxBaseSize) {
                firstBoxLength++;
                return { ...card, box: 1 };
            }
            return card;
        });
    }

    pushForward = (id) => {
        this.props.pushForward(id);
        this.increaseIndex();
    }

    pushBackward = (id) => {
        this.props.pushBackward(id);
        this.increaseIndex();
    }

    increaseIndex = () => {
        const newIndex = this.state.index + 1;
        if (newIndex < this.props.cards.filter(card => card.box !== 0).length)
            this.setState({
                index: newIndex
            });
        else {
            this.updateUserData();
            this.setState({
                running: 2,
            });
        }
    }

    sendUserData = async (newData) => {
        return await fetch('/api/user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });
    }

    updateUserData = () => {
        let newData = [[],[],[],[],[],[],[]];
        this.props.cards.forEach(card => {
            newData[card.box].push(card.id);
        });
        newData = { ...this.props.user, flashcards: newData }
        this.props.setUserData(newData);
        this.sendUserData(newData);
    }

    render() {
        switch(this.state.running) {
            case 0: return (
                <div className='test'>
                    <div>Trwa pobieranie danych z serwera...</div>
                </div>);
            case 1: return (
                <div className='test'>
                    <h2>Test</h2>
                    <Card 
                    card={this.props.cards[this.state.index]}
                    test={true}
                    pushForward={this.pushForward}
                    pushBackward={this.pushBackward}/>
                    <NavLink to='/home'><div className='button'>Przerwij</div></NavLink>
                </div>);
            case 2: return (
                <div className='test'>
                    <NavLink to='/summary'><div className='button button--big'>Zakończ test</div></NavLink>
                </div>);
            case -1: return (
                <div className='test'>
                    <NavLink to='/'><div className='button button--big'>Musisz się zalogować</div></NavLink>
                </div>)
            default: return null;
        }
    }
}

Test.propTypes = {
    cards: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    pushForward: PropTypes.func.isRequired,
    pushBackward: PropTypes.func.isRequired,
    fillCardsArray: PropTypes.func.isRequired,
    setUserData: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
