package handler

import (
	"context"
	"fmt"
	"bytes"
	"math/big"
	"os"
	"crypto/ecdsa"
	"net/http"
	"strconv"
	"github.com/cliclitv/go-clicli/db"
	"github.com/julienschmidt/httprouter"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/core/types"
)


var (
	client, _ = ethclient.Dial(BscTestNet)
	ContractCdd   = "0xD29F60b227aeb700431C97F256dEBe23E17C8956"
	BscTestNet    = "https://eth-goerli.public.blastapi.io"
	abiData = []byte(`[
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

func CallContractWithAbi(client *ethclient.Client, privKey *ecdsa.PrivateKey, from, to common.Address, contract string) (string, error) {
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
	if err != nil {
		fmt.Println("read file: ", err)
		return "", err
	}
	contractABI, err := abi.JSON(bytes.NewReader(abiData))
	if err != nil {
		fmt.Println("abi json: ", err)
		return "", err
	}
	amount, _ := new(big.Int).SetString("1000000", 10) //1
	callData, err := contractABI.Pack("transfer", from, to, amount)
	if err != nil {
		fmt.Println("abi pack: ", err)
		return "", err
	}
	tx := types.NewTransaction(nonce, common.HexToAddress(contract), big.NewInt(0), uint64(300000), gasPrice, callData)
	// sign tx
	signedTx, err := types.SignTx(tx, types.NewEIP155Signer(big.NewInt(5)), privKey)
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

func Transfer(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	from, _ := strconv.Atoi(r.URL.Query().Get("from"))
	to, _ := strconv.Atoi(r.URL.Query().Get("to"))

	userFrom, err := db.GetUser("", from, "")
	userTo, err := db.GetUser("", to, "")

	PrivateKey, _ := crypto.HexToECDSA(userFrom.Desc)
	FromAddr      := common.HexToAddress(userFrom.Hash)
	ToAddr        := common.HexToAddress(userTo.Hash)


	if err != nil {
		fmt.Println("eth client: ", err)
		os.Exit(1)
	}

	txHash, err := CallContractWithAbi(client, PrivateKey, FromAddr, ToAddr, ContractCdd)
	if err != nil {
		os.Exit(1)
	}
	fmt.Println("tx hash: ", txHash)
	sendMsg(w, 200, txHash)
}