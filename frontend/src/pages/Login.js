import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import bcrypt from 'bcryptjs'
import { AppContext } from "../App";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  let { currUser, setCurrUser, userPk, setUserPk, watchlist, setWatchlist } = useContext(AppContext);
  let username = '';
  let password = '';

  const UserInput = () => {
    return(
      <input onChange={(event) => {username=event.target.value}} className="w-[400px] rounded-[20px] bg-black outline outline-yellow-400 p-[10px] px-[15px] text-yellow-400" placeholder="Username" type="text" maxLength={16}></input>
    );
  }

  const PasswordInput = () => {
    return(
      <input onChange={(event) => {password=event.target.value}} className="w-[400px] rounded-[20px] bg-black outline outline-yellow-400 p-[10px] px-[15px] text-yellow-400" placeholder="Password" type="password"></input>
    );
  }

  const verifyInfo = async() => {
    if(username=='') {
      alert('Fill in your username!');
      return;
    }
    const userAPIClient = 'http://127.0.0.1:8000/users/';
    let user = '';
    try {
      user = await axios.request(userAPIClient + username);
    } catch (error) {
      console.log(error);
      alert('Username not found')
      return;
    }
    // get user from DB, if username not found throw error
    
    let hashedPass = user.data.password;
    // get user's hashedPass from DB
    if(await bcrypt.compare(password, hashedPass)) {
      // set global user as userId of user from DB, and start user session on website. make userId as gloabl state in appJS 
      // and use appcontext to share that userId throughout page. userId can be used to get all user info from DB
      setCurrUser(user.data.username);
      setUserPk(user.data.pk);
      setWatchlist(user.data.watchlist.map(x => x.movieId));
      navigate('/profile')
    } else {
      // throw error saying wrong password
      alert('failed to login!');
    }
  }

  return(
    <div className="flex justify-center">
      <div className="flex flex-col items-center w-[800px] h-[525px] mt-[100px] rounded-[50px] bg-black bg-opacity-60">
        <div className="flex flex-col">
          <div>
            <h1 className="text-yellow-400 text-[50px] mt-[50px]">Username</h1>
          </div>
          <div>
            <UserInput />
          </div>
        </div>

        <div className="flex flex-col mt-[50px]">
          <div>
            <h1 className="text-yellow-400 text-[50px]">Password</h1>
          </div>
          <div>
            <PasswordInput />
          </div>
        </div>

        <div>
          <button onClick={() => verifyInfo()}className="bg-black w-[150px] p-[8px] outline outline-yellow-400 rounded-[20px] text-yellow-400 mt-[50px] text-[30px] hover:opacity-60">Log In</button>
        </div>

        <div className="mt-[20px]">
          <h1 className="text-[14px] text-gray-400">Don't have an account? <a href='../signup' className="text-yellow-500 cursor-pointer hover:opacity-60">Sign Up!</a></h1>
        </div>

      </div>
    </div>
  );
}