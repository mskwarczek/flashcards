import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { setUserData } from '../common/reducers/userActions.js';

const mapStateToProps = state => ({
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    setUserData: (user) => dispatch(setUserData(user))
});

class Login extends Component {

    login = () => {
        this.apiCall('/user')
            .then(user => this.props.setUserData(user));
    }

    apiCall = async (endpoint) => {
        const response = await fetch('/api' + endpoint);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    render() {
        return(
            <div>
                <NavLink to='/home'><div className='button button--big' onClick={this.login}>Zaloguj się*</div></NavLink>
                <p>* Używając danych przygotowanych na potrzeby testowania aplikacji</p>
                <br />
                <NavLink to='/home'><div className='button'>Bez logowania*</div></NavLink>
                <p>* Dostępna tylko opcja treningu</p>
            </div>
        );
    }
}

Login.propTypes = {
    user: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
