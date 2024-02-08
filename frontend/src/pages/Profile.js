import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { AppContext } from "../App";
import { Link } from 'react-router-dom';
import defaultPfp from "../default_pfp.jpg";
import emptyStar from '../empty-star.png';
import halfStar from '../half-star.png';
import fullStar from '../full-star.png';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();

  let { currUser, setCurrUser, userPk, setUserPk, detectUserPfpChange, setDetectUserPfpChange } = useContext(AppContext);
  const userAPIClient = 'http://127.0.0.1:8000/users/'
  let [ userData, setUserData ]  = useState('');

  let [profilePicture, setProfilePicture] = useState(defaultPfp);
  let [ profileEdit, setProfileEdit ] = useState();
  let [ userReviews, setUserReviews ] = useState([]);

  let [ userWatchlist, setUserWatchlist ] = useState();

  let profileEditOG = 
  <div>
    <button onClick={(event) => editProfile(event)} className="text-gray-500 text-opacity-80 bg-gray-800 bg-opacity-20 w-[150px] py-[5px] rounded-[20px] hover:opacity-80">Edit Profile Picture</button>
  </div>

  const editProfile = () => {
    setProfileEdit(
      <div className="flex flex-col items-start">
        <input id='pfp_upload' type="file" accept=".jpg, .png" className="cursor-pointer"></input>
        <div className="flex">
          <button onClick={() => uploadPfp()} className="ml-[5px] mt-[15px] mr-[10px] hover:opacity-80 bg-black p-[0px] px-[10px] rounded-[20px] text-green-400 outline outline-green-400">Submit</button>
          <button onClick={() => setProfileEdit(profileEditOG)} className="ml-[5px] mt-[15px] mr-[10px] hover:opacity-80 bg-black p-[0px] px-[10px] rounded-[20px] text-gray-400 outline outline-gray-400">Cancel</button>
          <button onClick={() => deletePfp()} className="ml-[5px] mt-[15px] hover:opacity-80 bg-black p-[0px] px-[10px] rounded-[20px] text-red-400 outline outline-red-400">Delete</button>
        </div>
      </div>
    );
  }

  const deletePfp = async() => {
    const profileAPIClient = `http://127.0.0.1:8000/users/${userPk}/profile`;
    const response = await fetch('/default_pfp.jpg');
    const blob = await response.blob();

    const file = new File([blob], 'image.jpg', { type: blob.type })
    setProfilePicture(defaultPfp);
    const formData = new FormData();
    formData.append('user', Number(userPk));
    formData.append('profilePicture', file);
    fetch(profileAPIClient,
      {
        method: "PUT",
        body: formData,
      }
    )
    .then(res => res.data)
    .catch((error) => console.error(error));
  }

  const createWatchlist = async(watchlistArr) => {

    const createWatchlistItem = async(watchlistObj) => {
      let movieId = watchlistObj.movieId;
      let movieName = '';
      let movieCoverUrl = '';
      let filmReleaseDay = '';
      let filmReleaseMonth = '';
      let filmReleaseYear = ''

      const options = {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/${movieId}`,
        headers: {
          'X-RapidAPI-Key': '8fab35d4f4mshbe61ae998f8d673p12fb8cjsna2a3033028eb',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      };

      try {
        let response = await axios.request(options);
        response = response.data?.results;
        movieName = response.originalTitleText?.text;
        movieCoverUrl = response.primaryImage?.url;
        filmReleaseDay = response.releaseDate?.day;
        filmReleaseMonth = response.releaseDate?.month;
        filmReleaseYear = response.releaseDate?.year;

        if(filmReleaseMonth == null || filmReleaseMonth == undefined) {
          filmReleaseDay = null;
        }
        
      } catch (error) {
        console.error(error);
      }

      return (
        <div key={movieId} className="flex flex-col items-center m-[50px] text-white rounded-r-[20px] rounded-b-[30px] w-[300px] cursor-pointer hover:opacity-60">
            <Link to={`../film/${movieId}`}>
              <div className="outline outline-yellow-400 outline-[4px] rounded-b-[20px] rounded-tr-[20px]">
                <div id={`${movieId}`} className="flex justify-center bg-black rounded-tr-[30px] relative">
                  <img className='w-[270px] h-[480px] bg-black object-contain relative top-0 left-0' src={ `${movieCoverUrl}` } />
                </div>
                
                <div className='flex flex-row items-center justify-between pr-[10px] pl-[10px] pt-[10px] text-black bg-yellow-400 rounded-b-[14px] p-[20px] w-[100%]'>
                  <h2 className="w-[180px] text-ellipsis whitespace-nowrap overflow-hidden m-[4px]">{ movieName }</h2>
                  
                  <div className="flex justify-end w-[104px] pr-[4px]"> 
                    { filmReleaseDay == undefined || filmReleaseDay == null ? "" : filmReleaseDay + " / " }
                    { filmReleaseMonth == undefined || filmReleaseMonth == null ? "" : filmReleaseMonth + " / "} 
                    { filmReleaseYear }
                  </div>
                </div>
              </div>
              
            </Link>
          </div>
      )

    }

    setUserWatchlist(await Promise.all(watchlistArr.map(watchlistItem => createWatchlistItem(watchlistItem))));

  }
  
  useEffect(() => {
    setDetectUserPfpChange(!detectUserPfpChange);
    
    navigate('/profile', { replace: true })
  }, [profilePicture])

  useEffect(() => {

    setUserReviews(
    <div className='text-[40px] text-gray-400 text-opacity-80'>
      Loading Reviews...
    </div>
    );

    setUserWatchlist(
      <div className='text-[40px] text-gray-400 text-opacity-80'>
        Loading Watchlist...
      </div>
    );

    setProfileEdit(
      profileEditOG
    );

    const fetchProfile = async() => {
      try{
        const profile = await axios.get(`http://127.0.0.1:8000/users/${userPk}/profile`, {
          responseType: 'blob',   
        });
        const blob = profile.data;
        const url = URL.createObjectURL(blob);
        setProfilePicture(url);
      } catch (error) {
        console.error(error);
      }

      try {
        const userAPIClient = `http://127.0.0.1:8000/users/${currUser}`
        const userObj = await axios.request(userAPIClient);
        if(userObj.data.watchlist[0]) {
          createWatchlist(userObj.data.watchlist);
        } else {
          setUserWatchlist(
            <div className='text-[40px] text-gray-400 text-opacity-80'>
              Your Watchlist is Empty...
            </div>
          );
        }
      } catch (error) {
        console.error(error);
      }
    
    }
    
    fetchProfile();
  }, []);

  const createReviews = async(reviewArr, searchFilter = '') => {
    
    const createStars = (rating) => {
      if(isNaN(rating)) {
        return(<div className="text-white text-[20px] ml-[50px] mt-[50px]">No Rating Available</div>)
      }
      
      const oneStar = <img src={fullStar} className="w-[150px] h-[150px] object-cover mr-[20px]"></img>;
      const noStar = <img src={emptyStar} className="w-[150px] h-[150px] object-cover mr-[20px]"></img>
      const starArr = [];
      const isHalf = Math.floor(rating) != rating;
      for(let i = 0; i < Math.floor(rating); i++) {
        starArr.push(oneStar)
      }

      if(isHalf) {
        starArr.push(<img src={halfStar} className="w-[150px] h-[150px] object-cover mr-[20px]"></img>);
      }

      for(let i = Math.round(rating); i < 5; i++) {
        starArr.push(noStar);
      }

      return(
        starArr
      );
    }

    const createOneReview = async(reviewObj) => {
      let movieId = reviewObj.movieId;
      let rating = reviewObj.rating;
      let review = reviewObj.review;
      let reviewTitle = reviewObj.title;
      let starImg = createStars(rating/2);
      let movieName = 'ERROR: FAILED TO RETRIEVE';
      let movieCoverUrl = '';

      const options = {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/${movieId}`,
        headers: {
          'X-RapidAPI-Key': '8fab35d4f4mshbe61ae998f8d673p12fb8cjsna2a3033028eb',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      };

      try {
        let response = await axios.request(options);
        response = response.data?.results;
        movieName = response.originalTitleText.text;
        movieCoverUrl = response.primaryImage.url;
      } catch (error) {
        console.error(error);
      }

      const filmPage = `/film/${movieId}`

      if(!movieName.toLowerCase().includes(searchFilter.toLowerCase())) {
        return;
      }

      return(
        <div className="flex flex-col items-center mt-[50px] mb-[50px] bg-gray-900 bg-opacity-20 w-[1300px] h-[800px] outline outline-yellow-500 rounded-[50px] ml-[3px] mr-[50px]">
          <div className="flex items-center h-[300px] ml-[0px]">
            <div className="ml-[-430px]">
              <Link to={filmPage}>
                <img src={movieCoverUrl} className="h-[300px] max-w-[220px] object-contain p-[15px] rounded-[40px] mr-[20px] hover:opacity-60"></img>
              </Link>
            </div>
            <div className="flex flex-col">
              <div className=" text-[50px] w-[600px] p-[0px] text-yellow-500 line-clamp-2">
                { movieName }
              </div>
              <div className="flex flex-row w-[160px] mt-[-20px] px-[50px] ml-[-50px]">
                { starImg }
              </div>
            </div>
          </div>
          <div>
            <hr className="w-[1300px] mt-[10px] border-none h-[4px] bg-yellow-500" />
          </div>
          <div className="px-[20px] pt-[5px] underline underline-offset-[10px] mr-[140px] text-[40px] text-yellow-400 decoration-gray-500 w-[1170px] truncate">
            {reviewTitle}
          </div>
          <div className="break-all">
            <div className="overflow-auto text-[30px] p-[20px] rounded-b-[50px] w-[1300px] h-[400px] p-[20px] bg-blue-900 bg-opacity-0">
              {review}
            </div>
          </div>
        </div>
      );
    }

    reviewArr = reviewArr.reverse();
    let userReviewsPrelim = await Promise.all(reviewArr.map(review => createOneReview(review)))
    
    if(userReviewsPrelim.filter(x => x)[0]) {
      setUserReviews(userReviewsPrelim);
    } else {
      setUserReviews(
        <div className='text-[40px] text-gray-400 text-opacity-80'>
          No reviews found for '{searchFilter}'
        </div>
      );
    }
  }
  
  useEffect(() => {

    const getUserObj = async() => {
      try {
        let userObj = await axios.request(userAPIClient + currUser);
        setUserData(userObj.data);
        if(userObj.data.reviews[0]) {
          createReviews(userObj.data.reviews);
        } else {
          setUserReviews(
            <div className='text-[40px] text-gray-400 text-opacity-80'>
              You haven't reviewed any movies yet...
            </div>
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserObj();

  }, []);

  if(!currUser) {
    window.location.href = '/login'
    return;
  }
  
  const uploadPfp = async() => {
    const profileAPIClient = `http://127.0.0.1:8000/users/${userPk}/profile`;
    
    let fileInputElem = document.getElementById('pfp_upload');
    const file = fileInputElem.files[0]
    setProfilePicture(URL.createObjectURL(file));
    if(file) {
      const formData = new FormData();
      formData.append('user', userPk);
      formData.append('profilePicture', file);


      try {
        fetch(profileAPIClient,
          {
            method: "POST",
            body: formData,
          }
        )
        .then(res => res.data)
        .catch((error) => console.error(error));
      } catch (error) {
        console.error(error);
      }

      try{
        fetch(profileAPIClient,
          {
            method: "PUT",
            body: formData,
          }
        )
        .then(res => res.data)
        .catch((error) => console.error(error));
      } catch (error) {
        console.error(error);
      }
      
    } else {
      alert('You need to upload a file!');
      return;
    }

    setProfileEdit(
      profileEditOG
    );
  }

  const handleEnterSearch = (event) => {

    if(event.keyCode == 13) {
      
      const getUserObj = async() => {
        try {
          let userObj = await axios.request(userAPIClient + currUser);
          setUserData(userObj.data);
          if(userObj.data.reviews[0]) {
            createReviews(userObj.data.reviews, event.target.value.trim());
          } else {
            setUserReviews(
              <div className='text-[40px] text-gray-400 text-opacity-80'>
                You haven't reviewed any movies yet...
              </div>
            );
          }
        } catch (error) {
          console.log(error);
        }
      }

      getUserObj();
    }
  }

  return(
    <div className="flex justify-center scale-[0.75] origin-top">
      <div className="text-white m-[100px] bg-black bg-opacity-80 p-[50px] rounded-[50px] w-[3050px]">
        <div className="flex flex-col">
          <div className="flex items-start">
            <div>
              <img src={profilePicture} className="w-[150px] h-[150px] rounded-[20px] outline outline-black"></img>
            </div>
            <div className="flex flex-col items-start ml-[20px]">
              <h1 className="text-[40px] text-yellow-400">{ userData?.username }</h1>
              {profileEdit}
            </div>
            <div>
              <button onClick={()=>window.location.href='/login'} className="ml-[2250px] text-[40px] mt-[70px] outline outline-gray-500 text-gray-500 hover:opacity-80 rounded-[20px] py-[10px] px-[20px] w-[220px]">
                Log Out
              </button>
            </div>
          </div>
        </div>
        <hr className="w-[2960px] border-none h-[4px] bg-yellow-500 mt-[50px]" />
        <div className="flex flex-col items-start mt-[20px]">
          <div className="flex items-center">
            <div className="text-[40px] underline decoration-yellow-500 underline-offset-[10px]">
              Reviews
            </div>
            <div className="ml-[20px]">
              <input onKeyDown={(event) => handleEnterSearch(event)} type="text" placeholder="Filter by movie name..." className="text-yellow-400 pl-[25px] py-[10px] text-[30px] bg-black shadow-inner shadow-yellow-500 outline-none rounded-[20px]"></input>
            </div>
          </div>
          
          <div className="flex flex-row mt-[10px] w-[2980px] overflow-auto">
            {userReviews}
          </div>
        </div>
        
        <div className="flex flex-col items-start mt-[10px]">
          <div className="text-[40px] underline decoration-yellow-500 underline-offset-[10px]">
            My Watchlist
          </div>
          <div className="flex flex-row mt-[10px] w-[2980px] overflow-auto">
            {userWatchlist}
          </div>
        </div>
      </div>
    </div>
  );
}