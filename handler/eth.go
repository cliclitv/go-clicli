package handler

import (
	"bytes"
	"context"
	"crypto/ecdsa"
	"fmt"
	"github.com/cliclitv/go-clicli/db"
	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/julienschmidt/httprouter"
	"math/big"
	"net/http"
	"strconv"
)

// PrivateKey, _ = crypto.HexToECDSA("17f41c6ceb2fddf34aa939dd670a361fbef7b54c87649648bc9c72c3ac98ed72")
// FromAddr      = common.HexToAddress("0x53a02a83e2aC5AA3C1A81C6cF2Eb50F4a0aBEFe4")
// ToAddr        = common.HexToAddress("0x899B0FEA11D83C25eD3192c541B8c54913BB3DF3")
// ContractCdd   = common.HexToAddress("0xf3748a0483cF266354A111594850723b61FB9613")
// BscTestNet    = "https://rpc.sepolia.org"

var (
	client, _      = ethclient.Dial(BscTestNet)
	contractABI, _ = abi.JSON(bytes.NewReader(abiData))
	ContractCdd    = common.HexToAddress("0xf3748a0483cF266354A111594850723b61FB9613")
	BscTestNet     = "https://rpc.sepolia.org"
	ChainId        = big.NewInt(11155111)
	abiData        = []byte(`[
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "from",
					"type": "address"
				},
				{
					"internalType": "address",
					"name": "to",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "transfer",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "total",
					"type": "uint256"
				}
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "decimals",
			"outputs": [
				{
					"internalType": "uint8",
					"name": "",
					"type": "uint8"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "name",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "symbol",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "totalSupply",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]`)
)

func CallContractWithAbi(privKey *ecdsa.PrivateKey, from, to, contract common.Address) (string, error) {
	// create tx
	nonce, err := client.NonceAt(context.Background(), from, nil)
	if err != nil {
		fmt.Println("get nonce: ", err)
		return "", err
	}
	gasPrice, err := client.SuggestGasPrice(context.Background())
	if err != nil {
		fmt.Println("gas price: ", err)
		return "", err
	}
	amount, _ := new(big.Int).SetString("1000000", 10) //1
	callData, err := contractABI.Pack("transfer", from, to, amount)
	if err != nil {
		fmt.Println("abi pack: ", err)
		return "", err
	}
	tx := types.NewTransaction(nonce, contract, big.NewInt(0), uint64(300000), gasPrice, callData)
	// sign tx
	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(ChainId), privKey)
	if err != nil {
		fmt.Println("sign tx: ", err)
		return "", err
	}
	// send tx
	err = client.SendTransaction(context.Background(), signedTx)
	if err != nil {
		fmt.Println("send tx: ", err)
		return "", err
	}
	return signedTx.Hash().Hex(), nil
}

func BalanceWithABI(from, to common.Address) (*big.Int, error) {

	input, err := contractABI.Pack(
		"balanceOf",
		from,
	)
	if err != nil {
		return nil, err
	}
	msg := ethereum.CallMsg{
		From:  from,
		To:    &to,
		Value: nil,
		Data:  input,
	}
	out, err := client.CallContract(context.Background(), msg, nil)
	if err != nil {
		return nil, err
	}
	res, err := contractABI.Unpack("balanceOf", out)
	if err != nil {
		return nil, err
	}
	if len(res) != 1 {
		return nil, fmt.Errorf("error call res")
	}
	out0, ok := res[0].(*big.Int)
	if !ok {
		return nil, fmt.Errorf("error call res")
	}
	return out0, nil
}

func Transfer(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	from, _ := strconv.Atoi(r.URL.Query().Get("from"))
	to, _ := strconv.Atoi(r.URL.Query().Get("to"))

	userFrom, err := db.GetUser("", from, "")
	userTo, err := db.GetUser("", to, "")

	PrivateKey, _ := crypto.HexToECDSA(userFrom.Desc)
	FromAddr := common.HexToAddress(userFrom.Hash)
	ToAddr := common.HexToAddress(userTo.Hash)

	txHash, err := CallContractWithAbi(PrivateKey, FromAddr, ToAddr, ContractCdd)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
	}
	fmt.Println("tx hash: ", txHash)
	sendMsg(w, 200, txHash)
}

func BalanceOf(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	from, _ := strconv.Atoi(r.URL.Query().Get("from"))

	userFrom, err := db.GetUser("", from, "")

	FromAddr := common.HexToAddress(userFrom.Hash)

	txHash, err := BalanceWithABI(FromAddr, ContractCdd)
	if err != nil {
		sendMsg(w, 500, fmt.Sprintf("%s", err))
	}
	fmt.Println("tx hash: ", txHash)
	sendMsg(w, 200, txHash.String())
}
