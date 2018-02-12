contract crowdFunding{
	
	struct Funder{

		address addr;
		uint amount;

	}

	struct Campaign{

		address beneficiary;
		string bname;  // name of beneficiary
		string description; // description of project 
		uint fundingGoal; 
		uint numFunders;
	   	uint amount;
	   	mapping (uint => Funder) funders; 

	}

	uint numCampaigns;

	function crowdFunding() public{

	
	

	}

	mapping (uint => Campaign ) campaigns;

	function set(uint x){

		numCampaigns=x;

	}

	function get() returns ( uint ){

		return numCampaigns;

	}


	function newCampaign(string bname, string description, uint goal) returns (uint campaignID){

		campaignID=numCampaigns++;     

		set(campaignID+1);  // set the number of campaigns

		Campaign c= campaigns[campaignID]; 

		c.beneficiary=msg.sender;   // whoever calls this function will be the beneficiary 
		c.bname=bname;
		c.description=description;
		c.fundingGoal=goal;



	}

	function numberOfCampaigns() public returns (uint numCampaigns){

		return numCampaigns;

	}


	function getCampaignBeneficiary(uint campaignID) view public returns ( string bname ){

		return campaigns[campaignID].bname;
	}

	function getCampaignProjectDescription(uint campaignID) view public returns (string description){

		return campaigns[campaignID].description;

	}

	function getCampaignFundingGoal(uint campaignID) view public returns (uint fundingGoal){

		return campaigns[campaignID].fundingGoal;

	}

	function getCampaignNumberOfFunders(uint campaignID) view public returns (uint numFunders){

		return campaigns[campaignID].numFunders;
	}

	function getCampaignAmountRaised(uint campaignID) view public returns (uint amount){

		return campaigns[campaignID].amount;

	}

	function contribute(uint campaignID) payable public returns (bool){

		Campaign c=campaigns[campaignID];
		Funder f=c.funders[c.numFunders++];  // mapping is somewhat different than hash table we can work assuming infinite keys
		if(c.amount<c.fundingGoal){    
	
			f.addr=msg.sender;    
			f.amount=msg.value;
			c.amount+=f.amount;
			return true;
		}

		return false;
	}

	function checkGoalReached(uint campaignID) returns (bool reached){

		Campaign c=campaigns[campaignID];

		if(c.amount<c.fundingGoal)
			return false;

		c.beneficiary.send(c.amount);
		c.amount=0;
		return true;

	}


}