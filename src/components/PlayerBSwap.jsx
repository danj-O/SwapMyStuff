import React from 'react'
import Board from './Board'
import Card from './Card'
import Address from "components/Address/Address"
import { useVerifyMetadata } from "hooks/useVerifyMetadata";


function PlayerASwap(props) {
    const nfts = props.data;
  const { verifyMetadata } = useVerifyMetadata();

    return (
        <div className='partyA-box'>
            <div className="address-box">
                {/* <Address /> */}
                <p>PARTY B OFFER</p>
            </div>
            <Board id="board-1" className="board partyA">
                {nfts?.result && nfts.result.map((nft, index) => {
                    nft = verifyMetadata(nft);
                    return(
                        <Card key={index} id={`card-${index}`} className="card" draggable="true" address={nft.token_address}>
                            <img id={`card-${index}`} src={nft?.image} alt="" />
                            <p>{nft.token_address}</p>
                        </Card>
                    )
                })}
            </Board>
            <img className="partyA-img" src="/partyAProposed-box.png" alt="" srcset="" />
        </div>
    )

}

export default PlayerASwap
