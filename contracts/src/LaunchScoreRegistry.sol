// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title LaunchScoreRegistry
/// @notice Immutable pre-launch meme concept scores sealed on BSC.
///         No tokens, no fees beyond gas. Proof of conviction before launch.
contract LaunchScoreRegistry {
    struct ScoreRecord {
        bytes32 conceptHash; // keccak256(abi.encodePacked(name + description))
        uint8   score;       // 0-100
        address creator;     // msg.sender
        uint256 timestamp;   // block.timestamp
    }

    mapping(uint256 => ScoreRecord) public records;
    uint256 public recordCount;

    event ScoreSealed(
        uint256 indexed id,
        address indexed creator,
        uint8 score,
        bytes32 conceptHash
    );

    function sealScore(bytes32 conceptHash, uint8 score)
        external
        returns (uint256 id)
    {
        require(score <= 100, "Score exceeds 100");
        id = recordCount++;
        records[id] = ScoreRecord({
            conceptHash: conceptHash,
            score: score,
            creator: msg.sender,
            timestamp: block.timestamp
        });
        emit ScoreSealed(id, msg.sender, score, conceptHash);
    }

    function getRecord(uint256 id)
        external
        view
        returns (bytes32 conceptHash, uint8 score, address creator, uint256 timestamp)
    {
        ScoreRecord storage r = records[id];
        return (r.conceptHash, r.score, r.creator, r.timestamp);
    }
}
