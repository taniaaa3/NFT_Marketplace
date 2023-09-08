import React, { useEffect, useState } from 'react'
import image from '../image.png';
import ABI from '../contracts/abi.json';
const ethers = require('ethers');
const contractAddress = '0xaB68E81E78DCc169188991F08957cFB765d9C7a9';
const provider = new ethers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/ND3nOB_zcdD59fsBUHcFV05UI86kfjP6');
const contract = new ethers.Contract(contractAddress, ABI, provider);
const {ethereum} = window;


const Owned = ({address, OwnedNFTs, nfts}) => {
  // const [data,setData] = useState([nfts]);
  const [price, setPrice] = useState();
  // const provider = new ethers.providers.JsonRpcProvider()
  useEffect(()=>{
    OwnedNFTs();
    console.log(nfts);
    // fetchData();
  }
    )
    const liftNFTs = async(Id,pri)=>{
      const signer = await new ethers.BrowserProvider(ethereum).getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        let p = prompt('Set the price of the nft');
        setPrice(Number(p));
        await contract.listNFT(Id,pri);
        // console.log(await new ethers.formatEther(price));
        document.querySelector(`nft${Id}`).innerHTML='Cancel';
    }
    // const fun = async(token,pri)=>{
      
    //   await listNFTs(token,pri);
    // }

    







  return (
    <div className='sm:grid flex flex-col items-center sm:items-start sm:grid-cols-2 md:grid-cols-3 w-full h-screen'>
      {nfts.map((val)=>{
        return(
      <div className='flex flex-col text-white items-start justify-evenly rounded-lg border-[#003f30] border-2 h-96 blue-glassmorphism w-64 m-5'>
        <img src={image} alt="img" className='h-[65%] w-full rounded-t-lg overflow-hidden'/>
        <h1 className='font-bold m-2'>NFT {val.tokenId}</h1>
        <p className='m-1'>TokenId: {val.tokenId}</p>
        <p className='m-1'>{address}</p>
        <button className={`self-center bg-[#003f30] nft${val.tokenId} text-white text-bold mx-5 m-1 mt-2 rounded-full w-5/6`} onClick={async()=>{
         liftNFTs(val.tokenId,price)
        }}>Sell</button>
    </div>
        )
    })}
    </div>
  )
}

export default Owned