const { interface, bytecode } = require('./compile.js');
const helper = require('./helper.js');
const responseMaker = require('./responseMaker.js');
const requestTypeError = require('./enum.js');
const Web3 = require('web3');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const solc = require('solc');

var requestUrl = "http://18.236.226.143:8545";
// default rpc port 8545, ikinci container portuna dönüştürülebilinir.
var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/6e32e89d0e2349748b38e1ca7aa46a7c"));
var express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json({ limit: 1024 * 1024 * 1024, type: 'application/json' }));

let account;
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
var value;

app.get('/test', function (req, res) {

    var create = async () => {
        try {
            console.log("basladık");
            key = ["account", "key"];
            value = ["sdfsdfs", "wewe"];
            rawResponseObject = responseMaker.createResponse(key, value);
            response = responseMaker.responseMaker(rawResponseObject);
            res.send(response);
        }
        catch (err) {
            errorCode = requestTypeError.account_create;
            errorMessage = helper.error(errorCode, err);
            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
            res.send(response);
        }
    }
    create();
});

/*Account yaratmak için rest api url
*Çağırım : http://ip:port/AccountCreate
*input : yok
*output: account adresi, privateKey*/
app.get('/AccountCreate', function (req, res) {

    var create = async () => {
        try {
            console.log("basladık");
            account = await AccountCreate(web3);
            console.log("yaratılan account :" + account.address);
            console.log("private key :" + account.privateKey);

            key = ["account", "key"];
            value = [account.address, account.privateKey];
            rawResponseObject = responseMaker.createResponse(key, value);
            response = responseMaker.responseMaker(rawResponseObject);
            res.send(response);
        }
        catch (err) {
            errorCode = requestTypeError.account_create;
            errorMessage = helper.error(errorCode, err);
            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
            res.send(response);
        }
    }
    create();
});

const AccountCreate = async (provider) => {
    try {
        return await provider.eth.accounts.create();
    }
    catch (err) {
        throw err;
    }
}

/*Contract deploy etmek için rest api url
*Çağırım : http://ip:port/DeployContract
*input : yok
*output: contract adresi,account,bakiye,mining durumu,gas değeri,blok sayısı*/
app.get('/DeployContract', function (req, res) {

    var deploy = async () => {
        try {

            //await AccountCreate(web3);
            let _account = await provider.eth.accounts.create();
            /*balance = await web3.eth.getBalance(accounts[0]);
            miningBool = await web3.eth.isMining();
            hashRate = await web3.eth.getHashrate();
            gasPrice = await web3.eth.getGasPrice();
            currentBlock = await web3.eth.getBlockNumber();
            console.log("account adresi: " + accounts[0]);
            console.log("account bakiyesi: " + balance);
            */
            console.log(_account);
            contractInstance = await DeployContract(web3, interface, bytecode, _account);
            contractAddress = contractInstance.options.address;
            console.log("akıllı sözleşme adresi :" + contractAddress);

            key = ["account" ];
            value = [_account];
            rawResponseObject = responseMaker.createResponse(key, value);
            response = responseMaker.responseMaker(rawResponseObject);
            res.send(response);
        }

        catch (err) {
            errorCode = requestTypeError.contract_deploy;
            errorMessage = helper.error(errorCode, err);
            console.log(errorCode);
            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
            res.send(response);
        }
    }
    deploy();
});

const DeployContract = async (provider, interface, bytecode, account) => {
    try {
        contractClone = await new provider.eth.Contract(JSON.parse(interface))
            .deploy({ data: '0x' + bytecode })
            .send({
                from: account,
                gas: '1000000'
            });
        return contractClone;
    }
    catch (err) {
        throw err;
    }
}

/*Veriyi blockchain'e göndermek için rest api url
*Çağırım : http://ip:port/Identity
*input :{
            "data":"......",
            "address":"deploy edilen contract adresi"
        }
*output: blockchain verisinin hash değeri ve blockchaine atılan transaciton hash değeri*/
app.post('/yeniTarla', function (req, res) {

    var set = async () => {
        try {
            let enlem = JSON.stringify(req.body.enlem);
            let boylam = JSON.stringify(req.body.boylam);
            let urunTipi = JSON.stringify(req.body.urunTipi);
            let sahipTckn = JSON.stringify(req.body.KisiTckn);
            let sahipAd = JSON.stringify(req.body.KisiAd);
            let sahipSoyad = JSON.stringify(req.body.KisiSoyad);
            
            enlem = helper.cleanWhiteCharacter(enlem);
            boylam = helper.cleanWhiteCharacter(boylam);
            urunTipi = helper.cleanWhiteCharacter(urunTipi);
            sahipTckn = helper.cleanWhiteCharacter(sahipTckn);
            sahipAd = helper.cleanWhiteCharacter(sahipAd);
            sahipSoyad = helper.cleanWhiteCharacter(sahipSoyad);
            accounts = await web3.eth.getAccounts();
            if (contractInstance === undefined || contractInstance === null) {
                contractInstance = await new web3.eth.Contract(JSON.parse(interface), contractAddressFromClient);
            }
            try {

                await contractInstance.methods.setNewTarla(
                    Web3.utils.stringToHex(enlem),
                    Web3.utils.stringToHex(boylam),
                    Web3.utils.stringToHex(urunTipi),
                    Web3.utils.stringToHex(sahipTckn),
                    Web3.utils.stringToHex(sahipAd),
                    Web3.utils.stringToHex(sahipSoyad)
                ).
                    send({
                        from: accounts[0],
                        gas: '100000000'
                    }, function (err, result) {
                        if (!err) {
                            hashTransactionOfSetMethod = result;
                        }
                        else {
                            hashTransactionOfSetMethod = "";
                            errorCode = requestTypeError.identity;
                            errorMessage = helper.error(errorCode, err);
                            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
                            res.send(response);
                        }
                    });



                key = ["account", "yeni tarla", "tarla işlem id"];
                value = [accounts[0], "yaratıldı", hashTransactionOfSetMethod];
                rawResponseObject = responseMaker.createResponse(key, value);
                response = responseMaker.responseMaker(rawResponseObject);
                res.send(response);
            }
            catch (err) {
                errorCode = requestTypeError.identity_transactional_hash;
                errorMessage = helper.error(errorCode, err);
                response = responseMaker.responseErrorMaker(errorCode, errorMessage);
                res.send(response);
            }

        }
        catch (err) {
            errorCode = requestTypeError.identity;
            errorMessage = helper.error(errorCode, err);
            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
            res.send(response);
        }
    }
    set();
});


app.post('/yeniPolice ', function (req, res) {

    var set = async () => {
        try {
            let acente = JSON.stringify(req.body.acente);
            let sigortaBaslangic = JSON.stringify(req.body.sigortaBaslangic);
            let sigortaBitis = JSON.stringify(req.body.sigortaBitis);
            let sigortaTur = JSON.stringify(req.body.sigortaTur);
            let sigortaTutar = JSON.stringify(req.body.sigortaTutar);
            let tckn = JSON.stringify(req.body.tckn);
            
            acente = helper.cleanWhiteCharacter(acente);
            sigortaBaslangic = helper.cleanWhiteCharacter(sigortaBaslangic);
            sigortaBitis = helper.cleanWhiteCharacter(sigortaBitis);
            sigortaTur = helper.cleanWhiteCharacter(sigortaTur);
            sigortaTutar = helper.cleanWhiteCharacter(sigortaTutar);
            tckn = helper.cleanWhiteCharacter(tckn);
            accounts = await web3.eth.getAccounts();
            if (contractInstance === undefined || contractInstance === null) {
                contractInstance = await new web3.eth.Contract(JSON.parse(interface), contractAddressFromClient);
            }
            try {

                await contractInstance.methods.setNewPolice(
                    Web3.utils.stringToHex(acente),
                    Web3.utils.stringToHex(sigortaBaslangic),
                    Web3.utils.stringToHex(sigortaBitis),
                    Web3.utils.stringToHex(sigortaTur),
                    Web3.utils.stringToHex(sigortaTutar),
                    Web3.utils.stringToHex(tckn)
                ).
                    send({
                        from: accounts[0],
                        gas: '100000000'
                    }, function (err, result) {
                        if (!err) {
                            hashTransactionOfSetMethod = result;
                        }
                        else {
                            hashTransactionOfSetMethod = "";
                            errorCode = requestTypeError.identity;
                            errorMessage = helper.error(errorCode, err);
                            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
                            res.send(response);
                        }
                    });



                key = ["account", "yeni police", "police tekil id"];
                value = [accounts[0], "yaratıldı", hashTransactionOfSetMethod];
                rawResponseObject = responseMaker.createResponse(key, value);
                response = responseMaker.responseMaker(rawResponseObject);
                res.send(response);
            }
            catch (err) {
                errorCode = requestTypeError.identity_transactional_hash;
                errorMessage = helper.error(errorCode, err);
                response = responseMaker.responseErrorMaker(errorCode, errorMessage);
                res.send(response);
            }

        }
        catch (err) {
            errorCode = requestTypeError.identity;
            errorMessage = helper.error(errorCode, err);
            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
            res.send(response);
        }
    }
    set();
});


/*Veriyi blockchain'den almak için rest api url
*Çağırım : http://ip:port/HashGet
*input :{
            "hashofBlockchainData":"hashofBlockchainData",
            "address":"deploy edilen contract adresi"
        }
*output: blockchain orjinal veriyi geri döndürür*/
app.get('/yeniTarla', function (req, res) {

    var get = async () => {

        try {
         
            let tarlaId = JSON.stringify(req.body.tarlaId);
            tarlaId = helper.cleanWhiteCharacter(tarlaId);

            accounts = await web3.eth.getAccounts();

            if (contractInstance === undefined || contractInstance === null) {
                contractInstance = await new web3.eth.Contract(JSON.parse(interface), contractAddressFromClient);
            }

            var respondData = await getCreatedTarla(contractInstance, accounts[0], tarlaId);

            var urunTipi = Web3.utils.hexToString(respondData[0]);
            var sahipTckn = Web3.utils.hexToString(respondData[1]);

            var responseRaw = {
                urunTipi: urunTipi,
                sahipTckn: sahipTckn
            };

            key = ["tarla bilgileri", "tarla işlem id"];
            value = [responseRaw, tarlaId];
            rawResponseObject = responseMaker.createResponse(key, value);
            response = responseMaker.responseMaker(rawResponseObject);
            res.send(response);

        }
        catch (err) {
            errorCode = requestTypeError.hash_get;
            errorMessage = helper.error(errorCode, err);
            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
            res.send(response);
        }
    }
    get();
});

app.get('/yeniPolice', function (req, res) {

    var get = async () => {

        try {
         
            let policeId = JSON.stringify(req.body.policeId);
            policeId = helper.cleanWhiteCharacter(policeId);

            accounts = await web3.eth.getAccounts();

            if (contractInstance === undefined || contractInstance === null) {
                contractInstance = await new web3.eth.Contract(JSON.parse(interface), contractAddressFromClient);
            }

            var respondData = await getCreatedPolice(contractInstance, accounts[0], policeId);

            var acente = Web3.utils.hexToString(respondData[0]);
            var sigortaBaslangic = Web3.utils.hexToString(respondData[1]);
            var sigortaBitis = Web3.utils.hexToString(respondData[2]);
            var sigortaTur = Web3.utils.hexToString(respondData[3]);
            var sigortaTutar = Web3.utils.hexToString(respondData[4]);
            var tckn = Web3.utils.hexToString(respondData[5]);

            var responseRaw = {
                acente: acente,
                sigortaBaslangic: sigortaBaslangic,
                sigortaBitis:sigortaBitis,
                sigortaTur:sigortaTur,
                sigortaTutar:sigortaTutar,
                tckn:tckn
            };

            key = ["poliçe bilgileri", "poliçe işlem id"];
            value = [responseRaw, policeId];
            rawResponseObject = responseMaker.createResponse(key, value);
            response = responseMaker.responseMaker(rawResponseObject);
            res.send(response);

        }
        catch (err) {
            errorCode = requestTypeError.hash_get;
            errorMessage = helper.error(errorCode, err);
            response = responseMaker.responseErrorMaker(errorCode, errorMessage);
            res.send(response);
        }
    }
    get();
});

const getCreatedTarla = async (contractClone, account, tarlaId) => {
    try {
        var data = await contractClone.methods.getCreatedTarla(tarlaId).call({ from: account })
        return data;
    }
    catch (err) {
        throw (err);
    }
}

const getCreatedPolice = async (contractClone, account, policeId) => {
    try {
        var data = await contractClone.methods.getCreatedPolice(policeId).call({ from: account })
        return data;
    }
    catch (err) {
        throw (err);
    }
}


module.exports = {
    AccountCreate,
    DeployContract,
    getCreatedTarla,
    getCreatedPolice
}

app.listen(6000, () => {
    console.log(6000 + " portu dinleniyor");
});
