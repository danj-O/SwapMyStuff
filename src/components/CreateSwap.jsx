//note on branch
import React, { useState } from "react";
import Inventory from "./Inventory"
import PlayerASwap from "./PlayerASwap";
import PlayerBSwap from "./PlayerBSwap";
import SwapButton from "./SwapButton";
// import Blokie from "components/Blockie"
import { Input, Modal, Button } from 'antd'
import { getExplorer } from "helpers/networks";
import {getNFTsForSwap} from 'helpers/DomHelpers'


import { useMoralis, useNFTBalances, useWeb3ExecuteFunction } from "react-moralis";
// import { useVerifyMetadata } from "hooks/useVerifyMetadata";


function CreateSwap(){ 
    const { data: NFTBalances } = useNFTBalances();
    const { Moralis, chainId } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction() //for executing sc funcs
    // const [visible, setVisibility] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    // const [aliceNFTs, setAliceNFTs] = useState({});
    const [isNoInputs, setIsNoInputs] = useState(); //has the user filled req fields?

    // const { verifyMetadata } = useVerifyMetadata();
    // console.log("NFTBalances", NFTBalances);

    const showModal = (el) => {
        setIsModalVisible(true);
        setModalData({
            address: el.dataset.address,
            token_id: el.dataset.token_id,
            image: el.dataset.image,
            symbol: el.dataset.symbol,
            token_uri: el.dataset.token_uri,
            attributes: el.dataset.attributes,
        })
        // console.log("swap show modal el", modalEl.address)
      };
    
      const handleOk = () => { //modal. should abs
        setIsModalVisible(false);
      };
    
      const handleCancel = () => { //modal. should abs
        setIsModalVisible(false);
      };

      const createSwapContract = async(NFTs, friendsAddress, swapTime) => {
        let options = {
					contractAddress: "???", //where we get this bad boy
					functionName: "the functionorino in solidityyy",
					abi:[],
					params: {
							bobsAddress: friendsAddress,
							NFTAddress: NFTs[0].address,
							swapTime: swapTime
					},
          // msgValue: "bobs 0x/nft address/swaptime?"
        }
        await contractProcessor.fetch({
            params: options
        })
      }
      const handleSwapClick = () => {
				const friendsAddress = document.querySelector('#friends-address').value
				const swapTime = document.querySelector('#swap-time').value

				if(!friendsAddress || !swapTime){
					console.log('no inputs!')
					setIsNoInputs(true)
					return
				} 
				setIsNoInputs(false)

				let NFTsArr = getNFTsForSwap() //gets the current nfts in offering box
				console.log(NFTsArr, friendsAddress, swapTime)

				createSwapContract(NFTsArr, friendsAddress, swapTime)
      }

      const handleBlockExplorerClick = () => {
				const blockURL = `${getExplorer(chainId)}address/${modalData.address}?a=${modalData.token_id}`
				console.log(blockURL)
				window.open(blockURL, "_blank")
      }


    return(
        <div className="main-container">
            <div className="header-text">
                <h1>CREATE SWAP</h1>
                {/* <Input placeholder="ENTER CONTRACT ADDRES HERE TO SEE ONGOING SWAP" />
                <Button>FIND SWAP CONTRACT</Button> */}
                <p>Here, you can create a new, reusable swapping contract to use with your frens.</p>
                <p>Add the NFTs/Tokens you wish to open for trading and send your friend the contract address we give you!</p>
                <p>Click an NFT in your inventory to see it's details. Drag the ones you want to swap into the "NFTs to swap"</p>
            </div>
            <div className="flexbox">
                <div className="left-column">
                    {/* INVENTORY */}
                    <Inventory data={NFTBalances} showModal={showModal}/>
                </div>

                <div className="right-column">
                    <div className="right-col-top">
                        {/* PLAYER A SWAP ITEM BOX */}
                        <PlayerASwap />
                    </div>

                    <div className="right-col-middle">
                        <Input id="friends-address" placeholder="ENTER YOUR FRIEND'S ADDRESS HERE" />
                        <Input id="swap-time" placeholder="ENTER THE AMOUNT OF TIME (in MS) YOU WANT THIS TRADE TO BE AVAILABLE" />
                        {/* when this button is pressed, it should collect the nft data from inside partyA's(and B?) to send to contract  */}
                        <SwapButton onClick={handleSwapClick}>CREATE A SWAP CONTRACT</SwapButton>
                    </div>
                    <div className="description">
                        {isNoInputs? 
                            <p>YOU NEED TO FILL IN THE FIELDS</p>
                            :
                            null
                        }
                        <p>This will create a digital connection (smart contract) between you and your friend. You will be able to reuse this contract if you want to trade again in the future :-) Think of it like add each other as friends!</p>
                    </div>

                </div>
            </div>
            <Modal title={modalData.symbol} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} className="nft-modal">
                <p>{modalData.symbol}</p>
                <p>Token ID: {modalData.token_id}</p>
                <p>Token Address:{modalData.address}</p>
                <p onClick={handleBlockExplorerClick}>*Block Explorer CLICK ME*</p>
                <p>Image URL: {modalData.image}</p>
                <p>Token URI: {modalData.token_uri}</p>
                <p>Attributes: {modalData.attributes}</p>
            </Modal>
        </div>
    )
}

export default CreateSwap;
