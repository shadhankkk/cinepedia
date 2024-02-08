import { useEffect, useState, createContext } from "react";
import axios from 'axios';
import bcrypt from 'bcryptjs'

export const Signup = () => {
  let [username, setUsername] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');

  const UserInput = () => {
    return(
      <input onChange={(event) => {username = event.target.value}} className="w-[400px] rounded-[20px] bg-black outline outline-yellow-400 p-[10px] px-[15px] text-yellow-400" placeholder="Username" type="text" maxLength={16}></input>
    );
  }

  const EmailInput = () => {
    return(
      <input onChange={(event) => {email = event.target.value}} className="w-[400px] rounded-[20px] bg-black outline outline-yellow-400 p-[10px] px-[15px] text-yellow-400" placeholder="Email" type="email"></input>
    );
  }

  const PasswordInput = () => {
    return(
      <input onChange={(event) => {password = event.target.value}} className="w-[400px] rounded-[20px] bg-black outline outline-yellow-400 p-[10px] px-[15px] text-yellow-400" placeholder="Password" type="password"></input>
    );
  }

  const submitButton = async() => {
    const userAPIClient = 'http://127.0.0.1:8000/users/'
    const emailAPIClient = 'http://127.0.0.1:8000/email/'
    setUsername(username);
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if(username == '' || email == '' || password == '') {
      alert('All fields must be filled!');
      return;
    }

    if(format.test(username)) {
      alert('Username cannot contain special characters!');
      return;
    }

    if(username.length < 8) {
      alert('Username must be atleast 8 characters long!');
      return;
    }

    if(!email.includes('@gmail')) {
      alert('We only accept Gmail!');
      return;
    }

    if(password.length < 8) {
      alert('Password must be atleast 8 characters long!');
      return;
    }
    
    try {
      let fetchUser = await axios.request(userAPIClient + username);
      alert("Username taken!");
      setUsername('');
      setEmail('');
      setPassword('');
      return;
    } catch {
      
    }
  
    setEmail(email);
    try {
      let fetchUserByEmail = await axios.request(emailAPIClient + email);
      alert("Email already in use!");
      setUsername('');
      setEmail('');
      setPassword('');
      return;
    } catch {
      
    }

    password = bcrypt.hashSync(password, 1);
    setPassword(password);

    class User { 
      constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
      }
    }

    let user = {username: username, email: email, password: password};
    let userJSON = JSON.stringify(user);
    let idk = '';

    fetch("http://127.0.0.1:8000/users/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
    )
    .then(res => res.data)
    .catch((error) => console.error(error));

    setUsername('');
    setEmail('');
    setPassword('');
  }

  return(
    <div className="flex justify-center">
      <div className="flex flex-col items-center w-[800px] h-[680px] mt-[100px] rounded-[50px] bg-black bg-opacity-60">
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
            <h1 className="text-yellow-400 text-[50px]">Email</h1>
          </div>
          <div>
            <EmailInput />
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
          <button onClick={ () => submitButton() } className="bg-black w-[150px] p-[8px] outline outline-yellow-400 rounded-[20px] text-yellow-400 mt-[50px] text-[30px] hover:opacity-50">
            Register
          </button>
        </div>

        <div className="mt-[20px]">
          <h1 className="text-[14px] text-gray-400">
            Already have an account? &nbsp;
            <a href='../login' className="text-yellow-500 cursor-pointer hover:opacity-60">
              Log In!
            </a>
          </h1>
        </div>

      </div>
    </div>
  );
}