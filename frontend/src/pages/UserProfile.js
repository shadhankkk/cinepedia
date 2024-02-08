import { useState, useContext, useEffect } from 'react';
import { AppContext } from "../App";
import axios from 'axios';
import { Link, redirect, useParams, useSearchParams } from 'react-router-dom';
import defaultPfp from '../default_pfp.jpg';
import emptyStar from '../empty-star.png';
import halfStar from '../half-star.png';
import fullStar from '../full-star.png';


export const UserProfile = () => {
  let [ reviews, setReviews ] = useState();
  let [ watchlist, setWatchlist ] = useState([]);
  let [ profilePicture, setProfilePicture ] = useState(defaultPfp);
  let [ userReviews, setUserReviews ] = useState([]);
  let [ followButton, setFollowButton ] = useState();
  let [ username, setUsername ] = useState('');
  
  let { currUser } = useContext(AppContext);

  const followingButton = 
    <div>
      <button onClick={() => unfollowFunc()} className="text-green-400 text-[24px] bg-black outline outline-green-400 bg-opacity-100 w-[130px] px-[0px] py-[5px] rounded-[20px] hover:opacity-80">Following</button>
    </div>

  const followButtonOG = currUser ?
      <div>
        <button onClick={() => followFunc()} className="text-yellow-500 text-[24px] bg-black outline outline-yellow-500 bg-opacity-100 w-[130px] px-[30px] py-[5px] rounded-[20px] hover:opacity-80">Follow</button>
      </div>
      :
      <div>
        <Link to='/login' className="text-yellow-500 text-[24px] bg-black outline outline-yellow-500 bg-opacity-100 w-[130px] px-[30px] py-[5px] rounded-[20px] hover:opacity-80">Follow</Link>
      </div>

  const followFunc = () => {
    if(currUser == params.id) {
      alert('You cant follow yourself!');
      return;
    }
    setFollowButton(followingButton);
  }

  const unfollowFunc = () => {
    setFollowButton(followButtonOG)
  }

  const params = useParams();
  
  const userAPIClient = `http://127.0.0.1:8000/users/${params.id}`;

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

    const noReviews =
      <div className='text-[40px] text-gray-400 text-opacity-80'>
        No Reviews from {params.id}...
      </div>

    setUserReviews(noReviews);

    setFollowButton(followButtonOG);

    const fetchUserData = async() => {
      try {
        const userObj = await axios.request(userAPIClient);
        try {
        const profile = await axios.get(`http://127.0.0.1:8000/users/${userObj.data.pk}/profile`, {
          responseType: 'blob',   
        });
        const blob = profile.data;
        const url = URL.createObjectURL(blob);
        setProfilePicture(url)
        } catch (error) {
          console.error(error);
        }
        
        setUsername(userObj.data.username);
        
        if(userObj.data.reviews[0]) {
          createReviews(userObj.data.reviews);
        }
      } catch (error) {
        console.error(error);
      }
      
    }

    fetchUserData();

  }, []);

  const handleEnterSearch = (event) => {
    if(event.keyCode == 13) {
      
      const getUserObj = async() => {
        try {
          const userObj = await axios.request(userAPIClient);
          if(userObj.data.reviews[0]) {
            createReviews(userObj.data.reviews, event.target.value.trim());
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
              <h1 className="text-[50px] mt-[-10px] text-yellow-400">{username}</h1>
              <div className='mt-[5px]'>
                {followButton}
              </div>
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
      </div>
    </div>
  );
}