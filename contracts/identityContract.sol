pragma solidity ^0.4.17;

contract identityContract{

  struct identityRequest { 
    string name;
    string surname; 
    bytes identity;
  }
  
  address public contractOwner;   // contract adresini deploy eden
  mapping(address => mapping(string => identityRequest)) identityCollection;  //hash ve data bilgisini tutan collection  
  event SetIdentity(string hash,address sender); //loglama callback
  string[] response;

function identityContract() public { 
   contractOwner = msg.sender;
}

modifier restricted(){  //sadece contract sahibi deploy yetkisi 
  require(msg.sender == contractOwner);
  _;
}

function setIdentity(string memory _hashIdentity,string _name, string _surname,bytes memory _identity) public restricted{
  
    identityRequest memory newRequest = identityRequest({
                     name :_name,
                     surname : _surname,
                     identity: _identity
    });

    SetIdentity(_hashIdentity,msg.sender); 
    identityCollection[msg.sender][_hashIdentity] = newRequest;
}

function getIdentity(string memory _hashIdentity) public returns (string,string,bytes){  
    identityRequest memory oldRequest = identityCollection[contractOwner][_hashIdentity];
    string memory name = oldRequest.name;
    string memory surname = oldRequest.surname;
    return (name,surname,oldRequest.identity);
}

}
