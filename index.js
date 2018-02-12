web3=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi=JSON.parse('[{"constant":false,"inputs":[],"name":"numberOfCampaigns","outputs":[{"name":"numCampaigns","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"getCampaignProjectDescription","outputs":[{"name":"description","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"checkGoalReached","outputs":[{"name":"reached","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bname","type":"string"},{"name":"description","type":"string"},{"name":"goal","type":"uint256"}],"name":"newCampaign","outputs":[{"name":"campaignID","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"contribute","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"getCampaignFundingGoal","outputs":[{"name":"fundingGoal","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"getCampaignBeneficiary","outputs":[{"name":"bname","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"getCampaignNumberOfFunders","outputs":[{"name":"numFunders","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"campaignID","type":"uint256"}],"name":"getCampaignAmountRaised","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');
cfContract=web3.eth.contract(abi);
contractInstance=cfContract.at('0xce41a99b26737096f6c41c6302c670b37beff5a2');

// I want the above 4 lines to execute as early as possible so I am not putting them in $(document).ready function, 

$(document).ready(function(){


	 populateCampaignTable();  // As soon as page ( HTML, Bootstrap etc,), load the campaigns on the front page
   	

});
  

function newCampaign(){

	let bname=$('#bname').val();
	let pdesc=$('#pdesc').val();
	let fgoal=$('#fgoal').val();

	

	fgoal=Number(web3.toWei(fgoal,'ether')) // Taking input from user in ether and then converting to Wei because solidity does not support float

	

	$("#msg").html("Your campaign has been submitted. Please wait while it is being recorded on the blockchain");

	$('#bname').val("");
	$('#pdesc').val("");
	$('#fgoal').val("");

	contractInstance.newCampaign(bname,pdesc,fgoal,{gas:1400000,from:web3.eth.accounts[4]},function(){

		populateCampaignTable();   // First this populateCampaignTable will be called and then $("#msg").html("")
		$("#msg").html("");


	});

}

function populateCampaignTable(){

	let nrows=contractInstance.get.call().toNumber();  // number of campaigns 

	$("#campaign-rows").html("");


	for(let i=0;i<nrows;++i){ // i is campaignID

		let str="<tr>";

		let campaignID=i.toString(); 
		let bname=contractInstance.getCampaignBeneficiary.call(i);    // beneficiary name
		let pdesc=contractInstance.getCampaignProjectDescription.call(i);  // project description
		let fgoal=web3.fromWei(contractInstance.getCampaignFundingGoal.call(i).toNumber(),'ether').toString();  // converting from Wei to ether for easy display on page
		let numFunders=contractInstance.getCampaignNumberOfFunders.call(i).toNumber().toString();  // number of people who have funded this project till now
 		let amount=web3.fromWei(contractInstance.getCampaignAmountRaised.call(i).toNumber(),'ether').toString();     // Amount collected till now

		str+="<th>"+campaignID+"</th>";
		str+="<th>"+bname+"</th>";
		str+="<th>"+pdesc+"</th>";
		str+="<th>"+fgoal+"</th>";
		str+="<th>"+numFunders+"</th>";
		str+="<th>"+amount+"</th>";
		str+="</tr>";
		$("#campaign-rows").append(str);
	}	
}

function contribute(){

	let campaignID=$("#campaign").val();
	let amount=$("#amount").val();

	$("#msg").html("Your contribution has been submitted. Please wait while it is being recorded on the blockchain");

	amount=Number(web3.toWei(amount,'ether')); // take input from user in ether and convert it to Wei


	contractInstance.contribute(campaignID,{from:web3.eth.accounts[6],gas:5000000,value:amount},function(){

		populateCampaignTable();
		$("#msg").html("");

	});

	// For now, every contributor will send value from same account, because i want to make a simple working app

	$('#campaign').val("");
   	$('#amount').val("");


}








