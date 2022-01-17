//SwapMyStuff
//Alice wants to swap her nft stuff with Bob


// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// this allows SwapMyStuff
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

// do we want this to be ownable?
contract SwapMyStuff is IERC721Receiver {
    // Parameters of the swap. Times are either
    // absolute unix timestamps (seconds since 1970-01-01)
    // or time periods in seconds.
    address payable public alice;
    address public alicesNFT;
    uint public swapEndTime;

    // Current state of the auction.
    address public bob;
    address public bobsNFT;
    uint public honeyPot; // value sent in with the NFT bid
        // Allow withdrawals of sweet sweet honey sweetener

    // Set to true at the end, disallows any change.
    // By default initialized to `false`.
    bool ended;

    // Events that will be emitted on changes.
    event bobBidded(address bidder, address nft);
    // do we need to emit the tokenID too?
    event weSwapped(address winner, address bobsNFT, uint honeyPot, address alicesNFT);

    // The following is a so-called natspec comment,
    // recognizable by the three slashes.
    // It will be shown when the user is asked to
    // confirm a transaction.

    /// When deployed, create a simple swap with
    /// `_swapTime` seconds of time as window for trade
    /// on behalf of deployer Alice's address `_alice`
    /// with Bob, the chosen and immutable trading partner
    constructor(
        uint _swapTime,
        address _alicesNFT;
        address payable _bob
    ) {
        alice = msg.sender;
        alicesNFT = _alicesNFT;
        bob = _bob;
        swapEndTime = block.timestamp + _swapTime;
    }

    /// Alice can adjust the swapEndTime because she is the BoSs.
    /// She sends in a new time in seconds to add more time to the swapClock.
    function aliceAdjustSwapEndTime(uint _swapTime) public {
        // probably want to write a modifier called onlyAlice later
        require(msg.sender == alice);
        ended = false;
        swapEndTime = block.timestamp + _swapTime;
    }

    /// Bob can bid on the swap with _NFT and
    /// the value sent together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    function bid(address _myNFT, uint _tokenID) public payable {
        // could have an _onlyBob modifier. 
        // The keyword payable is required for function's
        // ablity to receive Ether.

        // Revert the call if the bidding
        // period is over.
        require(
            block.timestamp <= swapEndTime,
            "swapWindow has closed, ended, Bob."
        );

        // this is the tricky part, an external call to check that 
        // msg.sender (bob) is the owner of the contract they send in
        // and maybe that the address is not 0, or is actually a contract/NFT?
        require(_myNFT.ownerOf(_tokenID));

            // Sending back the money by simply using
            // bob.send(highestBid) is a security risk
            // because it could execute an untrusted contract.
            // It is always safer to let the recipients
            // withdraw their money themselves.

        bob = msg.sender;
        honeyPot = msg.value;
        emit bobBidded(msg.sender, msg.value);
    }

    /// Withdraw a the honey from the honeyPot.
    function withdraw() public returns (bool) {
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

    /// Alice confirms the deal and gets her stuff
    /// maybe also give bob?
    function aliceSwapOK() public {
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
        require(block.timestamp >= auctionEndTime, "Auction not yet ended.");
        require(!ended, "aliceSwapOK has already been called.");

        // 2. Effects
        ended = true;
        // do we also emit the tokenIDs?
        emit weSwapped(bob, bobsNFT, honeyPot, alicesNFT);

        // 3. Interaction
        // alice gets the money.
        alice.transfer(honeyPot);
        // this is the part where alice somehow transfers her nft ownership
        // to this contract which is a reciever, and then waits for the next
        // step, bob transfering his NFT in there?
    }
}