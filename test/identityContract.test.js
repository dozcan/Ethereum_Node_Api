const assert = require('assert'); 
const Web3   = require('web3');
const ganache = require('ganache-cli');
const web3Provider   = new Web3(ganache.provider());
const index = require('../index.js');
const {bytecode,interface} = require('../compile.js');
const helper = ('../helper.js');

//test frameworku mocha, ayrıca test network için ganache kullanıyoruz
//ganache içerisinde burada otomatik yaratılmış hesaplar mevcut

let accounts;       //ethereum hesapları ganache den otomatik gelir
let account         //kendi hesap yaratım sonucumuz
let deployContract; //akıllı sözleşme adresi

beforeEach(async()=>{

    accounts = await new web3Provider.eth.getAccounts();

});

describe('IdentityContract contract testi',()=>{

   it('ethereum hesapları gösteriliyor',()=>{
        assert(accounts.length > 0);
   });

   it('bakiye kontrolü yapıldı',async()=> {
       var balance =  await web3Provider.eth.getBalance(accounts[0]);
       assert(balance>0)
   });

   it('ethereum hesabı yaratıldı',async() =>{
        account = await index.AccountCreate(web3Provider);
        assert.ok(account.address);
        assert.ok(account.privateKey);
   });

   it('sözleşme deploy edildi',async() =>{
        deployContract = await index.DeployContract(web3Provider,interface,bytecode,accounts[0]);
        assert.ok(deployContract.options.address);
   });
  
   it('blockchain üzerine veri gönderildi',async() =>{
       var hashedData = "0x11";
       var data      = "0x8045";
       var hashTransactionOfSetMethod = "";
       var identity = await index.Identity(deployContract,accounts[0],hashedData,"doga","ozcan",data);
       assert.notEqual(identity,"");  
   });

   it('orjinal veri getirildi',async() =>{
       var hashedData = "0x11";
       var data= {
        name:"doga",
        surname:"ozcan",
        identity:"0x8045"
       };
       var identity = await index.getIdentity(deployContract,accounts[0],hashedData);
       assert.equal(data.name,identity[0]);
       assert.equal(data.surname,identity[1]);
       assert.equal(data.identity,identity[2]);
   });

});