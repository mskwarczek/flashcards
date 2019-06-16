import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import apiCall from '../common/apiCall';
import { setUserData, clearUserData } from '../common/reducers/userActions';

const mapStateToProps = state => ({
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    clearUserData: () => dispatch(clearUserData()),
    setUserData: (user) => dispatch(setUserData(user))
});

class Header extends Component {

    componentDidMount() {
        const { user, location } = this.props;
        if (user.isLoggedIn !== true && location.pathname !== '/') {
            apiCall('/api/user', {}, (res, err) => {
                if (!err) {
                    this.props.setUserData(res);
                };
            });
        };
    };

    logout = () => {
        apiCall('/api/user/logout', { method: 'POST' }, (res, err) => {
            if (!err) {
                this.props.clearUserData();
                this.props.history.push('/');
            };
        });
    };

    render() {
        const { user, location } = this.props;
        return (
            <div className='header'>
                { user.username && location.pathname !== '/'
                    ? <div className='user-panel'>
                        <div>
                            <p>Witaj <span className='highlight'>{ user.username }</span>!</p>
                        </div>
                        <div className='user-panel__buttons'>
                            <NavLink to='/profile' className='button button--small'>Profil</NavLink>
                            <input type='button' className='button button--small' value='Wyloguj' onClick={ this.logout } />
                        </div>
                    </div>
                    : <div className='user-panel__buttons'>
                        { location.pathname !== '/'
                            ? <NavLink to='/' className='button button--small'>Logowanie</NavLink>
                            : null
                        }
                    </div>
                }
                <h1>Flashcards</h1>
            </div>
        );
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));

Header.propTypes = {
    user: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired,
    clearUserData: PropTypes.func.isRequired
};
