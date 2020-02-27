pragma solidity ^0.4.18;
contract digitalIdentity {
 

 struct identityPerson{
     string name;
     string surname;
 }
 
 struct Identity {
        uint tckn;
        identityPerson p;
    }

    mapping (uint => Identity) identities;
    uint identityCount;

function newIdentity(string name,string surname,uint tckn) public returns (uint identityId){
    identityId = identityCount++;
    identities[identityId] = Identity(tckn,identityPerson(name,surname));
}
    function getIdentity(uint id) public view returns(string name,string surname,uint tckn){
     Identity memory identity = identities[id];
     return (identity.p.name,identity.p.surname,identity.tckn);

    }


}
