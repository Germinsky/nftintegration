// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DailyVibesRewards
 * @notice Distributes PROPH tokens to users who listen to songs from digitalprophets.blog
 * @dev Users can claim rewards once per song after listening
 */
contract DailyVibesRewards is Ownable, ReentrancyGuard {
    IERC20 public immutable prophToken;
    uint256 public rewardAmount; // Amount of PROPH per claim
    
    // Track claims: user address => songId => claimed
    mapping(address => mapping(string => bool)) public hasClaimed;
    
    // Track total claims per song
    mapping(string => uint256) public songClaimCount;
    
    // Events
    event RewardClaimed(address indexed user, string songId, uint256 amount);
    event RewardAmountUpdated(uint256 newAmount);
    event TokensWithdrawn(address indexed to, uint256 amount);
    
    constructor(address _prophToken, uint256 _rewardAmount) Ownable(msg.sender) {
        require(_prophToken != address(0), "Invalid token address");
        prophToken = IERC20(_prophToken);
        rewardAmount = _rewardAmount;
    }
    
    /**
     * @notice Claim PROPH reward for listening to a song
     * @param songId Unique identifier for the song
     */
    function claimReward(string calldata songId) external nonReentrant {
        require(!hasClaimed[msg.sender][songId], "Already claimed for this song");
        require(bytes(songId).length > 0, "Invalid song ID");
        
        uint256 contractBalance = prophToken.balanceOf(address(this));
        require(contractBalance >= rewardAmount, "Insufficient contract balance");
        
        // Mark as claimed
        hasClaimed[msg.sender][songId] = true;
        songClaimCount[songId]++;
        
        // Transfer reward
        require(prophToken.transfer(msg.sender, rewardAmount), "Transfer failed");
        
        emit RewardClaimed(msg.sender, songId, rewardAmount);
    }
    
    /**
     * @notice Update the reward amount per claim
     * @param _newAmount New reward amount in PROPH tokens
     */
    function updateRewardAmount(uint256 _newAmount) external onlyOwner {
        rewardAmount = _newAmount;
        emit RewardAmountUpdated(_newAmount);
    }
    
    /**
     * @notice Withdraw PROPH tokens from contract
     * @param to Address to send tokens to
     * @param amount Amount of tokens to withdraw
     */
    function withdrawTokens(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        require(prophToken.transfer(to, amount), "Transfer failed");
        emit TokensWithdrawn(to, amount);
    }
    
    /**
     * @notice Get contract's PROPH balance
     */
    function getContractBalance() external view returns (uint256) {
        return prophToken.balanceOf(address(this));
    }
}
