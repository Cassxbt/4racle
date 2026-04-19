// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/LaunchScoreRegistry.sol";

contract LaunchScoreRegistryTest is Test {
    LaunchScoreRegistry registry;
    address creator = address(0xBEEF);

    function setUp() public {
        registry = new LaunchScoreRegistry();
    }

    function test_sealScore_returnsId() public {
        bytes32 hash = keccak256(abi.encodePacked("PepeAI", "A chill pepe"));
        vm.prank(creator);
        uint256 id = registry.sealScore(hash, 78);
        assertEq(id, 0);
        assertEq(registry.recordCount(), 1);
    }

    function test_sealScore_storesRecord() public {
        bytes32 hash = keccak256(abi.encodePacked("ChillCat", "Vibes only"));
        vm.prank(creator);
        uint256 id = registry.sealScore(hash, 90);
        (bytes32 storedHash, uint8 score, address storedCreator, ) = registry.getRecord(id);
        assertEq(storedHash, hash);
        assertEq(score, 90);
        assertEq(storedCreator, creator);
    }

    function test_sealScore_emitsEvent() public {
        bytes32 hash = keccak256(abi.encodePacked("MoonFrog", "Ribbit to the moon"));
        vm.prank(creator);
        vm.expectEmit(true, true, false, true);
        emit LaunchScoreRegistry.ScoreSealed(0, creator, 65, hash);
        registry.sealScore(hash, 65);
    }

    function test_sealScore_incrementsCount() public {
        vm.startPrank(creator);
        registry.sealScore(keccak256("a"), 50);
        registry.sealScore(keccak256("b"), 60);
        vm.stopPrank();
        assertEq(registry.recordCount(), 2);
    }

    function test_sealScore_rejectsScoreAbove100() public {
        vm.prank(creator);
        vm.expectRevert("Score exceeds 100");
        registry.sealScore(keccak256("bad"), 101);
    }
}
