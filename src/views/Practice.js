import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

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
        apiCall('/api/flashcards', {}, (res, err) => {
            if(err) {
                this.setState({ error: `Nie udało się pobrać fiszek. ${err.message}` });
            } else {
                apiCall(`api/flashcards/${res[0]._id}`, {}, (cards, err) => {
                    if (err) {
                        this.setState({ error: `Nie udało się pobrać fiszek. ${err.message}` });
                    } else {
                        this.setState({ sets: res, activeSet: res[0]._id, isReverse: res[0].isReverse, cards });
                    };
                });
            };
        });
    };

    handleChange = (event) => {
        const id = event.target.value;
        const reverse = this.state.sets.filter(set => set._id === id)[0].isReverse;
        apiCall(`api/flashcards/${id}`, {}, (cards, err) => {
            if (err) {
                this.setState({ error: `Nie udało się pobrać fiszek. ${err.message}` });
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
        if (error) {
            return (
                <div>
                    <h2>Trening</h2>
                    { error }<br />
                    <NavLink to='/home' className='button'>Powrót</NavLink>
                </div>
            );
        } else { 
            return (
                <div>
                    <h2>Trening</h2>
                    <div>
                        <h4>Wybierz zestaw fiszek</h4>
                        <SetsSelect name='flashcardsSets' onChange={ this.handleChange } value={ activeSet } sets={ sets } />
                    </div>
                    { cards.length > 0 
                        ? <div className='practice'>
                            <Card card={ cards[activeCard] } nextCard={ this.nextCard } reverse={ isReverse }/>
                            <NavLink to='/home' className='button'>Zakończ</NavLink>
                        </div>
                        : <div>
                            Trwa pobieranie danych z serwera...
                        </div>
                    }
                </div>
            );
        };
    };
};

export default Practice;
