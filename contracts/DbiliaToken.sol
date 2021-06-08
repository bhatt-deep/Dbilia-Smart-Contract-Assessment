// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DbiliaToken is ERC721, Ownable {
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    //Declaring structure to easily map card
   struct Card {
        string cardId;
        uint256 edition;
    }

    //mapping tokenURI to minter address
    mapping(uint256 => address) private _tokenURItoMinter;

    //mapping tokenURI to card
    mapping(uint256 => Card) private _tokenURIToCard;

    //mapping tokenURI to userID
    mapping(uint256 => uint256) private _tokenURITOUserID;

    //mapping tokenID(uint) to tokenURI(string)
    mapping(uint256 => string) private _tokenURIs;

    //Event triggered when new Token is minted
    event NewDbiliaTokenMinted(
        address mintedBy,
        string cardId,
        uint256 edition,
        uint256 tokenURI
    );

    // Function to mint tokens only by owner
    function mintWithUSD(
        uint256 _userId,
        string memory _cardId,
        uint256 _edition,
        uint256 _tokenURI
    ) public onlyOwner {
        require(_tokenURItoMinter[_tokenURI] == address(0), "Card already minted");  
        _safeMint(owner(), _tokenURI);
        _tokenURIToCard[_tokenURI].cardId = _cardId;
        _tokenURIToCard[_tokenURI].edition = _edition;
        _tokenURITOUserID[_tokenURI] = _userId;
        _tokenURItoMinter[_tokenURI] = owner();
        _setTokenURI(_tokenURI, _cardId);
        emit NewDbiliaTokenMinted(owner(), _cardId, _edition, _tokenURI);
    }

    //function to mint tokens by users with ETH
    function mintWithETH(
        string memory _cardId,
        uint256 _edition,
        uint256 _tokenURI
    ) public payable {
        require(_tokenURItoMinter[_tokenURI] == address(0), "Card already minted"); 
        require(msg.value >= 0, "Insufficient ETH transaction fee"); 
        _safeMint(owner(), _tokenURI);
        _tokenURIToCard[_tokenURI].cardId = _cardId;
        _tokenURIToCard[_tokenURI].edition = _edition;
        _tokenURItoMinter[_tokenURI] = msg.sender;
        _setTokenURI(_tokenURI, _cardId); // As we reuire to set another field as string and cardID is the string one I have used it
        emit NewDbiliaTokenMinted(msg.sender, _cardId, _edition, _tokenURI);
    }

     /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }



}
