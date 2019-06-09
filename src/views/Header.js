import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
            fetch('/api/user')
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    if (res !== 'ERROR') {
                        this.props.setUserData(res);
                    };
                });
        };
    };

    logout = () => {
        fetch('/api/logout', {
            method: 'POST'
        })
            .then(res => res.json())
            .then(res => {
                if (res !== 'ERROR') {
                    this.props.clearUserData();
                    this.props.history.push('/');
                } else {
                    console.log(res);
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
                            <p>Hello <span className='highlight'>{ user.username }</span>!</p>
                        </div>
                        <div className='user-panel__buttons'>
                            <NavLink to='/profile' className='button button--small'>Profil</NavLink>
                            <input type='button' className='button button--small' value='Wyloguj' onClick={ this.logout}  />
                        </div>
                    </div>
                    : <div className='user-panel__buttons'>
                        { location.pathname !== '/'
                            ? <NavLink to='/' className='button button--small'>Logowanie</NavLink>
                            : null
                        }
                    </div>
                }
                <div>
                    <h1>Flashcards</h1>
                </div>
            </div>
        );
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));

Header.propTypes = {
    user: PropTypes.object.isRequired,
    clearUserData: PropTypes.func.isRequired
};
