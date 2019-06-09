import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearUserData } from '../common/reducers/userActions';

const mapStateToProps = state => ({
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    clearUserData: () => dispatch(clearUserData())
});

const Profile = (props) => {

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
        <div>

        </div>
    );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    clearUserData: PropTypes.func.isRequired
};
