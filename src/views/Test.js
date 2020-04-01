import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import Card from './Card';
import LoginRedirect from './LoginRedirect';
import ProgressBar from './ProgressBar';
import apiCall from '../common/apiCall';
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
            firstBoxBaseSize: 15,
            isReverse: false,
            error: null
        };
    };

    componentDidMount() {
        if (this.props.user.isLoggedIn !== true) {
            apiCall('/api/user', {}, (res, err) => {
                if (err) {
                    if (err.message === '401') {
                        this.setState({ running: -1 });
                    } else {
                        this.setState({ error: err.message });
                    };
                } else {
                    this.props.setUserData(res);
                    this.setState({ 
                        firstBoxBaseSize: res.activeFlashcardsSet.initialBoxSize,
                        isReverse: res.activeFlashcardsSet.isReverse
                    });
                    this.getData();
                };
            });
        } else {
            this.setState({ 
                firstBoxBaseSize: this.props.user.activeFlashcardsSet.initialBoxSize,
                isReverse: this.props.user.activeFlashcardsSet.isReverse
             });
            this.getData();
        };
    };

    getData = () => {
        const { t } = this.props;
        apiCall(`api/flashcards/${this.props.user.activeFlashcardsSet._id}`, {}, (res, err) => {
            if (err) {
                this.setState({ error: `${t('errorFlashcardsFetch')} ${err.message}` });
            } else {
                this.prepareFlashcards(res);
            };
        });
    };

    prepareFlashcards = (cards) => {
        const { t } = this.props;
        cards = this.combineUserWithCards(cards);
        cards = this.fillFirstBox(cards);
        cards.sort((a, b) => b.box - a.box);
        this.props.fillCardsArray(cards);
        let newIndex = cards.filter(elem => elem.box >= 6).length
        if (this.props.cards.length > newIndex) {
            this.setState({ running: 1, index: newIndex });
        } else {
            this.setState({ error: t('errorEndOfSet') });
        };
    };

    combineUserWithCards = (cards) => {
        return cards.map(card => {
            let newCard = { ...card, box: 0 };
            this.props.user.flashcards.forEach((box, index) => {
                if (box.some(id => id === card.id)) {
                    newCard = { ...card, box: index };
                };
            });
            return newCard;
        });
    };

    fillFirstBox = (cards) => {
        let firstBoxLength = cards.filter(elem => elem.box === 1).length;
        return cards.map(card => {
            if (card.box === 0 && firstBoxLength < this.state.firstBoxBaseSize) {
                firstBoxLength++;
                return { ...card, box: 1 };
            };
            return card;
        });
    };

    pushForward = (id) => {
        this.props.pushForward(id);
        this.increaseIndex();
    };

    pushBackward = (id) => {
        this.props.pushBackward(id);
        this.increaseIndex();
    };

    increaseIndex = () => {
        const newIndex = this.state.index + 1;
        if (newIndex < this.props.cards.filter(card => card.box !== 0).length)
            this.setState({
                index: newIndex
            });
        else {
            this.setState({
                running: 2
            });
        };
    };

    sendUserData = (newData) => {
        newData = JSON.stringify(newData);
        apiCall('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newData
        });
    };

    updateUserData = () => {
        let newData = [[], [], [], [], [], [], []];
        this.props.cards.forEach(card => {
            newData[card.box].push(card.id);
        });
        newData = { ...this.props.user, flashcards: newData }
        this.props.setUserData(newData);
        this.sendUserData({ flashcards: newData.flashcards, activeFlashcardsSet: undefined });
        this.props.history.push('/summary');
    };

    render() {
        const { isReverse, running, error, index } = this.state;
        const { t } = this.props;
        if (error) {
            return (
                <div>
                    <h2>{t('test')}</h2>
                    <p>{ error }</p><br />
                    <NavLink to='/home' className='button'>{t('back')}</NavLink>
                </div>
            );
        } else {
            switch (running) {
                case 0: return (
                    <div className='test'>
                        {t('dataFetch')}
                    </div>);
                case 1: return (
                    <div className='test'>
                        <h2>{t('test')}</h2>
                        <Card
                            card={ this.props.cards[index] }
                            test={ true }
                            reverse = { isReverse }
                            pushForward={ this.pushForward }
                            pushBackward={ this.pushBackward } />
                        <ProgressBar
                            cards={ this.props.cards }
                            current={ index } />
                        <NavLink to='/home' className='button'>{t('break')}</NavLink>
                        <p>{t('warningSessionNotSaved')}</p>
                    </div>);
                case 2: return (
                    <div>
                        <h2>{t('test')}</h2>
                        <p>{t('congratulations')}</p>
                        <p>{t('goToSummary')}</p><br />
                        <input type='button' className='button button--important' value={t('continue')} onClick={ this.updateUserData } />
                    </div>);
                case -1: return (
                    <div>
                        <h2>{t('test')}</h2>
                        <LoginRedirect />
                    </div>);
                default: return null;
            };
        };
    };
};

Test.propTypes = {
    cards: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    pushForward: PropTypes.func.isRequired,
    pushBackward: PropTypes.func.isRequired,
    fillCardsArray: PropTypes.func.isRequired,
    setUserData: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation('session')(Test)));
