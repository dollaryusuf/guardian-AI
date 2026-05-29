// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GuardianInsurance
 * @dev Settles machine-triggered decentralized dashboard insurance claims on IoTeX.
 * Integrates storage proofs from ZeroGravity (0G) and accident evaluations from 0G Serving.
 */
contract GuardianInsurance {
    
    enum IncidentStatus { REPORTED, VERIFIED_PAYOUT, EXONERATED_DENIED, IN_REVIEW }

    struct Machine {
        string ioID;            // IoTeX Machine identity
        address owner;          // Wallet address of driver/owner
        uint256 premiumPaid;   // Insured pool balances
        uint256 coverageLimit; // Maximum stablecoin payout on accident
        bool isActive;          // Device status
    }

    struct Incident {
        uint256 id;
        address machineAddress;
        string videoCID;       // 0G Storage content ID containing 4K footage
        string telemetryCID;   // W3bstream monitored raw telemetry logs
        string faultVerdict;   // 0G AI Serving accident attribution summary
        IncidentStatus status;
        uint256 timestamp;
        uint256 payoutDistributed;
    }

    address public oracleNode;  // Authorized 0G Inference & W3bstream oracle proxy
    address public contractOwner;
    uint256 public totalIncidents;
    uint256 public totalPayoutsClaimed;

    mapping(address => Machine) public machines;
    mapping(uint256 => Incident) public incidents;
    mapping(string => bool) public reportedCIDs; // Prevent reporting duplicate video proofs

    // Events
    event MachineRegistered(address indexed machineAddress, string ioID, address indexed owner, uint256 coverageLimit);
    event IncidentReported(uint256 indexed incidentID, address indexed machineAddress, string videoCID);
    event ClaimSettled(uint256 indexed incidentID, address indexed receiver, string faultVerdict, uint256 payoutAmt);
    event ClaimDenied(uint256 indexed incidentID, string reason);
    event PoolFunded(address indexed sender, uint256 amount);

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Only Contract Owner can execute");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleNode, "Only Authorized Oracle Node can verify");
        _;
    }

    constructor(address _oracleNode) payable {
        contractOwner = msg.sender;
        oracleNode = _oracleNode;
    }

    /**
     * @notice Registers a new micro-DePIN dashcam to the Guardian AI network inside IoTeX ecosystems.
     * @param _machineAddress The public wallet of the Dashcam security element.
     * @param _ioID Generated IoTeX Machine id (ioID).
     * @param _coverageLimit Designated settlement allocation limit.
     */
    function registerMachine(
        address _machineAddress,
        string calldata _ioID,
        uint256 _coverageLimit
    ) external onlyContractOwner {
        require(machines[_machineAddress].isActive == false, "Machine already registered");
        require(_coverageLimit > 0, "Coverage limit must exceed 0");

        machines[_machineAddress] = Machine({
            ioID: _ioID,
            owner: msg.sender,
            premiumPaid: 0,
            coverageLimit: _coverageLimit,
            isActive: true
        });

        emit MachineRegistered(_machineAddress, _ioID, msg.sender, _coverageLimit);
    }

    /**
     * @notice Funds the underlying insurance pool with native/stable liquidity tokens.
     */
    function fundInsurancePool() external payable {
        require(msg.value > 0, "Must send premium funds to the pool");
        emit PoolFunded(msg.sender, msg.value);
    }

    /**
     * @notice Reports a triggered crash event from W3bstream telemetry.
     * @param _machineAddress Registered machine account that triggered high G-Force.
     * @param _videoCID The direct content ID of video stored in ZeroGravity Storage.
     * @param _telemetryCID Storage ID of telemetry file.
     */
    function reportIncident(
        address _machineAddress,
        string calldata _videoCID,
        string calldata _telemetryCID
    ) external returns (uint256) {
        require(machines[_machineAddress].isActive, "Source machine must be active and registered");
        require(!reportedCIDs[_videoCID], "Evidence footage already submitted for review");

        totalIncidents++;
        incidents[totalIncidents] = Incident({
            id: totalIncidents,
            machineAddress: _machineAddress,
            videoCID: _videoCID,
            telemetryCID: _telemetryCID,
            faultVerdict: "",
            status: IncidentStatus.REPORTED,
            timestamp: block.timestamp,
            payoutDistributed: 0
        });

        reportedCIDs[_videoCID] = true;

        emit IncidentReported(totalIncidents, _machineAddress, _videoCID);
        return totalIncidents;
    }

    /**
     * @notice Oracle triggers instant settlement check upon receiving AI evaluations from 0G Serving nodes.
     * @param _incidentID Registered ID of incident.
     * @param _faultVerdict Legal fault attribution evaluated by 0G decentralized inference (e.g. "Not At Fault", "At Fault").
     */
    function verifyAndPay(
        uint256 _incidentID,
        string calldata _faultVerdict
    ) external onlyOracle {
        Incident storage incident = incidents[_incidentID];
        require(incident.status == IncidentStatus.REPORTED, "Incident is already processed");
        
        Machine storage machineClient = machines[incident.machineAddress];
        require(machineClient.isActive, "Registered machine details invalid");

        incident.faultVerdict = _faultVerdict;

        // Verify fault attribution
        // If driver matches the 0G evaluation "Not At Fault", trigger the instant payout settlement from pool.
        if (compareStrings(_faultVerdict, "Not At Fault") || compareStrings(_faultVerdict, "Exonerated")) {
            uint256 payoutAmount = machineClient.coverageLimit;
            
            // Safety check against smart contract balance
            if (address(this).balance >= payoutAmount) {
                incident.status = IncidentStatus.VERIFIED_PAYOUT;
                incident.payoutDistributed = payoutAmount;
                totalPayoutsClaimed += payoutAmount;
                
                // Disburse instant payout to driver owner wallet
                payable(machineClient.owner).transfer(payoutAmount);
                emit ClaimSettled(_incidentID, machineClient.owner, _faultVerdict, payoutAmount);
            } else {
                incident.status = IncidentStatus.IN_REVIEW; // Insufficient liquid contract pool funds
                emit ClaimDenied(_incidentID, "Liquidity Pool Insufficient");
            }
        } else {
            // Evaluated as partially or entirely at fault, claim is denied/reduced.
            incident.status = IncidentStatus.EXONERATED_DENIED;
            emit ClaimDenied(_incidentID, string(abi.encodePacked("Inference engine parsed driver At Fault: ", _faultVerdict)));
        }
    }

    /**
     * @dev Simple string comparison utility.
     */
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    /**
     * @notice Allows updating oracle key for decentralized consensus.
     */
    function updateOracle(address _newOracle) external onlyContractOwner {
        oracleNode = _newOracle;
    }

    /**
     * @notice Get contract liquid reserves.
     */
    function getPoolBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
