pragma solidity >=0.4.0 <0.8.0;

contract rol {
    
    struct adres
    {
        bytes _adres;
        lokasyon _lokasyon;
    }
    
    
    struct lokasyon {
        uint x;
        uint y;
    }

    
    mapping (address => adres) adresler;
    
    address [] adrescikler;
    
    function setAddres(address adr,bytes memory _adres, uint x,uint y) public returns (bool){
        
        require(adr == msg.sender,"adres sahibi guncelleme yapabilir");
        
        if(adresler[adr]._adres.length == 0){ //ekleme
              adresler[msg.sender] = adres(_adres,lokasyon(x,y));
              adrescikler.push(adr);
        }
        else{
            adres storage val = adresler[msg.sender];
            val._lokasyon.x = x;
            val._lokasyon.y = y;
        }
        
      
        return true;
        
    }

    
    function getAddress(address _adres) public view returns (bytes memory,uint,uint) {
        
        require(_adres == msg.sender,"adres sahibi veriyi cekebilir");
        
        return (adresler[msg.sender]._adres,adresler[msg.sender]._lokasyon.x,adresler[msg.sender]._lokasyon.y);
        
    
    }
    
    function getaddsler()public view returns (address [] memory){
        return adrescikler;
        
    }
    
    
    
    
    
}
