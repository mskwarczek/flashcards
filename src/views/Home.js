import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearUserData } from '../common/reducers/userActions';

const mapStateToProps = state => ({
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    clearUserData: () => dispatch(clearUserData())
});

const Home = (props) => {

    const logout = () => {
        fetch('/api/logout', {
            method: 'POST'
        })
            .then(res => res.json())
            .then(res => {
                if (res !== 'ERROR') {
                    props.clearUserData();
                    props.history.push('/');
                } else {
                    console.log(res);
                };
            });
    };

    return (
        <div className='home'>
            <NavLink to='/test' className='button button--big'>Test</NavLink>
            <NavLink to='/practice' className='button button--big'>Trening</NavLink>
            <NavLink to='/summary' className='button button--big'>Podsumowanie</NavLink>
            <input type='button' className='button' value='Wyloguj' onClick={logout} />
        </div>
    );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));