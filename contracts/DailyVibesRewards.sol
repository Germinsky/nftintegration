// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DailyVibesRewards
 * @dev Rewards contract for Daily Vibes music listening platform
 * Users earn PROPH tokens for listening to songs
 */
contract DailyVibesRewards is Ownable, ReentrancyGuard {
    IERC20 public prophToken;
    uint256 public rewardAmount = 10 * 10**18; // 10 PROPH tokens per song
    
    // Mapping: user address => song ID => has claimed
    mapping(address => mapping(string => bool)) public hasClaimed;
    
    // Mapping: user address => total songs listened
    mapping(address => uint256) public userListenCount;
    
    // Array of all songs that have been claimed
    string[] public songs;
    
    // Events
    event RewardClaimed(address indexed user, string songId, uint256 amount);
    event RewardAmountUpdated(uint256 oldAmount, uint256 newAmount);
    event TokensWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _prophToken) {
        prophToken = IERC20(_prophToken);
    }
    
    /**
     * @dev Claim reward for listening to a song
     * @param songId Unique identifier for the song
     */
    function claimReward(string calldata songId) external nonReentrant {
        require(bytes(songId).length > 0, "Song ID cannot be empty");
        require(!hasClaimed[msg.sender][songId], "Reward already claimed for this song");
        require(prophToken.balanceOf(address(this)) >= rewardAmount, "Insufficient contract balance");
        
        // Mark as claimed
        hasClaimed[msg.sender][songId] = true;
        userListenCount[msg.sender]++;
        songs.push(songId);
        
        // Transfer reward
        require(prophToken.transfer(msg.sender, rewardAmount), "Token transfer failed");
        
        emit RewardClaimed(msg.sender, songId, rewardAmount);
    }
    
    /**
     * @dev Check if user has claimed reward for a specific song
     * @param user User address
     * @param songId Song identifier
     * @return bool True if already claimed
     */
    function hasClaimedSong(address user, string calldata songId) external view returns (bool) {
        return hasClaimed[user][songId];
    }
    
    /**
     * @dev Get total number of songs a user has listened to
     * @param user User address
     * @return uint256 Number of songs
     */
    function getUserListenCount(address user) external view returns (uint256) {
        return userListenCount[user];
    }
    
    /**
     * @dev Update reward amount (only owner)
     * @param newAmount New reward amount in wei
     */
    function setRewardAmount(uint256 newAmount) external onlyOwner {
        require(newAmount > 0, "Reward amount must be greater than 0");
        uint256 oldAmount = rewardAmount;
        rewardAmount = newAmount;
        emit RewardAmountUpdated(oldAmount, newAmount);
    }
    
    /**
     * @dev Withdraw tokens from contract (only owner)
     * @param amount Amount to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(prophToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(prophToken.transfer(owner(), amount), "Transfer failed");
        emit TokensWithdrawn(owner(), amount);
    }
    
    /**
     * @dev Get contract token balance
     * @return uint256 Current balance
     */
    function getContractBalance() external view returns (uint256) {
        return prophToken.balanceOf(address(this));
    }
    
    /**
     * @dev Get total unique songs claimed across all users
     * @return uint256 Total songs count
     */
    function getTotalSongsClaimed() external view returns (uint256) {
        return songs.length;
    }
}
