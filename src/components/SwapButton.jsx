import React from 'react'

function SwapButton(props) {
    return (
        <div className='swap-button' onClick={props.onClick}>
            <p>
                {props.children}
            </p>
        </div>
    )
}

export default SwapButton
