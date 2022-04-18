// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);
}

contract FaucetFactory {
    struct Faucet {
        uint256 amtPerRequest;
    }

    mapping(address => Faucet) public FaucetTable;

    function createFaucent(
        address _erc20Addr,
        uint256 _depositAmt,
        uint256 _giveAmtPerRequest
    ) external {
        IERC20(_erc20Addr).transferFrom(msg.sender, address(this), _depositAmt);
        FaucetTable[_erc20Addr].amtPerRequest = _giveAmtPerRequest;
    }

    function claimTokens(address _erc20Addr) external {
        IERC20(_erc20Addr).transfer(msg.sender, FaucetTable[_erc20Addr].amtPerRequest);
    }
}
