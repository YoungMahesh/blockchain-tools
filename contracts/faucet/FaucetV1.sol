// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract FaucetV1 {
    address public manager;
    address public erc20Address;
    string public erc20Name;
    string public erc20Symbol;
    uint public erc20Decimals;

    constructor() {
        manager = msg.sender;
    }

    modifier onlyManager {
        require(msg.sender == manager, "Only Manager can execute the function");
        _;
    }

    function changeManager(address _newManager) external onlyManager {
        manager = _newManager;
    }

    function changeErc20Data(address _erc20Address, string memory _erc20Name, string memory _erc20Symbol, uint _erc20Decimals) external onlyManager {
        erc20Address = _erc20Address;
        erc20Name = _erc20Name;
        erc20Symbol = _erc20Symbol;
        erc20Decimals = _erc20Decimals;
    }

    function get1000Erc20Tokens() external {
        IERC20(erc20Address).transfer(msg.sender, 1000 * 10 ** erc20Decimals);
    }

    function getErc20Balance() external view returns(uint) {
        return IERC20(erc20Address).balanceOf(address(this));
    }
}