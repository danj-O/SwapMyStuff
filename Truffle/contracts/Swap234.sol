//SwapMyStuff <> 123Swap / Swap123 <> Swap234
//Alice wants to swap her nft stuff with Bob
//123Swap, swap whatever, its easy and trustless*!
//*trustless meaning all of you help audit this code
//@fifestarr swap name voting contest (Bob and Alice Swap?)

// this was adapted from soliditylang.org simple auction
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.11;

// Necessary so that the swap contract can recieve ERC721 nfts?
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
// this is for some checking of the checks? @lilesper
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// basic access control and reassignable ownership for Alice, the deployer
import "@openzeppelin/contracts/access/Ownable.sol";

// do we want this to be ownable?
// do it break when adds is IERC721Receiver? yes
contract Swap234 is Ownable {
    // Parameters of the swap. Times are either
    // absolute unix timestamps (seconds since 1970-01-01)
    // or time periods in seconds.
    address payable public alice;
    address public alicesNFT;
    uint public ATokenID;
    uint public swapEndTime;

    // Current state of the auction.
    address public bob;
    address public bobsNFT;
    uint public bobsTokenID;
    uint public honeyPot; // value sent in with the NFT bid
        // Allow withdrawals of sweet sweet honey sweetener

    // number of swaps on this contract
    uint public swaps; 

     // this is a basket after the swap, allows "comments"
    struct basket {
        address bob; // it's this bobs basket
        bytes32 contentId;  // the IPFS metadata
        bytes32 nameId; // the string hashed
    }
    
    mapping (bytes32 => basket) basketRegistry;  // basket ids and baskets
    mapping (bytes32 => string) contentRegistry; // cID and url at IPFS?

    // Set to true at the end, disallows any change.
    // By default initialized to `false`.
    bool ended;

    // event when contract construction
    event isThisNecessary(uint swapEndTime);

    // Events that will be emitted on changes.
    event bobBidded(address indexed bidder, address indexed nft, uint BtokenID, uint honey);
    // emits the okayed swap values, when Alice approves bob for her NFT
    event aliceOKed(address bob, address indexed bobsNFT, uint bobsTokenID, uint indexed honeyPot, uint tokenID, address indexed alicesNFT);
    // not sure if i'm over complicating things
    event approved(address indexed whoApproved, string what, address forBob);
    // basket and content are the "review"
    event basketCreated (address bob, bytes32 indexed basketId, bytes32 contentId, bytes32 nameId);
    event ContentAdded (bytes32 indexed contentId, string contentUri);
    // when bobsBasketsCompleted the NFT to alice
    event bobsBasketCompleted(bytes32 name, string indexed emotions);

    // The following is a so-called natspec comment,
    // recognizable by the three slashes.
    // It will be shown when the user is asked to
    // confirm a transaction.

    /// 0
    /// When deployed, create a simple swap with
    /// `_swapTime` seconds of time as window for trade
    /// on behalf of deployer Alice's address `_alice`
    /// with Bob, the chosen and immutable trading partner
    constructor(
        uint _swapTime,
        address _alicesNFT,
        uint _tokenId,
        address payable _bob
    ) {
        alice = payable(msg.sender);
        alicesNFT = _alicesNFT;
        ATokenID = _tokenId;
        bob = _bob;
        swapEndTime = block.timestamp + _swapTime;
        // approves this contract to do what, exactly?
        // IERC721(alicesNFT).approve(bob, _tokenId);
        emit isThisNecessary(swapEndTime);
    }

    // Modifier to check that Bob the Bidder is indeed bob
    modifier onlyBob() {
        require(msg.sender == bob, "not bob. try again charlie!");
        // underscore tells solidity to execute the rest of the code.
        _;
    }

    /// Alice can adjust the swapEndTime because she is the BoSs.
    /// She sends in a new time in seconds to add more time to the swapClock.
    function aliceAdjustSwapEndTime(uint _swapTime) public {
        // probably want to write a modifier called onlyAlice later
        require(msg.sender == alice);
        ended = false;
        swapEndTime = block.timestamp + _swapTime;
    }

    /// 1
    /// Bob can bid on the swap with _NFT and
    /// the value sent together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    function bid(address _myNFT, uint _tokenID) public payable onlyBob {
        // could have an _onlyBob modifier. 
        // The keyword payable is required for function's
        // ablity to receive Ether.

        // Revert the call if the bidding
        // period is over.
        require(
            block.timestamp <= swapEndTime,
            "swapWindow has closed, ended, Bob."
        );

        // ? move this to the last and change to Assert ? 
        // this is the tricky part, an external call to check that 
        // msg.sender (bob) is the owner of the contract they send in
        // and maybe that the address is not 0, or is actually a contract/NFT?
        require(IERC721(_myNFT).ownerOf(_tokenID) == msg.sender);

            // Sending back the money by simply using
            // bob.send(highestBid) is a security risk
            // because it could execute an untrusted contract.
            // It is always safer to let the recipients
            // withdraw their money themselves.

        // changes to the state
        honeyPot = msg.value;
        bobsNFT = _myNFT;
        bobsTokenID = _tokenID;

        emit bobBidded(msg.sender, bobsNFT, bobsTokenID, msg.value);

        // maybe move that require ownerOf to down here because it's external contract call
    }

    /// Withdraw a the honey from the honeyPot.
    function withdrawHoney() public onlyOwner returns (bool) {
        uint amount = honeyPot;
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            honeyPot = 0;

            // how's this?
            if (!payable(msg.sender).send(amount)) {
                // No need to call throw here, just reset the amount owing
                honeyPot = amount;
                return false;
            }
        }
        return true;
    }

    /// 2
    /// Alice confirms the deal and gets her stuff
    function aliceSwapOK() public onlyOwner {
        // It is a good guideline to structure functions that interact
        // with other contracts (i.e. they call functions or send Ether)
        // into three phases:
        // 1. checking conditions
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call
        // back into the current contract and modify the state or cause
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contracts.

        // 1. Conditions
        // felt cute, might delete l8r
        // require(block.timestamp >= swapEndTime, "123swap not yet ended.");
        require(!ended, "aliceSwapOK has already been called. Try adjusting the swapTimer");

        // 2. Effects
        ended = true;
        swaps++; 
        
        emit aliceOKed(bob, bobsNFT, bobsTokenID, honeyPot, ATokenID, alicesNFT);

        // 3. Interaction
        // alice gets the money.
        alice.transfer(honeyPot);

        // approve this contract to transfer Alices NFT to Bob later.
        // IERC721(alicesNFT).approve(this, ATokenID);
        // not sure which one is right!
        // this is where the error is!
        IERC721(alicesNFT).approve(bob, ATokenID);

        emit approved(msg.sender, "IERC721(alicesNFT).Name()", bob); 
    }

    /// 3
    /// basketComplete is the final step in Swap234
    /// easily, onlyBob can call this on an ended swap
    /// expects a string of words and a hashed name
    function createBasket(string calldata _contentUri, bytes32 _nameId) external {
        require(bob == msg.sender, "onlyBob may createBasket");
        require(ended, "the contract isn't ended yet bob!");        
        // external contract call checking ownership, shift to end?
        require(IERC721(bobsNFT).ownerOf(bobsTokenID) == msg.sender, "bob, you don't own bobsNFT!");
        
        // writes the information about the basket on chain
        bytes32 _contentId = keccak256(abi.encode(_contentUri));
        // hashes the bob address and contentID
        bytes32 _basketId = keccak256(abi.encodePacked(bob, _contentId));
        contentRegistry[_contentId] = _contentUri;
        
        emit ContentAdded(_contentId, _contentUri); // these are how we fetch it in UI
        
        basketRegistry[_basketId].bob = msg.sender;
        basketRegistry[_basketId].contentId = _contentId;
        basketRegistry[_basketId].nameId = _nameId;
        
        // bob, basket, content, name
        emit basketCreated (bob, _basketId, _contentId,_nameId); 
        
        IERC721(bobsNFT).safeTransferFrom(msg.sender, alice, bobsTokenID);
        IERC721(alicesNFT).safeTransferFrom(alice, bob, ATokenID);

        emit bobsBasketCompleted(_nameId, "woohoo!");
    }

    // coding entirely during NFTHack over my birthday weekend, 2022.
    // thanks to my family, wingbirds, Danjo, Austin Griffith, Moralis*Avax frens, imnotArt, and most of all:
    // ** tippi fifestarr * worldwide web3.0 **
}