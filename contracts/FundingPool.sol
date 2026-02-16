// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ProjectRegistry} from "./ProjectRegistry.sol";

/**
 * @title FundingPool
 * @dev Manages staking and funding distribution for projects
 */
contract FundingPool is Ownable, ReentrancyGuard {
    IERC20 public token;
    ProjectRegistry public registry;
    
    // Staking data
    mapping(uint256 => mapping(address => uint256)) public stakes; // projectId => staker => amount
    mapping(uint256 => uint256) public totalStaked; // projectId => total amount
    mapping(address => uint256) public totalStakedByUser; // user => total staked across all projects
    
    // Funding pool
    uint256 public fundingPool;
    uint256 public constant TOP_PROJECTS = 3; // Top 3 projects get funded
    
    // Distribution tracking
    uint256 public lastDistributionTime;
    uint256 public constant DISTRIBUTION_INTERVAL = 7 days; // Weekly distribution
    
    // Events
    event Staked(
        address indexed staker,
        uint256 indexed projectId,
        uint256 amount,
        uint256 timestamp
    );
    
    event Unstaked(
        address indexed staker,
        uint256 indexed projectId,
        uint256 amount,
        uint256 timestamp
    );
    
    event FundsDistributed(
        uint256[] projectIds,
        uint256[] amounts,
        uint256 timestamp
    );
    
    event FundingPoolDeposit(
        address indexed depositor,
        uint256 amount,
        uint256 timestamp
    );
    
    constructor(address _token, address _registry) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token");
        require(_registry != address(0), "Invalid registry");
        
        token = IERC20(_token);
        registry = ProjectRegistry(_registry);
        lastDistributionTime = block.timestamp;
    }
    
    /**
     * @dev Deposit funds into the funding pool
     * @param _amount Amount to deposit
     */
    function depositToPool(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        fundingPool += _amount;
        
        emit FundingPoolDeposit(msg.sender, _amount, block.timestamp);
    }
    
    /**
     * @dev Stake tokens on a project
     * @param _projectId Project ID
     * @param _amount Amount to stake
     */
    function stakeOnProject(uint256 _projectId, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(_projectId < registry.projectCount(), "Invalid project");
        
        // Transfer tokens from staker
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        // Update stakes
        stakes[_projectId][msg.sender] += _amount;
        totalStaked[_projectId] += _amount;
        totalStakedByUser[msg.sender] += _amount;
        
        // Update registry
        registry.updateTotalStaked(_projectId, totalStaked[_projectId]);
        
        emit Staked(msg.sender, _projectId, _amount, block.timestamp);
    }
    
    /**
     * @dev Unstake tokens from a project
     * @param _projectId Project ID
     * @param _amount Amount to unstake
     */
    function unstake(uint256 _projectId, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(stakes[_projectId][msg.sender] >= _amount, "Insufficient stake");
        
        // Update stakes
        stakes[_projectId][msg.sender] -= _amount;
        totalStaked[_projectId] -= _amount;
        totalStakedByUser[msg.sender] -= _amount;
        
        // Update registry
        registry.updateTotalStaked(_projectId, totalStaked[_projectId]);
        
        // Return tokens
        require(token.transfer(msg.sender, _amount), "Transfer failed");
        
        emit Unstaked(msg.sender, _projectId, _amount, block.timestamp);
    }
    
    /**
     * @dev Calculate weighted score (AI score + community stake weight)
     * @param _projectId Project ID
     */
    function getWeightedScore(uint256 _projectId) public view returns (uint256) {
        ProjectRegistry.Project memory project = registry.getProject(_projectId);
        
        // Weighted score = AI score (70%) + Stake weight (30%)
        uint256 aiWeight = (project.aiScore * 70) / 100;
        
        // Normalize stake to 0-30 range (assuming max stake of 10000 tokens)
        uint256 stakeWeight = totalStaked[_projectId] > 10000 ether 
            ? 30 
            : (totalStaked[_projectId] * 30) / (10000 ether);
        
        return aiWeight + stakeWeight;
    }
    
    /**
     * @dev Get top projects by weighted score
     */
    function getTopProjects() public view returns (uint256[] memory, uint256[] memory) {
        uint256 projectCount = registry.projectCount();
        require(projectCount > 0, "No projects");
        
        // Create arrays for sorting
        uint256[] memory projectIds = new uint256[](projectCount);
        uint256[] memory scores = new uint256[](projectCount);
        
        // Get all scores
        for (uint256 i = 0; i < projectCount; i++) {
            projectIds[i] = i;
            scores[i] = getWeightedScore(i);
        }
        
        // Simple bubble sort (OK for small datasets in hackathon)
        for (uint256 i = 0; i < projectCount; i++) {
            for (uint256 j = i + 1; j < projectCount; j++) {
                if (scores[j] > scores[i]) {
                    // Swap scores
                    (scores[i], scores[j]) = (scores[j], scores[i]);
                    // Swap IDs
                    (projectIds[i], projectIds[j]) = (projectIds[j], projectIds[i]);
                }
            }
        }
        
        // Return top N
        uint256 topN = projectCount < TOP_PROJECTS ? projectCount : TOP_PROJECTS;
        uint256[] memory topIds = new uint256[](topN);
        uint256[] memory topScores = new uint256[](topN);
        
        for (uint256 i = 0; i < topN; i++) {
            topIds[i] = projectIds[i];
            topScores[i] = scores[i];
        }
        
        return (topIds, topScores);
    }
    
    /**
     * @dev Distribute funds to top projects
     */
    function distributeFunds() external nonReentrant {
        require(
            block.timestamp >= lastDistributionTime + DISTRIBUTION_INTERVAL,
            "Too early for distribution"
        );
        require(fundingPool > 0, "No funds to distribute");
        
        (uint256[] memory topIds, uint256[] memory topScores) = getTopProjects();
        require(topIds.length > 0, "No projects to fund");
        
        // Calculate total score for proportional distribution
        uint256 totalScore = 0;
        for (uint256 i = 0; i < topIds.length; i++) {
            totalScore += topScores[i];
        }
        
        require(totalScore > 0, "No valid scores");
        
        // Distribute proportionally
        uint256[] memory amounts = new uint256[](topIds.length);
        uint256 distributed = 0;
        
        for (uint256 i = 0; i < topIds.length; i++) {
            uint256 amount = (fundingPool * topScores[i]) / totalScore;
            amounts[i] = amount;
            distributed += amount;
            
            // Get project creator
            ProjectRegistry.Project memory project = registry.getProject(topIds[i]);
            
            // Transfer funds
            require(token.transfer(project.creator, amount), "Transfer failed");
            
            // Mark as funded
            registry.markAsFunded(topIds[i]);
        }
        
        // Update pool
        fundingPool -= distributed;
        lastDistributionTime = block.timestamp;
        
        emit FundsDistributed(topIds, amounts, block.timestamp);
    }
    
    /**
     * @dev Get user's stake in a project
     */
    function getUserStake(uint256 _projectId, address _user) external view returns (uint256) {
        return stakes[_projectId][_user];
    }
}
