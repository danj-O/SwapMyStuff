import React from "react";

function Board(props){
    const drop = e => {
        e.preventDefault();
        const card_id = e.dataTransfer.getData('card_id');
        const card_address = e.dataTransfer.getData('card_address');
        console.log('card addy', card_address)

        const card = document.getElementById(card_id);
        card.style.display = 'block';

        e.target.appendChild(card);
    }

    const dragOver = e => {
        e.preventDefault();
    }

    return(
            <div
                id={props.id}
                onDrop={drop}
                onDragOver={dragOver}
                className={props.className}
            >
                { props.children }
            </div>
    )
}

export default Board;
