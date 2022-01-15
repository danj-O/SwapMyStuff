import React, { useState } from "react";
import Inventory from "./Inventory"
import PlayerASwap from "./PlayerASwap";
import PlayerBSwap from "./PlayerBSwap"
// import Blokie from "components/Blockie"
import { Button, Input } from 'antd'

import { useMoralis, useNFTBalances } from "react-moralis";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";


function Swap(){
    const { data: NFTBalances } = useNFTBalances();
    const { Moralis, chainId } = useMoralis();
    const [visible, setVisibility] = useState(false);

    // const { verifyMetadata } = useVerifyMetadata();
    console.log("NFTBalances", NFTBalances);




    return(
        <div className="main-container">
            <div>
                <h1>The Swap You Needed</h1>
            </div>
            <div className="flexbox">
                <div className="left-column">
                    {/* INVENTORY */}
                    <Inventory data={NFTBalances}/>
                </div>

                <div className="right-column">
                    <div className="right-col-top">
                        {/* PLAYER A SWAP ITEM BOX */}
                        <PlayerASwap />
                    </div>

                    <div className="right-col-middle">
                        <Input placeholder="ENTER PARTY B ADRESS HERE" />
                        {/* when this button is pressed, it should collect the nft data from inside partyA's(and B?) to send to contract  */}
                        <button href="/nftBalance">SWAP</button>
                    </div>

                    <div className="right-col-bottom">
                        {/* PLAYER B PROPOSED SWAP ITEM BOX */}
                        <PlayerBSwap />
                    </div>


                    {/* <Board id="board-3" className="board">
                        <Card id="card-9" className="card" draggable="false">
                            <p>BYEEE</p>
                        </Card>
                    </Board> */}
                </div>
            </div>

        </div>
    )
}

export default Swap;
