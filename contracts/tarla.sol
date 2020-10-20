pragma solidity >=0.2.0 <0.8.0;

contract urunTarla {
    
    struct tarla {
        bytes enlem;
        bytes boylam;
        bytes urunTipi;
        bytes sahipTckn;
        bytes sahipAd;
        bytes sahipSoyad;
    }
    
    mapping(uint => tarla) tarlalar;
    uint tarlaIdCount=1;
    
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
    
