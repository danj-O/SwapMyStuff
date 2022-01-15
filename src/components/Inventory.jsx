import React from 'react'
import Board from './Board'
import Card from './Card'
import Address from "components/Address/Address"
import { useVerifyMetadata } from "hooks/useVerifyMetadata";


function Inventory(props) {
    const nfts = props.data;
    const { verifyMetadata } = useVerifyMetadata();

    return (
        <div className='inventory-box'>
            <div className="address-box">
                <Address />
                <p>INVENTORY</p>
            </div>
            <Board id="board-1" className="board inventory">
                {nfts?.result && nfts.result.map((nft, index) => {
                    nft = verifyMetadata(nft);
                    return(
                        <Card key={index} id={`card-${index}`} className="card" draggable="true" nft={nft} address={nft.token_address} showModal={props.showModal}>
                            <img id={`card-${index}`} src={nft?.image} alt="" />
                            <p>{nft.token_address}</p>
                        </Card>
                    )
                })}
            </Board>
            <img className="inventory-img" src="/inventory.png" alt="" srcset="" />
        </div>
    )

}

export default Inventory
