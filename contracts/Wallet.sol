//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Wallet {
    mapping(address => uint) Wallets;
    
    function transfertMoney(address payable _to,uint _money) external {
        require(_money <= Wallets[msg.sender],"Fond a disposition insuffisant pour ce tranfert");
        Wallets[msg.sender] -= _money;
        _to.transfer(_money);
    }

    function getBalance() external view returns(uint){
        return Wallets[msg.sender];
    }

    receive() external payable {
        Wallets[msg.sender] += msg.value;
    }

    fallback() external payable{

    }

}
