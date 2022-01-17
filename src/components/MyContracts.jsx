//note on branch
import React, { useState } from "react";
import Inventory from "./Inventory"
// import PlayerASwap from "./PlayerASwap";
// import PlayerBSwap from "./PlayerBSwap";
// import SwapButton from "./SwapButton";
// import Blokie from "components/Blockie"
import { Modal } from 'antd'
import { getExplorer } from "helpers/networks";


import { useMoralis, useNFTBalances } from "react-moralis";
// import { useVerifyMetadata } from "hooks/useVerifyMetadata";


function MyContracts(){
    const { data: NFTBalances } = useNFTBalances();
  const { chainId } = useMoralis();
    // const { Moralis, chainId } = useMoralis();
    // const [visible, setVisibility] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});
    // const { verifyMetadata } = useVerifyMetadata();
    console.log("NFTBalances", NFTBalances);

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
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const handleBlockExplorerClick = () => {
          const blockURL = `${getExplorer(chainId)}address/${modalData.address}?a=${modalData.token_id}`
          console.log(blockURL)
          window.open(blockURL, "_blank")
      }


    return(
        <div className="main-container">
            <div className="header-text">
                <h1>MY OPEN CONTRACTS</h1>
                {/* <Input placeholder="ENTER CONTRACT ADDRES HERE TO SEE ONGOING SWAP" />
                <Button>FIND SWAP CONTRACT</Button> */}
            </div>
            <div className="flexbox">
                <div className="left-column">
                    {/* INVENTORY */}
                    <Inventory data={NFTBalances} showModal={showModal}/>
                </div>

                <div className="right-column">
                    <div className="my-contracts-box">
                        <ul>
                            <li>jkfhgvk</li>
                            <li>vcxvbv</li>
                            <li>bcvbcvb</li>
                            <li>bcvbcvb</li>
                            <li>bcvbccbc</li>
                        </ul>
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

export default MyContracts;
