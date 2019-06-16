import React from 'react';

const SetsSelect = (props) => {
    return (
        <select name={props.name } onChange={ props.onChange } value={ props.value }>
            { props.sets.length > 0
                ? props.sets.map(set => {
                    return <option key={ set._id } value={ set._id }>{ set.name } [{ set.lang }]</option>
                })
                : <option>Wczytywanie zestawów fiszek...</option>
            }
        </select>
    );
};

export default SetsSelect;
