//0xaB68E81E78DCc169188991F08957cFB765d9C7a9
//NFT STORAGE API KEY : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE0ZTY5ZEMxYmFhMjUzMDQ3YjE2OWM2NTQ5MzRFYjhlNTk0MTBjMzUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NDA3MTU2NjIyMiwibmFtZSI6Ik5GVCBNYXJrZXRwbGFjZSJ9.dWO8MsVzHhEDpbyg6a34HIMFWvPu5WwyIKCOivEwpf0


//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarket is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("NFT Marketplace","NFTM"){}
    struct NFTListing{
        uint price;
        address seller;
    }
    mapping(uint => NFTListing) private _listings;
    mapping(uint => uint) private _royalties;
    event NFTTransfer(uint tokenId, address from, address to, string tokenURI, uint price);

    //Minting NFTs
    function mintNFT(string calldata _tokenURI, uint royaltyPercentage) public{
            _tokenIds.increment();
            uint tokenIds = _tokenIds.current();
            _safeMint(msg.sender, tokenIds);
            _setTokenURI(tokenIds, _tokenURI);
            _royalties[tokenIds] = royaltyPercentage;
            emit NFTTransfer(tokenIds, address(0), msg.sender, _tokenURI, 0);
    }

    //Listing NFTs
    function listNFT(uint tokenId, uint price) public {
            require(price > 0, "Price must be greater than 0");
            approve(address(this), tokenId);
            transferFrom(msg.sender, address(this), tokenId);
            _listings[tokenId] = NFTListing(price,msg.sender);
            emit NFTTransfer(tokenId, msg.sender, address(this), '', price);
    }

    //Buying NFTs
    function buyNFT(uint tokenId) public payable{
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, "NFT not listed for sale.");
        require(msg.value == listing.price, "Incorrect Value");
        address creator = ownerOf(tokenId);
        uint royaltyAmount = (listing.price * _royalties[tokenId]) / 100 ;
        uint remainingAmount = listing.price - royaltyAmount;

        transferFrom(address(this), msg.sender, tokenId);
        payable(creator).transfer(royaltyAmount);
        payable(listing.seller).transfer(remainingAmount);
        clearListing(tokenId);
        emit NFTTransfer(tokenId, msg.sender, msg.sender, '', 0);
    }

    //Cancel Listing
    function cancelListing(uint tokenId) public{
        NFTListing memory listing = _listings[tokenId];
        require(listing.price > 0, "NFT not listed for sale.");
        require(listing.seller == msg.sender, "You're not the owner");
        transferFrom(address(this), msg.sender, tokenId);
        clearListing(tokenId);
        emit NFTTransfer(tokenId, address(this), msg.sender, '', 0);
    }

    function clearListing(uint tokenId) private{
        _listings[tokenId].price = 0;
        _listings[tokenId].seller = address(0);
    }
} 