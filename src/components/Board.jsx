import { BoxPlotFilled } from "@ant-design/icons";
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

        // if dropped place is in the to be traded Box, add to state with function passed down
        // console.log('e.traget', e.target)
        // if(e.target.id == "board-2"){
        //     console.log("yayyy, board 2")
        // }
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
