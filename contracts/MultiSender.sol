// SPDX-License-Identifier: MIT 
pragma solidity 0.8.2;

interface IERC20 {
       function transferFrom(
        address sender, address recipient, uint256 amount
    ) external returns (bool);
}
interface IERC721 {
    function safeTransferFrom(
        address from, address to, uint256 tokenId
    ) external;
}
interface IERC1155 {
        function safeTransferFrom(
        address from, address to, uint256 id,
        uint256 amount,  bytes calldata data
    ) external;
}

contract MultiSender {
    
    function transferERC20(address _tokenAddress, address[] memory _recipients, uint[] memory _amounts) public {
        require(_recipients.length == _amounts.length, "number of recipients and amounts should be same");
        for(uint i=0; i<_recipients.length; i++) {
            IERC20(_tokenAddress).transferFrom(msg.sender, _recipients[i], _amounts[i]);
        }
    }
    
    function transferERC721(address _tokenAddress, address[] memory _recipients, uint[] memory _tokenIds) public {
        require(_recipients.length == _tokenIds.length, "number of recipients and tokenIds should be same");
        for(uint i=0; i<_recipients.length; i++) {
            IERC721(_tokenAddress).safeTransferFrom(msg.sender, _recipients[i], _tokenIds[i]);
        }
    }
    
    bytes defaultData0;
    function transferERC1155(address _tokenAddress, address[] memory _recipients, uint[] memory _tokenIds, uint[] memory _amounts) public {
        require(_recipients.length == _tokenIds.length, "number of recipients and tokenIds should be same");
        require(_recipients.length == _amounts.length, "number of recipients and amounts should be same");
        for(uint i=0; i<_recipients.length; i++) {
            IERC1155(_tokenAddress).safeTransferFrom(msg.sender, _recipients[i], _tokenIds[i], _amounts[i], defaultData0);
        }
    }
}