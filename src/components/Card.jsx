import React from 'react'

function Card(props) {
    const dragStart = e => {
        const target = e.currentTarget;
    
        e.dataTransfer.setData('card_id', target.id)
        e.dataTransfer.setData('card_address', props.address)
    }

    const dragOver = e => {
        e.stopPropagation();
    }

    const handleClick = e => {
        // console.log("CARD PROPS", props)
        props.showModal(e.currentTarget)
    }

    return (
        <div
            onClick={handleClick}
            id={props.id}
            className={props.className}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            data-address={props.address}
            data-token_id={props.nft.token_id}
            data-img-url={props.nft.image}            
            data-symbol={props.nft.symbol}
            data-token_uri={props.nft.token_uri}
            data-attributes={JSON.stringify(props.nft.metadata?.attributes)}
        >
            {props.children}
            {/* <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} className="nft-modal">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal> */}
        </div>
        
    )
}

export default Card
