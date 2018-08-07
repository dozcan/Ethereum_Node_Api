const {interface, bytecode} =require('./compile.js');
const helper = require('./helper.js');
const responseMaker =require('./responseMaker.js');
const requestTypeError = require('./enum.js');
const Web3 = require('web3');
const cors = require('cors');

//var requestUrl = "http://"+process.env.NODE_IP+":"+process.env.NODE_PORT;
// default rpc port 8545, ikinci container portuna dönüştürülebilinir.
var web3 = new Web3(new Web3.providers.HttpProvider("http://18.236.71.65:8545"));

//veri blockchain üzerinde sıkıştırılmış tutuluyor daha sonra hash değeri tutulacak
var zlib = require('zlib');
var express = require('express');
const app = express();
var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({extended:true }));
app.use(cors());
//gas limit ve gas price a bağlı olarak block boyutu ve blok içerisine sığacak tra:nsaction sayısını
//değiştirebiliriz
// 1. çözüm verinin hashlenip verinin datasının dışarıda tutulup eşleştirme yapılması.
// 2. çözüm veri boyutunun küçültülmesi
// 3. çözüm solidty kodunda byte veri kullanabilmek.
app.use(bodyParser.json({limit:1024*1024*1024,type:'application/json'}));

let accounts = [];
let contractAddress;
let contractInstance;
let hashTransactionOfSetMethod;
let balance;
let miningBool;
let gasPrice;
let currentBlock;
let accountCreate;
let errorMessage;
let errorCode;
var responseObject;
var rawResponseObject;
var key;
var value ;

app.get('/AccountCreateTest',function(req,res){
  
  var create = async() =>{
    try
    {

      key = ["account","key"];
      value = ["0x34343","2323"];
      rawResponseObject = responseMaker.createResponse(key,value);
      response = responseMaker.responseMaker(rawResponseObject);
      res.send(response);
    }
    catch(err)
    {
      errorCode = requestTypeError.account_create;
      errorMessage =  helper.error(errorCode,err);
      response = responseMaker.responseErrorMaker(errorCode,errorMessage);
      res.send(response);
    }
  }
  create();
});

/*Account yaratmak için rest api url
*Çağırım : http://ip:port/AccountCreate
*input : yok
*output: account adresi, privateKey*/
app.get('/AccountCreate',function(req,res){
  
  var create = async() =>{
    try
    {
      account = await AccountCreate(web3);
      console.log("yaratılan account :" + account.address);
      console.log("private key :" + account.privateKey);

      key = ["account","key"];
      value = [account.address,account.privateKey];
      rawResponseObject = responseMaker.createResponse(key,value);
      response = responseMaker.responseMaker(rawResponseObject);
      res.send(response);
    }
    catch(err)
    {
      errorCode = requestTypeError.account_create;
      errorMessage =  helper.error(errorCode,err);
      response = responseMaker.responseErrorMaker(errorCode,errorMessage);
      res.send(response);
    }
  }
  create();
});

const AccountCreate = async(provider) => {
  try{
    return await provider.eth.accounts.create();
  }
  catch(err){
    throw err;
  }
}

app.get('/DeployContractTest',function(req,res){
  
  var deploy = async()=>{
    try{

      key = ["account","contract", "balance", "gas", "block" ];
      value = [100,0x2334,31000000,4555555,4];
      rawResponseObject = responseMaker.createResponse(key,value);
      response = responseMaker.responseMaker(rawResponseObject);
      res.send(response);
    }

    catch(err)
    {    
      errorCode = requestTypeError.contract_deploy;
      errorMessage =  helper.error(errorCode,err);
      console.log(errorCode);
      response = responseMaker.responseErrorMaker(errorCode,errorMessage);
      res.send(response);
    }
  }
  deploy();
});   
/*Contract deploy etmek için rest api url
*Çağırım : http://ip:port/DeployContract
*input : yok
*output: contract adresi,account,bakiye,mining durumu,gas değeri,blok sayısı*/
app.get('/DeployContract',function(req,res){
  
  var deploy = async()=>{
    try{

      accounts = await web3.eth.getAccounts();
      balance = await web3.eth.getBalance(accounts[0]);
      miningBool = await web3.eth.isMining();
      hashRate   = await web3.eth.getHashrate();
      gasPrice  = await web3.eth.getGasPrice();
      currentBlock = await web3.eth.getBlockNumber();
      console.log("account adresi: " + accounts[0]);
      console.log("account bakiyesi: " + balance);

      contractInstance = await DeployContract(web3,interface,bytecode,accounts[0]);
      contractAddress = contractInstance.options.address;
      console.log("akıllı sözleşme adresi :" + contractAddress);

      key = ["account","contract", "balance", "gas", "block" ];
      value = [accounts[0],contractAddress,balance/1000000000000000000,gasPrice,currentBlock];
      rawResponseObject = responseMaker.createResponse(key,value);
      response = responseMaker.responseMaker(rawResponseObject);
      res.send(response);
    }

    catch(err)
    {    
      errorCode = requestTypeError.contract_deploy;
      errorMessage =  helper.error(errorCode,err);
      console.log(errorCode);
      response = responseMaker.responseErrorMaker(errorCode,errorMessage);
      res.send(response);
    }
  }
  deploy();
});   

const DeployContract = async(provider,interface,bytecode,account) =>{
  try {
    contractClone = await new provider.eth.Contract(JSON.parse(interface))
    .deploy({data:'0x' + bytecode})
    .send({
      from:account,
      gas:'1000000'});
      return contractClone;
  }
  catch(err){
    throw err;
  }
}

app.post('/IdentityTest',function(req,res){

  var set = async() => {
    try{
            let blockchainDataName = JSON.stringify(req.body.data.name);
            let blockchainDataSurname = JSON.stringify(req.body.data.surname);
            let blockchainDataIdentity = JSON.stringify(req.body.data.identity);
            let contractAddressFromClient = JSON.stringify(req.body.address);
            contractAddressFromClient = helper.cleanWhiteCharacter(contractAddressFromClient);
            blockchainDataName = helper.cleanWhiteCharacter(blockchainDataName);
            blockchainDataSurname = helper.cleanWhiteCharacter(blockchainDataSurname);
            blockchainDataIdentity = helper.cleanWhiteCharacter(blockchainDataIdentity);
            var hashedData = helper.sha256Hash(blockchainDataIdentity);
            bytes = [];    


            var data = helper.byteConversion(blockchainDataIdentity);      
         

            try{
      
                hashTransactionOfSetMethod = "09232";
                key = ["account","data_hash","transaction_hash"];
                value = [accounts[0],hashedData,hashTransactionOfSetMethod];
                rawResponseObject = responseMaker.createResponse(key,value);     
                response = responseMaker.responseMaker(rawResponseObject);
                res.send(response);                  
            } 
            catch(err){
                errorCode = requestTypeError.identity_transactional_hash;
                errorMessage =  helper.error(errorCode,err);
                response = responseMaker.responseErrorMaker(errorCode,errorMessage);
                res.send(response);
            }
                       
    }
    catch(err)
    {
      errorCode = requestTypeError.identity;
      errorMessage = helper.error(errorCode,err);
      response = responseMaker.responseErrorMaker(errorCode,errorMessage);
      res.send(response);
    }
  }
  set();    
});

/*Veriyi blockchain'e göndermek için rest api url
*Çağırım : http://ip:port/Identity
*input :{
            "data":"......",
            "address":"deploy edilen contract adresi"
        }
*output: blockchain verisinin hash değeri ve blockchaine atılan transaciton hash değeri*/
app.post('/Identity',function(req,res){

    var set = async() => {
      try{
              let blockchainDataName = JSON.stringify(req.body.data.name);
              let blockchainDataSurname = JSON.stringify(req.body.data.surname);
              let blockchainDataIdentity = JSON.stringify(req.body.data.identity);
              let contractAddressFromClient = JSON.stringify(req.body.address);
              contractAddressFromClient = helper.cleanWhiteCharacter(contractAddressFromClient);
              blockchainDataName = helper.cleanWhiteCharacter(blockchainDataName);
              blockchainDataSurname = helper.cleanWhiteCharacter(blockchainDataSurname);
              blockchainDataIdentity = helper.cleanWhiteCharacter(blockchainDataIdentity);
              var hashedData= helper.sha256Hash(blockchainDataIdentity,blockchainDataName,blockchainDataSurname);  
                 
              bytes = [];    

              accounts = await web3.eth.getAccounts();
              if(contractInstance === undefined || contractInstance === null)
              {
                 contractInstance = await new web3.eth.Contract(JSON.parse(interface),contractAddressFromClient);
              }     
              var data = helper.byteConversion(blockchainDataIdentity);      
              console.log(data);
              console.log("baslıyoruz");   
              try{
             
                

                    await contractInstance.methods.setIdentity(hashedData,blockchainDataName,blockchainDataSurname,data).
                    send({
                      from:accounts[0],
                      gas:'100000000'
                    },function (err, result){
                        if(!err){
                          
                          console.log(result);   
                          hashTransactionOfSetMethod = result;      
                        } 
                        else{
                          hashTransactionOfSetMethod = "";
                          errorCode = requestTypeError.identity;
                          errorMessage = helper.error(errorCode,err);
                          response = responseMaker.responseErrorMaker(errorCode,errorMessage);
                          res.send(response);
                        }
                      });



                  key = ["account","data_hash","transaction_hash"];
                  console.log("identity:");
                  console.log(data);
                  console.log("hash");
                  console.log(hashedData);
                  value = [accounts[0],hashedData,hashTransactionOfSetMethod];
                  rawResponseObject = responseMaker.createResponse(key,value);     
                  response = responseMaker.responseMaker(rawResponseObject);
                  res.send(response);                  
              } 
              catch(err){
                  errorCode = requestTypeError.identity_transactional_hash;
                  errorMessage =  helper.error(errorCode,err);
                  response = responseMaker.responseErrorMaker(errorCode,errorMessage);
                  res.send(response);
              }
                         
      }
      catch(err)
      {
        errorCode = requestTypeError.identity;
        errorMessage = helper.error(errorCode,err);
        response = responseMaker.responseErrorMaker(errorCode,errorMessage);
        res.send(response);
      }
    }
    set();    
});



app.post('/HashGetTest',function(req,res){

  var get = async () =>{

      try
        {
          let contractAddressFromClient = JSON.stringify(req.body.address);
          let hashofBlockchainData = JSON.stringify(req.body.hashofBlockchainData);
          contractAddressFromClient = helper.cleanWhiteCharacter(contractAddressFromClient);
          hashofBlockchainData = helper.cleanWhiteCharacter(hashofBlockchainData);
          
          var responseRaw = {
            name:"doga",
            surname:"ozcan",
            identity:"0x21894343"
          };
              
          key = ["data","data_hash"];
          value = [responseRaw,"0zdferer"];
          rawResponseObject = responseMaker.createResponse(key,value);
          response = responseMaker.responseMaker(rawResponseObject);
          res.send(response); 
          
        }
        catch(err)
        {
          errorCode = requestTypeError.hash_get;
          errorMessage =  helper.error(errorCode,err);
          response = responseMaker.responseErrorMaker(errorCode,errorMessage);
          res.send(response);
        }
      }
  get();
});


/*Veriyi blockchain'den almak için rest api url
*Çağırım : http://ip:port/HashGet
*input :{
            "hashofBlockchainData":"hashofBlockchainData",
            "address":"deploy edilen contract adresi"
        }
*output: blockchain orjinal veriyi geri döndürür*/
app.post('/HashGet',function(req,res){

  var get = async () =>{

      try
        {
          let contractAddressFromClient = JSON.stringify(req.body.address);
          let hashofBlockchainData = JSON.stringify(req.body.hashofBlockchainData);
          contractAddressFromClient = helper.cleanWhiteCharacter(contractAddressFromClient);
          hashofBlockchainData = helper.cleanWhiteCharacter(hashofBlockchainData);
           
          accounts = await web3.eth.getAccounts();
       
          if(contractInstance === undefined || contractInstance === null)
          {
             contractInstance = await new web3.eth.Contract(JSON.parse(interface),contractAddressFromClient);
          }
          console.log(hashofBlockchainData);
          console.log(accounts[0]);

          var respondData = await getIdentity(contractInstance,accounts[0],hashofBlockchainData);

          var name =respondData[0];
          console.log("name:" +name);
          var surname =respondData[1];
          console.log("surname:" +surname);
          var identity =respondData[2];
          console.log("identity:" +identity);


          var responseRaw = {
            name:name,
            surname:surname,
            identity:identity
          };

          key = ["data","data_hash"];
          value = [responseRaw,hashofBlockchainData];
          rawResponseObject = responseMaker.createResponse(key,value);
          response = responseMaker.responseMaker(rawResponseObject);
          res.send(response); 
          
        }
        catch(err)
        {
          errorCode = requestTypeError.hash_get;
          errorMessage =  helper.error(errorCode,err);
          response = responseMaker.responseErrorMaker(errorCode,errorMessage);
          res.send(response);
        }
      }
  get();
});

const getIdentity = async(contractClone,account,hash)=>{
  try{
    var data = await contractClone.methods.getIdentity(hash).call({from:account})
    return data;
  }
  catch(err){
    throw (err);
  }
}

module.exports = {
  AccountCreate,
  DeployContract,
  getIdentity
}

app.listen(6000,()=>{
  console.log(6000+" portu dinleniyor");
});
