import React, { useState } from 'react'
import {NFTStorage} from 'nft.storage';
import ABI from '../contracts/abi.json';
const ethers = require('ethers');
const {ethereum} = window;
const contractAddress = '0xaB68E81E78DCc169188991F08957cFB765d9C7a9';




const Create = () => {
  const provider = new ethers.BrowserProvider(ethereum);
    const[tokenURI, setTokenURI] = useState();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState({
        name : '',
        desc : '',
        image: '',
        royalty: 0
    })

    const NFTStorage_ApiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEE0ZTY5ZEMxYmFhMjUzMDQ3YjE2OWM2NTQ5MzRFYjhlNTk0MTBjMzUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NDA3MTU2NjIyMiwibmFtZSI6Ik5GVCBNYXJrZXRwbGFjZSJ9.dWO8MsVzHhEDpbyg6a34HIMFWvPu5WwyIKCOivEwpf0';
  

    const handleChange = (e,name)=>{
      setData((prevData)=>({
        ...prevData, [name] : e
      }))
    }
     const input = document.querySelector('.input');
     input.addEventListener('change',async(e)=>{
      const file = e.target.files[0];
      if(file){
        const blob = new Blob([file], {type: file.type});
        console.log(blob);
        handleChange(blob,'image');
      }
     });
     async function storeNFT() {
      setLoader(true);
      const nft = {
        image: data.image,
        name: data.name,
        description: data.desc,
      }
    
      const client = new NFTStorage({ token: NFTStorage_ApiKey })
      const metadata = await client.store(nft)
      console.log('NFT data stored!')
      setTokenURI(metadata.url);
      console.log('Metadata URI: ', metadata.url)
      
    }

   const submit = async()=>{
    await storeNFT();
    const contract = new ethers.Contract(contractAddress, ABI, (await provider.getSigner()));
    await contract.mintNFT(tokenURI,data.royalty);
    setLoader(false);
    alert("Your NFT is minted!!! It'll show up onto the owned page in a while" );
   }


  return (
    <div className='flex flex-row m-5 h-96'>
      <div className='' >
    <button style={{backgroundSize:'cover',backgroundPosition:'center'}} className='group flex h-96 w-64 items-center justify-center rounded-xl border-[#003f30] border-2'>UPLOAD</button>
    <input type="file" accept='.jpg, .png, .jpeg' className='input' required />
    </div>
    <div className='flex flex-col items-center rounded-xl   justify-between'>
      <input type="text" placeholder='name' required className='w-64 text-black rounded-xl border-[#003f30] px-2 py-1 border border-2' onChange={(e)=>{handleChange(e.target.value, "name")}} />
      <input type="number" placeholder='Royalty(in%)' required className='w-64 text-black rounded-xl border-[#003f30] px-2 py-1 border border-2' onChange={(e)=>{handleChange(e.target.value, "royalty")}} />
    <textarea name="" id="" placeholder='description' required className='h-full text-black resize-none border border-2 border-[#003f30] w-64 rounded border mt-2 px-2 py-1' onChange={(e)=>{handleChange(e.target.value, "desc")}}></textarea>
    <button className='self-center bg-[#003f30] text-white text-bold mt-2 rounded-full w-64 px-2 py-1' onClick={()=>{submit()}}>{loader ? 'Creating...' : 'Create'}</button>
    </div>
    </div>
  )
}

export default Create