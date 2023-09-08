import React, { useState, useEffect } from 'react'
import "./App.css";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import Home from './components/home';
import Owned from './components/owned';
import Create from './components/create';
import ABI from './contracts/abi.json';
import Navbar from './components/navbar';
import { gql } from '@apollo/client';
const ethers = require('ethers');
const contractAddress = '0xaB68E81E78DCc169188991F08957cFB765d9C7a9';
const endPoint = 'https://api.studio.thegraph.com/query/52218/nft-marketplace/v0.0.2';
const httpLink = createHttpLink({uri: endPoint});
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache
})

const {ethereum} = window;

const App = () => {
  const[fullAdd, setFullAdd] = useState();
  const[address,setAddress] = useState();
  const[nfts, setNfts] = useState([{}]);
  const connectWallet = async() => {
  
  
      if(!ethereum.isConnected){
          await ethereum.request({
              method: "wallet_requestPermissions",
              params: [{
                  eth_accounts: ""
              }]
          });
          const accounts = await ethereum.request({
              method: "eth_requestAccounts"
          });
          setFullAdd(accounts[0]);
          document.querySelector('.login').innerHTML = `${accounts[0].slice(0,6)}...${accounts[0].slice(36,42)}`;
          setAddress(`${accounts[0].slice(0,6)}...${accounts[0].slice(36,42)}`);
      }
      else if(ethereum.isConnected){
          const accounts = await ethereum.request({
              method: "eth_requestAccounts"
          });
          setFullAdd(accounts[0]);
          document.querySelector('.login').innerHTML = `${accounts[0].slice(0,6)}...${accounts[0].slice(36,42)}`;
          setAddress(`${accounts[0].slice(0,6)}...${accounts[0].slice(36,42)}`);
      }
      else{
          alert('Install Metamask');
      }
      
  }

  const OwnedNFTs = async()=>{
    try {
    const get_nft_data = gql`
    query{
      nfttransfers(first: 5) {
        id
        tokenId
        from
        to
        tokenURI
      }
    }
    `;
    client.query({
      query: get_nft_data,}).then((result)=>{
      const nfts = result.data.nfttransfers;
      setNfts(nfts);
    })
  } catch (error) {
      console.log(error);
  }
  }

  //liftNFTs function

  
       

  return (
    <BrowserRouter>
    <Navbar connectWallet={connectWallet}/>
    <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/owned' element={<Owned address={address} OwnedNFTs={OwnedNFTs} nfts={nfts}/>}/>
    <Route path='/create' element={<Create/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App