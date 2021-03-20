pragma solidity >=0.4.0 <0.8.0;
pragma experimental ABIEncoderV2;

library Roles {
    
    enum seviyeler {ulke,sehir,ilce,cadde,sokak,apartman,daire}
    
    struct Role {
        mapping (address => bool) bearer;
    }
    
    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}


contract RolveAdres {
    
    struct adres
    {
        bytes32[] resimIPFSHash;
        bytes32 ulke;
        bytes32 sehir;
        bytes32 ilce;
        bytes adresGeriKalan;
        bytes32 postaKodu;
        lokasyon _lokasyon;
    }

    
    struct lokasyon { //40.008237172957095, 32.88925763146737
        bytes32 xfirst;
        bytes32 xsecond;
        bytes32 yfirst;
        bytes32 ysecond;
    }

    
    mapping (bytes32 => adres[]) kisiTumAdresleri ;        //0 => ev 1 => iş; // adres ilgisinin 32 byte 
    address [] adresiKayitlilar; //zincire adresini kayıtettirenler;
                         
    function ekleVeyaGuncelle(uint adresTipi, bytes32[] memory _resimIPFSHash,bytes32 _ulke, bytes32 _sehir, bytes32 _ilce, bytes memory _adresGeriKalan, bytes32 _postaKodu,bytes32[] memory _lokasyon,bytes32 hashKey1,bytes32 hashKey2) public returns (bool){
        
        bytes32 key = keccak256(abi.encodePacked(msg.sender, hashKey1,hashKey2));
        
        if(kisiTumAdresleri[key][adresTipi].adresGeriKalan.length == 0){ //ekleme
              
              adres memory val = adres(_resimIPFSHash,_ulke,_sehir,_ilce,_adresGeriKalan,_postaKodu,lokasyon(_lokasyon[0],_lokasyon[1],_lokasyon[2],_lokasyon[3]));
              kisiTumAdresleri[key][adresTipi] = val;
              adresiKayitlilar.push(msg.sender);
        }
        else{ //guncelleme
            adres storage val = kisiTumAdresleri[key][adresTipi];
            val.resimIPFSHash = _resimIPFSHash;
            val.ulke = _ulke;
            val.sehir = _sehir;
            val.ilce = _ilce;
            val.adresGeriKalan = _adresGeriKalan;
            val.postaKodu = _postaKodu;
            val._lokasyon.xfirst = _lokasyon[0];
            val._lokasyon.xsecond = _lokasyon[1];
            val._lokasyon.yfirst = _lokasyon[2];
            val._lokasyon.xsecond = _lokasyon[3];
            
        }
        
      
        return true;
        
    }

   /* function getAddress() public view returns (bytes memory,uint,uint) {
        return (kisiTumAdresleri[msg.sender]._adres,kisiTumAdresleri[msg.sender]._lokasyon.x,kisiTumAdresleri[msg.sender]._lokasyon.y);
        
    }*/
}


library DecimalMath {
    using SafeMath for uint256;

    uint256 constant internal UNIT = 1e27;

    struct UFixed {
        uint256 value;
    }

    /// @dev Creates a fixed point number from an unsiged integer. `toUFixed(1) = 10^-27`
    /// Converting from fixed point to integer can be done with `UFixed.value / UNIT` and `UFixed.value % UNIT`
    function toUFixed(uint256 x) internal pure returns (UFixed memory) {
        return UFixed({
            value: x
        });
    }

    /// @dev Equal to.
    function eq(UFixed memory x, UFixed memory y) internal pure returns (bool) {
        return x.value == y.value;
    }

    /// @dev Equal to.
    function eq(UFixed memory x, uint y) internal pure returns (bool) {
        return x.value == y.mul(UNIT);
    }

    /// @dev Equal to.
    function eq(uint x, UFixed memory y) internal pure returns (bool) {
        return x.mul(UNIT) == y.value;
    }

    /// @dev Greater than.
    function gt(UFixed memory x, UFixed memory y) internal pure returns (bool) {
        return x.value > y.value;
    }

    /// @dev Greater than.
    function gt(UFixed memory x, uint y) internal pure returns (bool) {
        return x.value > y.mul(UNIT);
    }

    /// @dev Greater than.
    function gt(uint x, UFixed memory y) internal pure returns (bool) {
        return x.mul(UNIT) > y.value;
    }

    /// @dev Greater or equal.
    function geq(UFixed memory x, UFixed memory y) internal pure returns (bool) {
        return x.value >= y.value;
    }

    /// @dev Greater or equal.
    function geq(UFixed memory x, uint y) internal pure returns (bool) {
        return x.value >= y.mul(UNIT);
    }

    /// @dev Greater or equal.
    function geq(uint x, UFixed memory y) internal pure returns (bool) {
        return x.mul(UNIT) >= y.value;
    }

    /// @dev Less than.
    function lt(UFixed memory x, UFixed memory y) internal pure returns (bool) {
        return x.value < y.value;
    }

    /// @dev Less than.
    function lt(UFixed memory x, uint y) internal pure returns (bool) {
        return x.value < y.mul(UNIT);
    }

    /// @dev Less than.
    function lt(uint x, UFixed memory y) internal pure returns (bool) {
        return x.mul(UNIT) < y.value;
    }

    /// @dev Less or equal.
    function leq(UFixed memory x, UFixed memory y) internal pure returns (bool) {
        return x.value <= y.value;
    }

    /// @dev Less or equal.
    function leq(uint x, UFixed memory y) internal pure returns (bool) {
        return x.mul(UNIT) <= y.value;
    }

    /// @dev Less or equal.
    function leq(UFixed memory x, uint y) internal pure returns (bool) {
        return x.value <= y.mul(UNIT);
    }

    /// @dev Multiplies x and y.
    /// @param x An unsigned integer.
    /// @param y A fixed point number.
    /// @return An unsigned integer.
    function muld(uint256 x, UFixed memory y) internal pure returns (uint256) {
        return x.mul(y.value).div(UNIT);
    }

    /// @dev Multiplies x and y.
    /// @param x A fixed point number.
    /// @param y A fixed point number.
    /// @return A fixed point number.
    function muld(UFixed memory x, UFixed memory y) internal pure returns (UFixed memory) {
        return UFixed({
            value: muld(x.value, y)
        });
    }

    /// @dev Multiplies x and y.
    /// @param x A fixed point number.
    /// @param y An unsigned integer.
    /// @return A fixed point number.
    function muld(UFixed memory x, uint y) internal pure returns (UFixed memory) {
        return muld(x, toUFixed(y));
    }

    /// @dev Divides x by y.
    /// @param x An unsigned integer.
    /// @param y A fixed point number.
    /// @return An unsigned integer.
    function divd(uint256 x, UFixed memory y) internal pure returns (uint256) {
        return x.mul(UNIT).div(y.value);
    }

    /// @dev Divides x by y.
    /// @param x A fixed point number.
    /// @param y A fixed point number.
    /// @return A fixed point number.
    function divd(UFixed memory x, UFixed memory y) internal pure returns (UFixed memory) {
        return UFixed({
            value: divd(x.value, y)
        });
    }

    /// @dev Divides x by y.
    /// @param x A fixed point number.
    /// @param y An unsigned integer.
    /// @return A fixed point number.
    function divd(UFixed memory x, uint y) internal pure returns (UFixed memory) {
        return divd(x, toUFixed(y));
    }

    /// @dev Divides x by y.
    /// @param x An unsigned integer.
    /// @param y An unsigned integer.
    /// @return A fixed point number.
    function divd(uint256 x, uint256 y) internal pure returns (UFixed memory) {
        return divd(toUFixed(x), y);
    }

    /// @dev Adds x and y.
    /// @param x A fixed point number.
    /// @param y A fixed point number.
    /// @return A fixed point number.
    function addd(UFixed memory x, UFixed memory y) internal pure returns (UFixed memory) {
        return UFixed({
            value: x.value.add(y.value)
        });
    }

    /// @dev Adds x and y.
    /// @param x A fixed point number.
    /// @param y An unsigned integer.
    /// @return A fixed point number.
    function addd(UFixed memory x, uint y) internal pure returns (UFixed memory) {
        return addd(x, toUFixed(y));
    }

    /// @dev Subtracts x and y.
    /// @param x A fixed point number.
    /// @param y A fixed point number.
    /// @return A fixed point number.
    function subd(UFixed memory x, UFixed memory y) internal pure returns (UFixed memory) {
        return UFixed({
            value: x.value.sub(y.value)
        });
    }

    /// @dev Subtracts x and y.
    /// @param x A fixed point number.
    /// @param y An unsigned integer.
    /// @return A fixed point number.
    function subd(UFixed memory x, uint y) internal pure returns (UFixed memory) {
        return subd(x, toUFixed(y));
    }

    /// @dev Subtracts x and y.
    /// @param x An unsigned integer.
    /// @param y A fixed point number.
    /// @return A fixed point number.
    function subd(uint x, UFixed memory y) internal pure returns (UFixed memory) {
        return subd(toUFixed(x), y);
    }

    /// @dev Divides x between y, rounding up to the closest representable number.
    /// @param x An unsigned integer.
    /// @param y A fixed point number.
    /// @return An unsigned integer.
    function divdrup(uint256 x, UFixed memory y) internal pure returns (uint256)
    {
        uint256 z = x.mul(UNIT);
        return z.mod(y.value) == 0 ? z.div(y.value) : z.div(y.value).add(1);
    }

    /// @dev Multiplies x by y, rounding up to the closest representable number.
    /// @param x An unsigned integer.
    /// @param y A fixed point number.
    /// @return An unsigned integer.
    function muldrup(uint256 x, UFixed memory y) internal pure returns (uint256)
    {
        uint256 z = x.mul(y.value);
        return z.mod(UNIT) == 0 ? z.div(UNIT) : z.div(UNIT).add(1);
    }

    /// @dev Exponentiation (x**n) by squaring of a fixed point number by an integer.
    /// Taken from https://github.com/dapphub/ds-math/blob/master/src/math.sol. Thanks!
    /// @param x A fixed point number.
    /// @param n An unsigned integer.
    /// @return An unsigned integer.
    function powd(UFixed memory x, uint256 n) internal pure returns (UFixed memory) {
        if (x.value == 0) return toUFixed(0);
        if (n == 0) return toUFixed(UNIT);
        UFixed memory z = n % 2 != 0 ? x : toUFixed(UNIT);

        for (n /= 2; n != 0; n /= 2) {
            x = muld(x, x);

            if (n % 2 != 0) {
                z = muld(z, x);
            }
        }
        return z;
    }
}

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}
