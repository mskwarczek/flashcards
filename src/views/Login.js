import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import LoginForm from './LoginForm';
import { setUserData } from '../common/reducers/userActions';
import { apiCall } from '../common/tools';

const mapStateToProps = state => ({
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    setUserData: (user) => dispatch(setUserData(user))
});

class Login extends Component {

    login = () => {
        apiCall('/user')
            .then(user => this.props.setUserData(user));
        this.props.history.push('/home');
    }

    render() {
        return(
            <div className='login'>
                <LoginForm login={this.login} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
