var ethers = require('ethers');
var Web3 = require("web3");
var web3 = new Web3();
var keythereum = require("keythereum");
var Tx = require('ethereumjs-tx');
const clipboardy = require('clipboardy');
var fs = require('fs');
const {shell} = require('electron')
var providers = ethers.providers;
var Wallet = ethers.Wallet;
const request = require('request');

var myWallet;

var tokenBalance = 0;
var ethBalance = 0;

var pubAddress = "";

//This connects to the main net
//var provider = new providers.EtherscanProvider(false);

//Using web3 to connect to rinkeby network
//var provider = new web3.providers.HttpProvider('https://rinkeby.infura.io/v3/e1ec5a5cf4dc4a75a9a0b4cdd6a9234f');
web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/e1ec5a5cf4dc4a75a9a0b4cdd6a9234f"));
var provider = new ethers.providers.InfuraProvider('rinkeby'); //connecting to rinkeby network via infura

var tokenContract;
var TOKEN_ADDRESS = '0x2bdf756105c1a2f0a34001910e2895349fad8b0a'
const TOKEN_ABI = [ { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256" }, { "name": "tokenName", "type": "string" }, { "name": "tokenSymbol", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Burn", "type": "event" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]

tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);


function EnterKey() //Check if submit button is pressed if yes run checkSubmit()
{
  if(event.keyCode == 13){ //JS keyCode 13 = Enter button
    OpenPrivateKey();
  }

}

//Generate wallet
function genWallet(){

  $("#generateWal").css('visibility', 'hidden');
  $("#textGen").css('visibility', 'hidden');

  //Create an account
  var genWall = (web3.eth.accounts.create());

  //Get only the public and private key
  var genPublic = genWall.address;
  var genPrivate = genWall.privateKey;

  console.log(genPublic);
  console.log(genPrivate);

  $("#genResult").css('visibility', 'visible');
  document.getElementById("genPub").innerHTML = genPublic;
  document.getElementById("genPri").innerHTML= genPrivate;

}

//Get UID for admin
function getUID(){

  //firebase already imported from renderer.js
  var user = firebase.auth().currentUser;
  var uid = user.uid; //get the UID from the current user
  console.log(uid);
  //Please replace and use your firebase UID for this
  if(uid === "YourUID"){
    alert("Welcome Admin!");
  $("#myBtn4").css('visibility', 'visible');
  }

}


function transLog(){
  //Optional link under transaction Logs for user to choose if they want to view it in their own browser
  shell.openExternal("https://rinkeby.etherscan.io/token/0x2bdf756105c1a2f0a34001910e2895349fad8b0a?a="+pubAddress)

}

//Admin inserting new charity org
function insertCharityOrg(){

  var database = firebase.database();

  //accessing db table CharityOrgData
  var ref = database.ref('CharityOrgData');

  //Get admin input
  var orgName = document.getElementById('orgName').value;
  var orgEth = document.getElementById('orgEth').value;
  var orgLocation = document.getElementById('orgLocation').value;

  //Inserting Data to firebase variable
  var data = {
    orgname:  orgName,
    ethadd: orgEth,
    phyadd: orgLocation

  }
  //push data into firebase db
  ref.push(data);

}


function verOrg(){

  //document.getElementById('terms').style.visibility = 'hidden';
  $('#terms').hide();
  document.getElementById('orgContent').style.visibility = 'visible';

  getDB();
}

//Getting DB data
function getDB(){

  var databaseVer = firebase.database();

  //accessing db table CharityOrgData
    var refVer = databaseVer.ref('CharityOrgData');

    refVer.on('value',gotData,errData);

}

//If got data display it
function gotData(data){

  var info = data.val();
  //Get primary key
  var keys = Object.keys(info);
  //display the primary keys
  console.log(keys);

const list_dev = document.querySelector("#list_div");

//empty list to prevent duplications
  $('#list_div').empty();

  //loop to display all the primary key information
  for (var i = 0; i < keys.length; i++){
    var k = keys[i];
    var disname = info[k].orgname;
    var disethadd = info[k].ethadd;
    var disphyadd = info[k].phyadd;

console.log(disname,disethadd,disphyadd);

list_dev.innerHTML += "<div class='list-item'><h3>" + "Organization Name: " + disname + "</h3>"
+ "<p>" + "<b>" + "Organization ETH Address: " + "<b>" + disethadd + "</p>" +
"<p>" + "<b>" +"Organization Physical Address: " + "<b>" + disphyadd + "</p> </div>";

  }

}


function errData(err){
  console.log('error');
}

//Search text for user to put pub address to verify
function checkDB() {

  //clear the list to avoid duplications
  $('#check_list').empty();
  var database = firebase.database();

    //accessing db table CharityOrgData
    var ref = database.ref('CharityOrgData');


    const check_list = document.querySelector("#check_list");
    //get input from search bar
    var checkInput = document.getElementById("checkInput").value;

    //to remove info if the search bar is activated an empty
    if(checkInput === ""){
      console.log("Empty");
    }

    else{

      //access ethadd child db to check if ethadd input matches to any in db
      ref.orderByChild('ethadd').equalTo(checkInput).on("value", function(snapshot) {

        console.log(snapshot.val());

          //check if snapshot is null/not found
          if( !snapshot.val()){

              check_list.innerHTML += "<div class='check-item'><h3>" + "Ethereum Address: " + checkInput + "</h3>" +
              "<p>" + "Not Found In The Database" + "</p>" + "</div>";
          }

          else{
            //print the information of the matched ethadd
            snapshot.forEach(function(data) {

            var info = data.val();

            check_list.innerHTML += "<div class='check-item'><h3>" + "Organization Name: " + info.orgname + "</h3>"
            + "<p>" + "<b>" + "Organization ETH Address: " + "<b>" + info.ethadd + "</p>" +
            "<p>" + "<b>" +"Organization Physical Address: " + "<b>" + info.phyadd + "</p> </div>";

        })

      };
  });
  }
}

//Input private key to enter validation
function OpenPrivateKey() {
    getUID();
    var key = $("#Pkey").val();

    //check if 0x is infront of the public address if no add it to avoid errors
    if (key.substring(0, 2) !== '0x') {
        key = '0x' + key;  //check front of pkey to get correct wallet
    }

    //if key is not empty and matches the hexa expression
    if (key != '' && key.match(/^(0x)?[0-9A-fa-f]{64}$/)) {
        HideButtons();
        try {
            myWallet = new Wallet(key);  //sign in with pkey if no err continue to maindashboard
            console.log("Opened: " + myWallet.address)
            pubAddress = myWallet.address;
        } catch (e) {
            console.error(e);
        }
        $('#myBtn').hide();
        $("#myBtn3").css('visibility', 'visible');
        $("#tLogs").attr('src',"https://rinkeby.etherscan.io/token/0x2bdf756105c1a2f0a34001910e2895349fad8b0a?a="+pubAddress);
        document.getElementById("ethscanURL").innerHTML= "https://rinkeby.etherscan.io/token/0x2bdf756105c1a2f0a34001910e2895349fad8b0a?a="+pubAddress;
        SuccessAccess();
        updateBalance();

    } else {
      $("#privatekeyerror").show();
    }
}

// *rinkeby* etherscan site with txid
function OpenEtherScan(txid) {
  shell.openExternal('https://rinkeby.etherscan.io/tx/'+txid)
}

//Check Before send(eth)
function CheckETHAvailable() {
    //get the amount user wants to send
    var send = $("#send_ether_amount").val();

    //get the custom amount of fee if user wish to change
    var fee = $("#ethtxfee").val();

    //Check if the amount user wants to send is more than user's initial balance
    var spendable = ethBalance - (send - fee);
    if (spendable >= 0) {
        $("#sendethbutton").prop("disabled", false);
    } else {
        $("#sendethbutton").prop("disabled", true);
    }
}

//Check Before send(zeus)
function CheckTokenAvailable() {
    //get the amount user wants to send
    var send = $("#send_amount_token").val();

    //get the custom amount of fee if user wish to change
    var fee = $("#tokentxfee").val();

    //Check if the amount user wants to send is more than user's initial balance
    var spendable = tokenBalance - (send - fee);
    if (spendable >= 0) {
        $("#sendtokenbutton").prop("disabled", false);
    } else {
        $("#sendtokenbutton").prop("disabled", true);
    }
}

//Update wallet balances for both eth and zeus every 5 seconds
setInterval(function() {
    if (myWallet) updateBalance();
}, 5000);


//One Click to copy public address
function CopyAddress() {
    clipboardy.writeSync(myWallet.address);
    alert("Address Copied: " + myWallet.address);
}


function HideButtons() {
    $("#form-groupID").attr("class", "hidden");
}

//Get eth and zeus balance
function updateBalance() {
    var address = myWallet.address;
    $(".myaddress").html(address);

    provider.getBalance(address).then(function(balance) {
        //Format ethereum to its decimal 18
        var etherString = ethers.utils.formatEther(balance);
        console.log("ETH Balance: " + etherString);
        //round it
        var n = parseFloat(etherString);
        //once round show 4 decimal point only
        var ethValue = n.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 4
            }
        );
        var messageEl = $('#ethbal');
        var split = ethValue.split(".");
        ethBalance = parseFloat(ethValue);
        messageEl.html(split[0] + ".<small>" + split[1] + "</small>");
    });

    //View from token's contract to get the zeus balance of this specific address
    var callPromise = tokenContract.functions.balanceOf(address);

    callPromise.then(function(result) {
        var trueBal = result[0].toString(10);
        var messageEl = $('#zeusbal');
        var n = trueBal * 0.01;
        console.log("ZEUS Balance: " + n);
        var atyxValue = n.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2
            }
        );

        var split = atyxValue.split(".");
      //  tokenBalance = parseFloat(atyxValue);
      //  tokenBalance = parseFloat(messageEl);

      //Round it to the right decimal point
      tokenBalance = trueBal * 0.01;
      trueBal = trueBal * 0.01;

        console.log(tokenBalance);
        $(".zeusSpend").html(trueBal);
        messageEl.html(split[0] + ".<small>" + split[1] + "</small>");

    });

}


function SuccessAccess() {
    $("#addressArea").attr("class", "row");
    $("#walletActions").attr("class", "row");
    $(".walletInfo").attr("class", "row walletInfo");
}

//Get gas amount... default 21 and update if user change it
function GetEthGas() {
    //1 Ether = 1,000,000,000 gwei (10^9)
    //1 Ether = 1,000,000,000,000,000,000 (10^18) wei
    //tokengasprice by default 21 gwei
    var price = $("#ethgasprice").val();
    var gaslimit = 21000;
    var txfee = price * gaslimit;
    $("#ethtxfee").val((txfee * 0.000000001).toFixed(5));
    UpdateAvailableETH();
    return false;
}


function GetTokenGas() {
    //1 Ether = 1,000,000,000 gwei (10^9)
    //1 Ether = 1,000,000,000,000,000,000 (10^18) wei
    //tokengasprice by default 21 gwei
    var price = $("#tokengasprice").val();
    var gaslimit = 65000;
    var txfee = price * gaslimit;
    $("#tokentxfee").val((txfee * 0.000000001).toFixed(5));
    UpdateTokenFeeETH();
    return false;
}


function ConfirmButton(elem) {
    $(elem).html("CONFIRM")
    $(elem).attr("class", "btn btn-success")
}


var lastTranx;

//Send eth
function SendEthereum(callback) {
    //recipient pub address
    var to = $('#send_ether_to').val();
    //Amount of eth
    var amount = $('#send_ether_amount').val();
    $("#sendethbutton").prop("disabled", true);
    //gwei to ethereum convert
    var price = parseInt($("#ethgasprice").val()) * 1000000000;

    //basic check for empty field and check that amount must be lesser than ethBalance after including the fees
    if (to != '' && amount != '' && parseFloat(amount) <= ethBalance) {
        //send to rinkeby provider
        myWallet.provider = new ethers.providers.InfuraProvider('rinkeby');
        var amountWei = ethers.utils.parseEther(amount);
        var targetAddress = ethers.utils.getAddress(to);

        //Perform send
        //gasprice = gas amount set by user and limit 21000
        // 21000 * 21 = 441,000 gwei and into eth = 0.000441000
        myWallet.send(targetAddress, amountWei, {
            gasPrice: price,
            gasLimit: 21000,
        }).then(function(txid) {
            console.log(txid);
            $("#sendethbutton").prop("disabled", false);
            $('#ethermodal').modal('hide');
            $(".txidLink").html(txid.hash);
            $(".txidLink").attr("onclick", "OpenEtherScan('"+txid.hash+"')");
            $("#senttxamount").html(amount);
            $("#txtoaddress").html(to);
            $("#txtype").html("ETH");
            $('#trxsentModal').modal('show');
            updateBalance();
        });
    }
}



function UpdateAvailableETH() {
    var fee = $("#ethtxfee").val();
    var available = ethBalance - fee;
    $(".ethspend").html(available.toFixed(6));
}


function UpdateTokenFeeETH() {
    var fee = $("#tokentxfee").val();
    var available = ethBalance - fee;

    $(".ethavailable").each(function(){
      $(this).html(available.toFixed(6));
    });
}


//Sending zeus
function SendToken(callback) {
    var to = $('#send_to_token').val();
    var amount = $('#send_amount_token').val();

    $("#sendtokenbutton").prop("disabled", true);
    var price = parseInt($("#tokengasprice").val()) * 1000000000;

      var checkAmt = parseFloat(amount) / 1;

    if (to != '' && amount != '' && checkAmt <= tokenBalance) {
        var targetAddress = ethers.utils.getAddress(to);
        var checkAmt2 = parseFloat(amount) / 0.01;
        myWallet.provider = new ethers.providers.InfuraProvider('rinkeby');
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, myWallet);
        tokenContract.transfer(targetAddress, checkAmt2, {
            gasPrice: price,
            gasLimit: 65000,
        }).then(function(txid) {
            console.log(txid);
            $('#zeusmodal').modal('hide')
            $("#sendtokenbutton").prop("disabled", false);

            $(".txidLink").html(txid.hash);
            $(".txidLink").attr("onclick", "OpenEtherScan('"+txid.hash+"')");
            $("#senttxamount").html(amount);
            $("#txtoaddress").html(to);
            $("#txtype").html("ZEUS");
            $('#trxsentModal').modal('show');
            updateBalance();
        });
    }
}

function logoutjs(){

  var logoutcheck = confirm("You're About To Log Out");

if(logoutcheck){
     location.href = "Index.html";
   }

}
