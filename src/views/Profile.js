import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoginRedirect from './LoginRedirect';
import apiCall from '../common/apiCall';
import { clearUserData, resetFlashcards } from '../common/reducers/userActions';

const mapStateToProps = state => ({
    user: state.userReducer,
});

const mapDispatchToProps = dispatch => ({
    clearUserData: () => dispatch(clearUserData()),
    resetFlashcards: () => dispatch(resetFlashcards())
});

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
    };

    logout = () => {
        apiCall('/api/logout', { method: 'POST' }, (res, err) => {
            if (!err) {
                this.props.clearUserData();
                this.props.history.push('/');
            };
        });
    };

    reset = () => {
        let newData = JSON.stringify({ flashcards: [] });
        apiCall('/api/flashcardsUpdate', {
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
                this.setState({ message: 'Twoje postępy zostały skasowane' });
            };
        });
    };

    render() {
        const { username, email, isLoggedIn } = this.props.user;
        const { message } = this.state;
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
                    <h3>Opcje konta</h3>
                    { message
                        ? <p>{ message }</p>
                        : <p></p>
                    }
                    <p>Resetowanie postępów - wszystkie fiszki nieodwracalnie wrócą poza pudełko.</p>
                    <input type='button' className='button button' value='Resetuj' onClick={ this.reset } /><br />
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
    clearUserData: PropTypes.func.isRequired
};
