import React from 'react';

const SetsSelect = (props) => {
    const selected = props.sets.filter(set => set._id === props.value)[0];
    return (
        <div className='select-container'>
            <select name={props.name } onChange={ props.onChange } value={ props.value }>
                { props.sets.length > 0
                    ? props.sets.map(set => {
                        return <option key={ set._id } value={ set._id }>{ set.name } [{ set.lang }]</option>
                    })
                    : <option>Wczytywanie zestawów fiszek...</option>
                }
            </select>
            <p className='small-screen-info'>Wybrano: { selected && selected.name }</p>
        </div>
    );
};

export default SetsSelect;
