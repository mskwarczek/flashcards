import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import LoginRedirect from './LoginRedirect';
import SetsSelect from './SetsSelect';
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
            chosenFlashcardsSet: '',
            message: null
        };
    };

    componentDidMount() {
        if (this.props.user.isLoggedIn !== true) {
            apiCall('/api/user', {}, (res, err) => {
                if (!err) {
                    this.setState({ chosenFlashcardsSet: res.activeFlashcardsSet._id });
                    this.props.setUserData(res);
                };
            });
        } else {
            this.setState({ chosenFlashcardsSet: this.props.user.activeFlashcardsSet._id });
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
        const { t } = this.props;
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
                this.setState({ message: `${t('msgFail')} ${err.message}` });
            }
            else {
                apiCall('/api/user', {}, (res, err) => {
                    if (!err) {
                        this.props.setUserData(res);
                    };
                });
                this.setState({ message: t('msgSuccess') });
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
        const { t } = this.props;
        let newData = JSON.stringify({ activeFlashcardsSet: undefined, flashcards: [] });
        apiCall('/api/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newData
        }, (res, err) => {
            if (err) {
                this.setState({ message: `${t('msgFail')} ${err.message}` });
            } else {
                this.props.resetFlashcards();
                this.setState({ message: t('msgSuccess') });
            };
        });
    };

    render() {
        const { t } = this.props;
        const { username, email, isLoggedIn } = this.props.user;
        const { message, chosenFlashcardsSet, flashcardsSets } = this.state;
        if (!isLoggedIn) {
            return (
                <div>
                    <h2>{t('userProfile')}</h2>
                    <LoginRedirect />
                </div>
            );
        };
        return (
            <div>
                <h2>{t('userProfile')}</h2>
                <div>
                    <h3>{t('userData')}</h3>
                    <p>{t('userName')} <span className='highlight'>{ username }</span></p>
                    <p>{t('userEmail')} <span className='highlight'>{ email }</span></p>
                </div>
                    <div>
                        { message
                            ? <p>{ message }</p>
                            : null
                        }
                    </div>
                <div>
                    <h3>{t('accountOptions')}</h3>
                    <h4>{t('activeFlashcardsSet')}</h4>
                    <SetsSelect name='flashcardsSets' onChange={ this.handleChange } value={ chosenFlashcardsSet } sets={ flashcardsSets }/>
                    <p>{t('setChangeInfo')}</p>
                    <input type='button' className='button' value={t('change')} onClick={ this.flashcardsSetUpdate } /><br />
                    <p>{t('progressResetInfo')}</p>
                    <input type='button' className='button' value={t('reset')} onClick={ this.resetFlashcards } /><br />
                </div>
                <div>
                <input type='button' className='button' value={t('logout')} onClick={ this.logout } /><br />
                <NavLink to='/home' className='button button--important'>{t('back')}</NavLink>
                </div>
            </div>
        );
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation('profile')(Profile)));

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired,
    clearUserData: PropTypes.func.isRequired,
    resetFlashcards: PropTypes.func.isRequired
};
