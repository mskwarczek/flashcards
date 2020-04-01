import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import Card from './Card';
import SetsSelect from './SetsSelect';
import apiCall from '../common/apiCall';

class Practice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sets: [],
            activeSet: '',
            isReverse: false,
            cards: [],
            activeCard: 0,
            error: null
        };
    };

    componentDidMount() {
        const { t } = this.props;
        apiCall('/api/flashcards', {}, (res, err) => {
            if(err) {
                this.setState({ error: `${t('errorFlashcardsFetch')} ${err.message}` });
            } else {
                apiCall(`api/flashcards/${res[0]._id}`, {}, (cards, err) => {
                    if (err) {
                        this.setState({ error: `${t('errorFlashcardsFetch')} ${err.message}` });
                    } else {
                        this.setState({ sets: res, activeSet: res[0]._id, isReverse: res[0].isReverse, cards });
                    };
                });
            };
        });
    };

    handleChange = (event) => {
        const { t } = this.props;
        const id = event.target.value;
        const reverse = this.state.sets.filter(set => set._id === id)[0].isReverse;
        apiCall(`api/flashcards/${id}`, {}, (cards, err) => {
            if (err) {
                this.setState({ error: `${t('errorFlashcardsFetch')} ${err.message}` });
            } else {
                this.setState({ activeSet: id, isReverse: reverse, cards });
            };
        });
    };

    nextCard = () => {
        this.setState({ activeCard: Math.floor(Math.random() * this.state.cards.length) });
    };

    render() {
        const { sets, activeSet, isReverse, cards, activeCard, error } = this.state;
        const { t } = this.props;
        if (error) {
            return (
                <div>
                    <h2>{t('training')}</h2>
                    { error }<br />
                    <NavLink to='/home' className='button'>{t('back')}</NavLink>
                </div>
            );
        } else { 
            return (
                <div>
                    <h2>{t('training')}</h2>
                    <div>
                        <h4>{t('chooseSet')}</h4>
                        <SetsSelect name='flashcardsSets' onChange={ this.handleChange } value={ activeSet } sets={ sets } />
                    </div>
                    { cards.length > 0 
                        ? <div className='practice'>
                            <Card card={ cards[activeCard] } nextCard={ this.nextCard } reverse={ isReverse }/>
                            <NavLink to='/home' className='button'>{t('finish')}</NavLink>
                        </div>
                        : <div>
                            {t('dataFetch')}
                        </div>
                    }
                </div>
            );
        };
    };
};

export default withTranslation('session')(Practice);
