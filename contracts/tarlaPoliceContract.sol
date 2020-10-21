pragma solidity >=0.2.0 <0.8.0;

contract tarlaPoliceContract {
    
    struct tarla {
        bytes enlem;
        bytes boylam;
        bytes urunTipi;
        bytes sahipTckn;
        bytes sahipAd;
        bytes sahipSoyad;
    }
    struct police {
        bytes acente;
        bytes sigortaBaslangic;
        bytes sigortaBitis;
        bytes sigortaTur;
        bytes sigortaTutar;
        bytes tckn;
    }
    
    mapping(bytes32 => police) policeler;
    uint policeIdCount=1;
    
    mapping(uint => tarla) tarlalar;
    uint tarlaIdCount=1;
    
    function setNewPolice(
        bytes memory _acente,
        bytes memory _sigortaBaslangic,
        bytes memory _sigortaBitis,
        bytes memory _sigortaTur,
        bytes memory _sigortaTutar,
        bytes memory _tckn)public returns (bytes32 policeUniqId){
         
        bytes32 policeUniqId = keccak256(_tckn);
        policeler[policeUniqId] = police(_acente,_sigortaBaslangic,_sigortaBitis,_sigortaTur,_sigortaTutar,_tckn);
        return policeUniqId;
        }
    
    function getCreatedPolice(bytes32 policeUniqId) public view returns(
        bytes memory _acente,
        bytes memory _sigortaBaslangic,
        bytes memory _sigortaBitis,
        bytes memory _sigortaTur,
        bytes memory _sigortaTutar,
        bytes memory _tckn){
            
            return (policeler[policeUniqId].acente,
                    policeler[policeUniqId].sigortaBaslangic,
                    policeler[policeUniqId].sigortaBitis,
                    policeler[policeUniqId].sigortaTur,
                    policeler[policeUniqId].sigortaTutar,
                    policeler[policeUniqId].tckn);
        }
    
    function setNewTarla(bytes memory _enlem,
        bytes memory _boylam,
        bytes memory  _urunTipi,
        bytes memory _sahipTckn,
        bytes memory _sahipAd,
        bytes memory _sahipSoyad)public returns (uint createdTarlaId){
         
        createdTarlaId =  tarlaIdCount++;
        tarlalar[createdTarlaId] = tarla(_enlem,_boylam,_urunTipi,_sahipTckn,_sahipAd,_sahipSoyad);
    }
    
    function getCreatedTarla(uint createdTarlaId) public view returns(bytes memory  _urunTipi,
        bytes memory _sahipTckn){
            
            return (tarlalar[createdTarlaId].urunTipi,tarlalar[createdTarlaId].sahipTckn);
        }
}
    
