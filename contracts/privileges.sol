pragma solidity ^0.4.24;

contract privileges {

    struct privilege {
        screenPrivileges[] _screenPrivileges;
    }
    
    struct screenPrivileges {
        bytes32 screen_code;
        bytes32 starting_date;
        bytes32 ending_date;
    }
    
    bytes32[]  screen_code_list;
    bytes32[] starting_date_list;
    bytes32[] ending_date_list;
    mapping(address => privilege) privilege_list;
    mapping(address => uint) screenCountSize;
    
    function update(uint newSize,string __privilegeOwner,bytes32[]  screenCode,bytes32[]  startingDate,bytes32[]  endingDate) public returns (bool){
        address privilegeOwner = parseAddr(__privilegeOwner);
        delete privilege_list[privilegeOwner]._screenPrivileges;
     
        
        for(uint i=0;i<newSize;i++){
            screenPrivileges memory localdata = screenPrivileges(screenCode[i],startingDate[i],endingDate[i]);
            privilege_list[privilegeOwner]._screenPrivileges.push(localdata);
        }
        screenCountSize[privilegeOwner] = newSize;
        return true;
    }
    function get(string __privilegeOwner) public returns (bytes32[]  screenCode,bytes32[]   startingDate,bytes32[]   endingDate){
        address privilegeOwner = parseAddr(__privilegeOwner);
        for(uint i=0;i<privilege_list[privilegeOwner]._screenPrivileges.length;i++){
              screen_code_list.push(privilege_list[privilegeOwner]._screenPrivileges[i].screen_code);
              starting_date_list.push(privilege_list[privilegeOwner]._screenPrivileges[i].starting_date);
              ending_date_list.push(privilege_list[privilegeOwner]._screenPrivileges[i].ending_date);
        }
        return (screen_code_list,starting_date_list,ending_date_list);
    }
    
    function parseAddr(string _a) internal returns (address){
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i=2; i<2+2*20; i+=2){
            iaddr *= 256;
            b1 = uint160(tmp[i]);
            b2 = uint160(tmp[i+1]);
            if ((b1 >= 97)&&(b1 <= 102)) b1 -= 87;
            else if ((b1 >= 48)&&(b1 <= 57)) b1 -= 48;
            if ((b2 >= 97)&&(b2 <= 102)) b2 -= 87;
            else if ((b2 >= 48)&&(b2 <= 57)) b2 -= 48;
            iaddr += (b1*16+b2);
        }
        return address(iaddr);
    }

}
