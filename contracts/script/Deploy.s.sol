// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/LaunchScoreRegistry.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        LaunchScoreRegistry registry = new LaunchScoreRegistry();
        console.log("LaunchScoreRegistry deployed at:", address(registry));
        vm.stopBroadcast();
    }
}
