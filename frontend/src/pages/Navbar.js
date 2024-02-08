import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { AppContext } from "../App";
import searchIcon from '../search-icon.jpg';
import addedToWatchlistIcon from '../added-to-watchlist.png';
import watchlistIcon from '../watchlist-icon.png';
import defaultPfp from '../default_pfp.jpg';
import { Link } from 'react-router-dom';
import '../App.css';
import imdbLogo from '../cinescope_logo.png'
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();

  let {searchQuery, setSearchQuery, 
       watchlist, setWatchlist, 
       searchQueryFinal, setSearchQueryFinal,
       currUser, setCurrUser,
       userPk, setUserPk,
       detectUserPfpChange, setDetectUserPfpChange } = useContext(AppContext);

  let [ profilePicture, setProfilePicture ] = useState(defaultPfp);
  let [ randomFilmLink, setRandomFilmLink ] = useState('./film/tt4633694');

  const updateSearchQuery = (event) => { 
    searchQuery = event.target?.value;
    setSearchQuery(searchQuery);
  }

  useEffect(() => {

    const fetchUserProfile = async() => {
      const profileAPIClient = `http://127.0.0.1:8000/users/${userPk}/profile`;
      try {
        const profile = await axios.get(profileAPIClient, {
          responseType: 'blob',   
        });
        const blob = profile.data;
        const url = URL.createObjectURL(blob);
        setProfilePicture(url);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserProfile();
  }, [detectUserPfpChange]);

  useEffect(() => {

    const fetchUserProfile = async() => {
      const profileAPIClient = `http://127.0.0.1:8000/users/${userPk}/profile`;
      try {
        const profile = await axios.get(profileAPIClient, {
          responseType: 'blob',   
        });
        const blob = profile.data;
        const url = URL.createObjectURL(blob);
        setProfilePicture(url);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserProfile();

    const fetchRandomMovieId = async() => {
      const options = {
        method: 'GET',
        url: 'https://moviesdatabase.p.rapidapi.com/titles/random',
        params: {
          list: 'top_boxoffice_200'
        },
        headers: {
          'X-RapidAPI-Key': '8fab35d4f4mshbe61ae998f8d673p12fb8cjsna2a3033028eb',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        setRandomFilmLink('/film/' + response.data.results[0].id);
      } catch (error) {
        console.error(error);
      }
    }

    fetchRandomMovieId();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async() => {
      const profileAPIClient = `http://127.0.0.1:8000/users/${userPk}/profile`;
      try {
        const profile = await axios.get(profileAPIClient, {
          responseType: 'blob',   
        });
        const blob = profile.data;
        const url = URL.createObjectURL(blob);
        setProfilePicture(url);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUserProfile();
  }, [userPk, currUser]);

  const fetchRandomMovieId = async() => {
    const options = {
      method: 'GET',
      url: 'https://moviesdatabase.p.rapidapi.com/titles/random',
      params: {
        list: 'most_pop_movies'
      },
      headers: {
        'X-RapidAPI-Key': '8fab35d4f4mshbe61ae998f8d673p12fb8cjsna2a3033028eb',
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setRandomFilmLink('/film/' + response.data.results[0].id);
    } catch (error) {
      setRandomFilmLink('/film/tt4633694');
      console.error(error);
    }
  }

  const UserProfile = () => {
    // <Link to='/profile' className='mr-[30px] ml-[70px] text-[35px] text-yellow-400 cursor-pointer hover:opacity-80'>{currUser}</Link>
    if(currUser) {
      return(
        <div className='flex justify-start items-center'>
          <Link to='/profile'><img src={profilePicture} className="w-[100px] h-[100px] rounded-[20px] mr-[50px] hover:opacity-80"></img></Link>
        </div>
      );
    } else {
      return(
        <div className='flex justify-start'>
          <Link to='/login' className='mr-[70px] ml-[70px] text-[35px] text-yellow-400 cursor-pointer'>Log In</Link>
        </div>
      );
    }
  }

  const Label = ({label}) => {
    return(
    <div className='flex justify-start'>
      <h1 className='m-[35px] text-[35px] text-yellow-400 cursor-pointer hover:opacity-80'>{label}</h1>
    </div>
    );
  }

  const handleEnterSearch = (event) => {
    if(event.keyCode == 13) {
      setSearchQueryFinal(event.target.value);
      navigate(`../search/${event.target.value}`);
    }
  }
  
  return(
    <div className="max-w-[100%] z-[50] shadow-md shadow-yellow-500 sticky top-0">
      <div className='flex justify-between items-center bg-black bg-opacity-[0.975] h-[150px] text-[50px] outline overflow-auto overflow-y-hidden'>
        <div className="flex justify-between items-center">
          <Link to={randomFilmLink} onClick={() => fetchRandomMovieId()}>
            <Label label="I'm feeling lucky!" />
          </Link>
        </div>
        
        <div className="flex items-center ml-[15px]">
          <Link to='.'>
            <div className='flex justify-center text-[50px] text-center text-yellow-400 mr-[-175px] p-[13px] mt-[80px] h-[80px] outline outline-black w-[50px] text-[70%] rounded-[10px] cursor-pointer'>
              <img src={imdbLogo} className="scale-[5] ml-[100px] object-cover hover:opacity-[0.75]" />
            </div>
          </Link>

          <div className='flex flex-row items-center m-[10px] shrink'>
            <input onKeyDown={(event) => handleEnterSearch(event)} onChange={event => updateSearchQuery(event)} className = 'placeholder-black placeholder-opacity-[0.85] flex justify-start mr-[0px] px-[140px] h-[100px] w-[1000px] text-[27px] p-[20px] rounded-l-[20px] outline-none bg-yellow-500 text-black' placeholder='Search Movies...'></input>
            <Link onClick={() => setSearchQueryFinal(searchQuery)} to={`./search/${searchQuery}`} className='hover:opacity-80 mr-[10px] w-[100px] object-cover rounded-r-[10px]'><img src={searchIcon} className="invert rounded-r-[20px]" /></Link>
          </div>
        </div>
  
        <div className="flex items-center justify-start">
          
          

          <div>
            <UserProfile />
          </div>

        </div>

      </div>
    </div>
    
  )

}