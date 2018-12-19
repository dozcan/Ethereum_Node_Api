pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract privileges {

    struct privilege {
        screenPrivileges[] _screenPrivileges;
    }
    
    struct screenPrivileges {
        string screen_code;
        string starting_date;
        string ending_date;
    }
    
    string[] screen_code_list;
    string[] starting_date_list;
    string[] ending_date_list;
    mapping(address => privilege) privilege_list;
    mapping(address => uint) screenCountSize;
    
    function update(uint newSize,address privilegeOwner,string[] memory screenCode,string[] memory startingDate,string[] memory endingDate) public returns (bool){
        delete privilege_list[privilegeOwner]._screenPrivileges;
        delete screen_code_list;
        delete starting_date_list;
        delete ending_date_list; 
        
        for(uint i=0;i<newSize;i++){
            screenPrivileges memory localdata = screenPrivileges(screenCode[i],startingDate[i],endingDate[i]);
            privilege_list[privilegeOwner]._screenPrivileges.push(localdata);
        }
        screenCountSize[privilegeOwner] = newSize;
        return true;
    }
    function get(address privilegeOwner) public returns (string[] memory screenCode,string[] memory startingDate,string[] memory endingDate){
        for(uint i=0;i<privilege_list[privilegeOwner]._screenPrivileges.length;i++){
              screen_code_list.push(privilege_list[privilegeOwner]._screenPrivileges[i].screen_code);
              starting_date_list.push(privilege_list[privilegeOwner]._screenPrivileges[i].starting_date);
              ending_date_list.push(privilege_list[privilegeOwner]._screenPrivileges[i].ending_date);
        }
        return (screen_code_list,starting_date_list,ending_date_list);
    }
}
