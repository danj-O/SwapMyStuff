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



import { useMoralis, useMoralisQuery, useNFTBalances, useWeb3ExecuteFunction } from "react-moralis";
// import { useVerifyMetadata } from "hooks/useVerifyMetadata";


function FindSwap(){
    const { data: NFTBalances } = useNFTBalances();
    const { chainId } = useMoralis();
    const contractProcessor = useWeb3ExecuteFunction() //for executing sc funcs
    // const [visible, setVisibility] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    // const [aliceNFTs, setAliceNFTs] = useState({});
    const [searchFound, setSearchFound] = useState(false);
    // const [searchData, setSearchData] = useState();
    const [otherPlayerNFTs, setOtherPlayerNFTs] = useState();
    const [swapContract, setSwapContract] = useState();

    const { data, error, isLoading } = useMoralisQuery("bids"); //query event
    console.log(data,error,isLoading)

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
      };
    
      const handleOk = () => { //modal
        setIsModalVisible(false);
      };
    
      const handleCancel = () => { //modal
        setIsModalVisible(false);
      };

      const interactWithContract = async(NFTs) => {
        let options = {
            contractAddress: "???", //where we get this bad boy
            functionName: "bid",
            abi:[],
            params: {
                    NFTAddress: NFTs[0].address,
            },
            // msgValue: "?"
        }
        await contractProcessor.fetch({
            params: options
        })
      }
      const handleSwapClick = () => {
        let NFTsArr = getNFTsForSwap() //gets the current nfts in offering box
        console.log(NFTsArr) //is this all we need from bob?
          // send to contract
          interactWithContract(NFTsArr)
      }

      const handleBlockExplorerClick = () => {
          const blockURL = `${getExplorer(chainId)}address/${modalData.address}`
          console.log(blockURL)
          window.open(blockURL, "_blank")
      }

      const handleSearchClick = () => {
        const searchText = document.querySelector('#search-input').value //need to somehow query for this
        console.log("search clicked", searchText)

        //use data from moralis query to display alices nfts she wants to swap

        setSearchFound(true); //this will be conditional if a contract is found or not!!!!

        if(searchFound){ 
            setSwapContract(searchText) //save the contract
            console.log(swapContract)
        }
        setOtherPlayerNFTs({ //NEED THIS TO POPULATE OTHER PLAYERS NFTS UP FOR TRADE
            //get data from chain and save to state
        })
      }


    return(
        <div className="main-container">
            <div className="header-text">
                <h1>FIND SWAP</h1>
                <p>Here, you can search for a fren's existing contract to propose a swap with them!</p>
                <Input id="search-input" placeholder="ENTER CONTRACT ADDRES HERE TO SEE ONGOING SWAP" />
                <Button onClick={handleSearchClick}>FIND SWAP CONTRACT</Button>
            </div>
            {searchFound? 
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
                            {/* <Input placeholder="ENTER PARTY B ADRESS HERE" /> */}
                            {/* when this button is pressed, it should collect the nft data from inside partyA's(and B?) to send to contract  */}
                            <SwapButton onClick={handleSwapClick}>PROPOSE BID</SwapButton>
                        </div>

                        <div className="right-col-bottom">
                            {/* PLAYER B PROPOSED SWAP ITEM BOX */}
                            <PlayerBSwap otherPlayerNFTs={otherPlayerNFTs}/>
                        </div>

                    </div>
                </div>
                :
                // <h3>We could not find a contract with that address</h3>
                null
            }
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

export default FindSwap;
