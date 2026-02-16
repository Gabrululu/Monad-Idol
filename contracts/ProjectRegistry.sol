// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProjectRegistry
 * @dev Registry for AI agent projects with AI scoring
 */
contract ProjectRegistry is Ownable {
    struct Project {
        uint256 id;
        address creator;
        string name;
        string description;
        string githubUrl;
        string metadataURI;
        uint256 aiScore; // 0-100
        uint256 totalStaked;
        uint256 createdAt;
        bool funded;
        bool active;
    }
    
    // State variables
    uint256 public projectCount;
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public creatorProjects;
    
    // AI agent address (authorized to update scores)
    address public aiAgent;
    
    // Events
    event ProjectSubmitted(
        uint256 indexed projectId,
        address indexed creator,
        string name,
        uint256 timestamp
    );
    
    event ProjectScored(
        uint256 indexed projectId,
        uint256 score,
        uint256 timestamp
    );
    
    event ProjectFunded(
        uint256 indexed projectId,
        uint256 timestamp
    );
    
    constructor() Ownable(msg.sender) {
        aiAgent = msg.sender; // Initially owner is AI agent
    }
    
    /**
     * @dev Set AI agent address
     * @param _aiAgent New AI agent address
     */
    function setAiAgent(address _aiAgent) external onlyOwner {
        require(_aiAgent != address(0), "Invalid address");
        aiAgent = _aiAgent;
    }
    
    /**
     * @dev Submit a new project
     * @param _name Project name
     * @param _description Project description
     * @param _githubUrl GitHub repository URL
     * @param _metadataUri IPFS or JSON metadata URI
     */
    function submitProject(
        string memory _name,
        string memory _description,
        string memory _githubUrl,
        string memory _metadataUri
    ) external returns (uint256) {
        require(bytes(_name).length > 0, "Name required");
        require(bytes(_description).length > 0, "Description required");
        
        uint256 projectId = projectCount++;
        
        projects[projectId] = Project({
            id: projectId,
            creator: msg.sender,
            name: _name,
            description: _description,
            githubUrl: _githubUrl,
            metadataURI: _metadataUri,
            aiScore: 0,
            totalStaked: 0,
            createdAt: block.timestamp,
            funded: false,
            active: true
        });
        
        creatorProjects[msg.sender].push(projectId);
        
        emit ProjectSubmitted(projectId, msg.sender, _name, block.timestamp);
        
        return projectId;
    }
    
    /**
     * @dev Update AI score for a project (only AI agent)
     * @param _projectId Project ID
     * @param _score Score (0-100)
     */
    function updateAiScore(uint256 _projectId, uint256 _score) external {
        require(msg.sender == aiAgent, "Only AI agent");
        require(_projectId < projectCount, "Invalid project");
        require(_score <= 100, "Score must be 0-100");
        require(projects[_projectId].active, "Project inactive");
        
        projects[_projectId].aiScore = _score;
        
        emit ProjectScored(_projectId, _score, block.timestamp);
    }
    
    /**
     * @dev Update total staked amount (called by FundingPool)
     * @param _projectId Project ID
     * @param _amount New total staked amount
     */
    function updateTotalStaked(uint256 _projectId, uint256 _amount) external {
        require(_projectId < projectCount, "Invalid project");
        projects[_projectId].totalStaked = _amount;
    }
    
    /**
     * @dev Mark project as funded
     * @param _projectId Project ID
     */
    function markAsFunded(uint256 _projectId) external {
        require(_projectId < projectCount, "Invalid project");
        projects[_projectId].funded = true;
        
        emit ProjectFunded(_projectId, block.timestamp);
    }
    
    /**
     * @dev Get project details
     * @param _projectId Project ID
     */
    function getProject(uint256 _projectId) external view returns (Project memory) {
        require(_projectId < projectCount, "Invalid project");
        return projects[_projectId];
    }
    
    /**
     * @dev Get projects by creator
     * @param _creator Creator address
     */
    function getProjectsByCreator(address _creator) external view returns (uint256[] memory) {
        return creatorProjects[_creator];
    }
    
    /**
     * @dev Get all active projects
     */
    function getAllProjects() external view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](projectCount);
        for (uint256 i = 0; i < projectCount; i++) {
            allProjects[i] = projects[i];
        }
        return allProjects;
    }
}
