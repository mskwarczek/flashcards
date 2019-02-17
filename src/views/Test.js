import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Card from './Card';
import { pushForward, pushBackward } from './cardActions.js';

const mapStateToProps = state => ({
    cards: state.cardsReducer
});

const mapDispatchToProps = dispatch => ({
    pushForward: (id) => dispatch(pushForward(id)),
    pushBackward: (id) => dispatch(pushBackward(id)),
});

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
        }
    }

    increaseIndex = () => {
        const newIndex = this.state.index + 1;
        this.setState({
            index: newIndex
        });
    }

    pushForward = (id) => {
        this.props.pushForward(id);
        this.increaseIndex();
    }

    pushBackward = (id) => {
        this.props.pushBackward(id);
        this.increaseIndex();
    }

    render() {
        return (
            <div className='test'>
                <Card 
                    card={this.props.cards[this.state.index]}
                    pushForward={this.pushForward}
                    pushBackward={this.pushBackward}/>
            </div>
        );
    }
}

Test.propTypes = {
    cards: PropTypes.array.isRequired,
    pushForward: PropTypes.func.isRequired,
    pushBackward: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
