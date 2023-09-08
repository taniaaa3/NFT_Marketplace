import React, { useEffect, useState } from 'react'
import {BiUserCircle} from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { AiOutlineClose} from 'react-icons/ai';
import { CgMenuOreos } from 'react-icons/cg'
const {ethereum} = window;
const ethers = require('ethers');

const Navbar = ({connectWallet}) => {
    const [toggleMenu, setToggleMenu] = useState(false);
    ethereum.on('accountsChanged',async()=>{
        const accounts = await ethereum.request({
            method: "eth_requestAccounts"
        });
        document.querySelector('.login').innerHTML = `${accounts[0].slice(0,6)}...${accounts[0].slice(36,42)}`;
    })
  return (
    <div className='flex flex-row m-5 items-center justify-between'>
        {toggleMenu?
                <AiOutlineClose size={35} className='mr-3 cursor-pointer sm:hidden' onClick={()=>{setToggleMenu(false)}}/> : 
                <CgMenuOreos size={35} className='mr-3 cursor-pointer sm:hidden' onClick={()=>{setToggleMenu(true)}}/>}
                
                {
                    toggleMenu && 
                    <ul className="flex flex-col list-none justify-start shadow-2xl z-10 items-left blue-glassmorphism w-[50vw] h-screen fixed -left-2 top-2 p-5 text-white">
                    <li><AiOutlineClose size={35} className=' cursor-pointer' onClick={()=>{setToggleMenu(false)}}/></li>
                    <ul className='flex flex-col justify-evenly mt-5 items-end'>
                        <Link to='/' className='mx-3 my-2 p-2'><a href="" className='mx-3 my-2 p-2 text-lg transition-all ease-in duration-300 text-white hover:text-teal-300 cursor-pointer'>Home</a></Link>
            <Link to='/owned' className='mx-3 my-2 p-2'><a href="" className='mx-3 my-2 p-2 text-lg transition-all ease-in duration-300 text-white hover:text-teal-300 cursor-pointer'>Owned</a></Link>
            <Link to='/create' className='mx-3 my-2 p-2'><a href="" className='mx-3 my-2 p-2 text-lg transition-all ease-in duration-300 text-white hover:text-teal-300 cursor-pointer'>Create</a></Link>
                    </ul>
                    </ul>
                    
                }
        <h1 className='text-2xl font-bold md:text-2xl sm:text-xl'>NFT Marketplace</h1>
        <div className="sm:flex sm:flex-row hidden px-2 py-3 blue-glassmorphism">
            <Link to='/'><a href="" className='mx-3 hover:text-teal-300 md:text-xl sm:text-md'>Home</a></Link>
            <Link to='/owned'><a href="" className='mx-3 hover:text-teal-300 md:text-xl sm:text-md'>Owned</a></Link>
            <Link to='/create'><a href="" className='mx-3 hover:text-teal-300 md:text-xl sm:text-md'>Create</a></Link>
        </div>
        <div onClick={()=>connectWallet()} className="flex flex-row items-center bg-[#003f30] rounded-full px-5 py-3 cursor-pointer justify-center">
        <button  className='login text-xl'>
            Login 
        </button>
        <BiUserCircle className='ml-2' size={25}/>
        </div>
    </div>
  )
}

export default Navbar