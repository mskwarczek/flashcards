import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoginRedirect from './LoginRedirect';
import apiCall from '../common/apiCall';
import { setUserData, clearUserData, resetFlashcards } from '../common/reducers/userActions';

const mapStateToProps = state => ({
    user: state.userReducer,
});

const mapDispatchToProps = dispatch => ({
    setUserData: (user) => dispatch(setUserData(user)),
    clearUserData: () => dispatch(clearUserData()),
    resetFlashcards: () => dispatch(resetFlashcards())
});

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            flashcardsSets: [],
            chosenFlashcardsSet: this.props.user.activeFlashcardsSet._id || '',
            message: null
        };
    };

    componentDidMount() {
        if (this.props.user.isLoggedIn !== true) {
            apiCall('/api/user', {}, (res, err) => {
                if (!err) {
                    this.props.setUserData(res);
                };
            });
        };
        apiCall('/api/flashcards', {}, (res, err) => {
            if (!err) {
                this.setState({ flashcardsSets: res });
            };
        });
    };

    handleChange = (event) => {
        this.setState({ chosenFlashcardsSet: event.target.value });
    };

    flashcardsSetUpdate = () => {
        const { chosenFlashcardsSet } = this.state;
        const newData = JSON.stringify({ activeFlashcardsSet: chosenFlashcardsSet, flashcards: [] });
        apiCall('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newData
        }, (res, err) => {
            if (err) {
                this.setState({ message: `Coś się nie udało. ${err.message}` });
            }
            else {
                apiCall('/api/user', {}, (res, err) => {
                    if (!err) {
                        this.props.setUserData(res);
                    };
                });
                this.setState({ message: 'Operacja zakończona powodzeniem.' });
            };
        });
    };

    logout = () => {
        apiCall('/api/user/logout', { method: 'POST' }, (res, err) => {
            if (!err) {
                this.props.clearUserData();
                this.props.history.push('/');
            };
        });
    };

    resetFlashcards = () => {
        let newData = JSON.stringify({ activeFlashcardsSet: undefined, flashcards: [] });
        apiCall('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newData
        }, (res, err) => {
            if (err) {
                this.setState({ message: `Coś się nie udało. ${err.message}` });
            } else {
                this.props.resetFlashcards();
                this.setState({ message: 'Operacja zakończona powodzeniem.' });
            };
        });
    };

    render() {
        const { username, email, isLoggedIn } = this.props.user;
        const { message, chosenFlashcardsSet, flashcardsSets } = this.state;
        if (!isLoggedIn) {
            return (
                <div>
                    <h2>Profil użytkownika</h2>
                    <LoginRedirect />
                </div>
            );
        };
        return (
            <div>
                <h2>Profil użytkownika</h2>
                <div>
                    <h3>Twoje dane</h3>
                    <p>Nazwa użytkownika: <span className='highlight'>{ username }</span></p>
                    <p>Adres email: <span className='highlight'>{ email }</span></p>
                </div>
                    <div>
                        { message
                            ? <p>{ message }</p>
                            : null
                        }
                    </div>
                <div>
                    <h3>Opcje konta</h3>
                    <h4>Twój aktywny zestaw fiszek</h4>
                    <form>
                        <select name='flashcardsSets' onChange={ this.handleChange } value={ chosenFlashcardsSet }>
                            { flashcardsSets.length > 0
                                ? flashcardsSets.map(set => {
                                    return (
                                        <option key={ set._id } value={ set._id }>{ set.name } [{ set.lang }]</option>
                                    );
                                })
                                : <option>Wczytywanie zestawów fiszek...</option>
                            }
                        </select>
                        <p>Możesz wybrać inny zestaw z listy. Zmiana zestawu spowoduje zresetowanie wszystkich postępów.</p>
                        <input type='button' className='button' value='Zmień' onClick={ this.flashcardsSetUpdate } /><br />
                    </form>
                    <p>Resetowanie postępów - wszystkie fiszki nieodwracalnie wrócą poza pudełko.</p>
                    <input type='button' className='button' value='Resetuj' onClick={ this.resetFlashcards } /><br />
                </div>
                <div>
                <input type='button' className='button' value='Wyloguj' onClick={ this.logout } /><br />
                <NavLink to='/home' className='button button--important'>Powrót</NavLink>
                </div>
            </div>
        );
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired,
    clearUserData: PropTypes.func.isRequired,
    resetFlashcards: PropTypes.func.isRequired
};
