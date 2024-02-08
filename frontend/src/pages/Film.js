import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { AppContext } from "../App";
import searchIcon from '../search-icon.jpg';
import addedToWatchlistIcon from '../added-to-watchlist.png';
import watchlistIcon from '../watchlist-icon.png';
import imdbLogo from '../imdb-logo.png';
import defaultPfp from '../default_pfp.jpg';
import { Link, useParams } from 'react-router-dom';
import '../App.css';
import emptyStar from '../empty-star.png';
import halfStar from '../half-star.png';
import fullStar from '../full-star.png';
import boxOfficeMojoLogo from '../box-office-mojo-logo.jpg';
import { useNavigate } from 'react-router-dom';

// OMDBAPIKEY = cbc5e75

// eg: http://www.omdbapi.com/?i=tt1430132&plot=full

// http://www.omdbapi.com/?i=tt3896198&apikey=cbc5e75

export const Film = () => {
  const navigate = useNavigate();

  let { watchlist, setWatchlist, currUser, setCurrUser, userPk, setUserPk } = useContext(AppContext);
  const params = useParams();
  let [ filmCover, setFilmCover ] = useState('');
  let [ filmName, setFilmName ] = useState('');
  let [ releaseDate, setReleaseDate ] = useState('');
  let [ rating, setRating ] = useState('');
  let [ runtime, setRuntime ] = useState('');
  let [ plot, setPlot ] = useState("");
  let [ director, setDirector ] = useState('');
  let [ actors, setActors ] = useState('');
  let [ writers, setWriters ] = useState('');
  let [ genre, setGenre ] = useState('');

  const userAPIClient = 'http://127.0.0.1:8000/users/'
  let [ userData, setUserData ]  = useState('');
  
  let [ userReview, setUserReview ] = useState('');
  let [ reviewWordCount, setReviewWordCount ] = useState(0);
  let [ reviewTitle, setReviewTitle ] = useState('');
  let [ reviewText, setReviewText ] = useState('');
  let [ userRating, setUserRating ] = useState(0);
  
  let [ firstStar, setFirstStar ] = useState(emptyStar);
  let [ secondStar, setSecondStar ] = useState(emptyStar);
  let [ thirdStar, setThirdStar ] = useState(emptyStar);
  let [ fourthStar, setFourthStar ] = useState(emptyStar);
  let [ fifthStar, setFifthStar ] = useState(emptyStar);

  let [ allReviews, setAllReviews ] = useState();

  let [ wlIcon, setWlIcon ] = useState(watchlist?.includes(params.id) ? addedToWatchlistIcon : watchlistIcon);
  
  const imdbUrl = 'https://www.imdb.com/title/' + `${params.id}`;
  const boxOfficeMojoUrl = 'https://www.boxofficemojo.com/title/' + `${params.id}`

  const omdbDataUrl = `http://www.omdbapi.com/?i=${params.id}&apikey=cbc5e75`

  useEffect(() => {

    const fetchUserData = async() => {
      try {
        let userObj = await axios.request(userAPIClient + currUser);
        setUserData(userObj.data);
        setWatchlist(userObj.data.watchlist.map(x => x.movieId));
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserData();

    const createStars = (rating) => {
      if(isNaN(rating)) {
        return(<div className="text-white text-[20px] ml-[50px] mt-[50px]">No Rating Available</div>)
      }
      
      const oneStar = <img src={fullStar} className="mr-[-70px]"></img>;
      const noStar = <img src={emptyStar} className="mr-[-70px]"></img>
      const starArr = [];
      const isHalf = Math.floor(rating) != rating;
      for(let i = 0; i < Math.floor(rating); i++) {
        starArr.push(oneStar)
      }

      if(isHalf) {
        starArr.push(<img src={halfStar} className="mr-[-70px]"></img>);
      }

      for(let i = Math.round(rating); i < 5; i++) {
        starArr.push(noStar);
      }

      return(
        starArr
      );
    }
  
//    setRating(createStars(0.5));

    const fetchFilmObj = async() => {
      
      try {
        const omdbObj = await axios.request(omdbDataUrl);
        const omdbData = omdbObj.data;
        setReleaseDate(omdbData.Released);
        setActors(omdbData.Actors);
        setDirector(omdbData.Director);
        setWriters(omdbData.Writer);
        setGenre(omdbData.Genre);
        const rateTenScale = Math.round(Number(omdbData.imdbRating));
        setRating(createStars(rateTenScale / 2));
        setRuntime(omdbData.Runtime);
        setPlot(omdbData.Plot);
      } catch(error) {
        console.log(error);
      }

      const options = {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/${params.id}`,
        headers: {
          'X-RapidAPI-Key': '8fab35d4f4mshbe61ae998f8d673p12fb8cjsna2a3033028eb',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      };

      try {
        let response = await axios.request(options);
        response = response.data?.results;
        setFilmCover(response?.primaryImage?.url);
        setFilmName(response?.originalTitleText?.text);
        return response.data
      } catch (error) {
        console.error(error);
      }
    }

    fetchFilmObj();

    const fetchAllReviews = async() => {

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
        let authorId = reviewObj.author;
        let rating = reviewObj.rating;
        let reviewTitle = reviewObj.title;
        let reviewContent = reviewObj.review;
        let username = '';
        let userPfp = defaultPfp

        let starImg = createStars(rating/2);

        const userPkAPIClient = `http://127.0.0.1:8000/users/pk/${authorId}`

        try {
          const response = await axios.request(userPkAPIClient)
          username = response.data.username;
          
          try {
            const profileResponse = await axios.get(`http://127.0.0.1:8000/users/${authorId}/profile`, {
              responseType: 'blob',   
            });

            const blob = profileResponse.data;
            const url = URL.createObjectURL(blob);
            userPfp = url;

          } catch (error) {
            console.error(error);
          }
        } catch (error) {
          console.log(error);
          return;
        }

        const userProfileLink = `/user/${username}`;

        return(
          <div className="flex flex-col items-center mt-[50px] mb-[50px] bg-gray-900 bg-opacity-20 w-[1300px] h-[1000px] outline outline-yellow-500 rounded-[50px] ml-[3px] mr-[50px]">
            <div className="flex items-center min-h-[300px] ml-[0px]">
              <div className="ml-[-440px]">
                <Link to={userProfileLink} >
                  <img src={userPfp} className="hover:opacity-70 h-[200px] w-[200px] p-[15px] rounded-[100px] mr-[20px]"></img>
                </Link>
              </div>
              <div className="flex flex-col">
                <div className="text-[50px] mb-[-50px] w-[600px] p-[0px] text-yellow-500 line-clamp-2">
                <Link to={userProfileLink} className="hover:opacity-80 hover:underline"> { username } </Link>
                </div>
                <div className="flex flex-row w-[160px] mt-[20px] px-[50px] ml-[-50px]">
                  { starImg }
                </div>
              </div>
            </div>
            <div>
              <hr className="w-[1300px] mt-[10px] border-none h-[4px] bg-yellow-500" />
            </div>
            <div className="truncate px-[20px] pt-[5px] underline underline-offset-[15px] mr-[40px] text-[40px] text-yellow-400 decoration-gray-500 w-[1260px]">
              {reviewTitle}
            </div>
            <div className="break-all">
              <div className="overflow-auto text-[34px] p-[20px] rounded-b-[50px] w-[1300px] h-[600px] p-[20px] bg-blue-900 bg-opacity-0">
                {reviewContent}
              </div>
            </div>
          </div>
        );
      }

      let reviewArr = ''

      try {
        const filmReviewsAPIClient = `http://127.0.0.1:8000/reviews/film/${params.id}`

        const response = await axios.request(filmReviewsAPIClient);
        reviewArr = response.data;
      } catch (error) {
        console.log(error);
      }

      setAllReviews(await Promise.all(reviewArr.map(review => createOneReview(review))));
      
    }

    fetchAllReviews();

  }, []);

  const handleWatchlist = async() => {

    if(!currUser) {
      window.location.href = '/login';
    }

    const watchlistAPIClient = `http://127.0.0.1:8000/${currUser}/watchlist/${params.id}`
    let newWatchlistItem = {user: userPk, movieId: params.id}
    let len = watchlist.length;
    for(let item = 0; item < len; item++) {
      if(watchlist[item] == params.id) {
        watchlist.splice(item, 1);
        setWlIcon(watchlistIcon);
        setWatchlist(watchlist);

        fetch(watchlistAPIClient,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newWatchlistItem),
          }
        )
        .then(res => res.data)
        .catch((error) => console.error(error));
        
        return;
      }
    }
    

    fetch(watchlistAPIClient,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWatchlistItem),
      }
    )
    .then(res => res.data)
    .catch((error) => console.error(error));

    watchlist.push(params.id);
    setWlIcon(addedToWatchlistIcon);
    setWatchlist(watchlist);
    return;
  }

  const handleHover = (e, starNo) => {
    setFirstStar(emptyStar);
    setSecondStar(emptyStar);
    setThirdStar(emptyStar);
    setFourthStar(emptyStar);
    setFifthStar(emptyStar);
    const clickTarget = e.target;
    const clickTargetWidth = e.pageX;
    const xCoordInClickTarget = (clickTarget.getBoundingClientRect().right - clickTarget.getBoundingClientRect().left) / 2 + clickTarget.getBoundingClientRect().left;
    if (clickTargetWidth < xCoordInClickTarget) {
      // clicked left
      setUserRating(starNo - 0.5);
      setFirstStar(halfStar);
      if(starNo > 1) {
        setFirstStar(fullStar);
      } else {
        return;
      }

      setSecondStar(halfStar);
      if(starNo > 2) {
        setSecondStar(fullStar);
      } else {
        return;
      }

      setThirdStar(halfStar);
      if(starNo > 3) {
        setThirdStar(fullStar);
      } else {
        return;
      }

      setFourthStar(halfStar);
      if(starNo > 4) {
        setFourthStar(fullStar);
      } else {
        return;
      }

      setFifthStar(halfStar);
      if(starNo > 5) {
        setFifthStar(fullStar);
      } else {
        return;
      }
    } else {
      // clicked right
      setUserRating(starNo);
      if(starNo >= 1) {
        setFirstStar(fullStar);
      }

      if(starNo >= 2) {
        setSecondStar(fullStar);
      }

      if(starNo >= 3) {
        setThirdStar(fullStar);
      }

      if(starNo >= 4) {
        setFourthStar(fullStar);
      }

      if(starNo >= 5) {
        setFifthStar(fullStar);
      }
    }
  }

  const postReview = async() => {
    const userReviewAPIClient = `http://127.0.0.1:8000/${currUser}/reviews`

    const review_title = document.getElementById('review-title-input').value;
    const review_input = document.getElementById('review-input').value;
    
    reviewTitle = review_title;
    setReviewTitle(reviewTitle);

    reviewText = review_input;
    setReviewText(reviewText);

    if(reviewTitle.length < 1) {
      alert('Title must be filled!')
      return;
    }

    if(userRating < 0.5) {
      alert('Rating must be atleast half a star!');
      return;
    }

    try {
      let checkRev = await axios.request(userReviewAPIClient);
      
      if(checkRev.data.map(x=>x.movieId).includes(params.id)) {
        alert('you already reviewed this movie!');
        return;
      }
    } catch (error) {
      console.error(error);
    }

    if(reviewWordCount > 10000) {
      alert('Your Review is too long!');
      return;
    }

    if(reviewWordCount < 200) {
      alert('Your Review is too short! 200 characters Minimum!');
      return;
    }

    const formattedReview = await reviewText.replace(/\s+/g, ' ').trim();

    const revObj = { movieId: params.id, author: userPk, title: reviewTitle, review: reviewText, rating: userRating * 2}

    fetch(userReviewAPIClient,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(revObj),
        }
    )
    .then(res => res.data)
    .catch((error) => console.error(error)); 
  }
  
  const deleteReview = () => {
    const userReviewAPIClient = `http://127.0.0.1:8000/${currUser}/reviews/${params.id}`

    fetch(userReviewAPIClient,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
      }
    )
    .then(res => res.data)
    .catch((error) => console.error(error));

  }

  useEffect( () => {

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

    const trackCount = (event) => {
      let text = event.target.value;
      setReviewWordCount(text.length);
      setReviewText(text);
    }

    if(!currUser) {
      setUserReview(
        <div className="text-gray-400 text-opacity-60 text-[30px] mt-[20px]">
          You are not logged in yet. You can Log In <Link className="text-yellow-400 hover:text-opacity-60" to="/login">here</Link>!
        </div>
      )
    } else {
      let reviews = [];
      let reviewIds = [];
      const fetchUserData = async() => {
        let userObj = await axios.request(userAPIClient + currUser);
        reviews = userObj.data.reviews;
        reviewIds = reviews.map(review => review.movieId);
        let isPres = false;
        let rating = 0;
        let review = '';
        let reviewTitle = '';
        for(let i in reviewIds) {
          if(reviewIds[i] == params.id) {
            isPres = true;
            rating = reviews[i].rating;
            review = reviews[i].review;
            reviewTitle = reviews[i].title;
            break; 
          }
        }
        if(isPres) {
          let starImg = createStars(rating/2);
          setReviewWordCount(review.length);
          setUserReview(
            <div className="flex flex-col items-center mt-[50px] mb-[50px] bg-gray-900 bg-opacity-20 w-[1000px] h-[1000px] outline outline-yellow-500 rounded-[50px]">
              <div className="h-[120px]">
                <div className="flex flex-row w-[160px] mt-[-20px] ml-[-520px] px-[50px]">
                  { starImg }
                </div>
              </div>
              <div>
               <hr className="w-[1000px] border-none h-[4px] bg-yellow-500" />
              </div>
              <div className="flex flex-col">
                <div className="w-[900px] truncate text-[35px] ml-[20px] mt-[10px] underline underline-offset-[10px] decoration-gray-400 text-yellow-400">
                  {reviewTitle}
                </div>
                <div className="overflow-auto overflow-x-hidden break-all">
                  <div className="text-[24px] rounded-b-[50px] w-[1000px] h-[660px] p-[20px] bg-blue-900 bg-opacity-0">
                    {review}
                  </div>
                </div>
              </div>
              <div>
                <hr className="w-[1000px] border-none h-[4px] bg-yellow-500" />
              </div>
              <div className="flex flex-row items-center mt-[30px]">
                <div className="mr-[500px] text-[24px] w-[300px] mt-[-30px]">
                  {reviewWordCount} / 10,000 characters
                </div>
                <div className="flex justify-center text-red-500 text-[30px] bg-opacity-30 bg-black w-[150px] py-[10px] mb-[30px] rounded-[30px] outline outline-red-500 hover:opacity-70">
                  <button onClick={() => deleteReview()}>Delete</button>
                </div>
              </div>
            </div>
          );
        } else {
          setUserReview(
            <div className="flex flex-col items-center mt-[50px] mb-[50px] bg-gray-900 bg-opacity-20 w-[1000px] h-[850px] outline outline-yellow-500 rounded-[50px]">
              <div className="flex flex-row items-center mr-[280px]">
                <div>
                  <input id='review-title-input' onChange={(event) => setReviewTitle(event.target.value)} type='text' placeholder="Enter Title Here..." className="px-[20px] py-[3px] rounded-[12px] w-[500px] bg-black outline outline-yellow-500 text-yellow-500 text-[40px]" maxLength={50}></input>
                </div>
                <div className="h-[120px] cursor-pointer hover:opacity-90">
                  <div className="flex flex-row w-[160px] mt-[-20px] ml-[0px] px-[50px]">
                    <img onMouseMove={(event) => handleHover(event, 1)} className='w-[150px] h-[150px] object-cover mr-[20px]' src={firstStar}></img>
                    <img onMouseMove={(event) => handleHover(event, 2)} className='w-[150px] object-cover mr-[20px]' src={secondStar}></img>
                    <img onMouseMove={(event) => handleHover(event, 3)} className='w-[150px] object-cover mr-[20px]' src={thirdStar}></img>
                    <img onMouseMove={(event) => handleHover(event, 4)} className='w-[150px] object-cover mr-[20px]' src={fourthStar}></img>
                    <img onMouseMove={(event) => handleHover(event, 5)} className='w-[150px] object-cover mr-[20px]' src={fifthStar}></img>
                  </div>
                </div>
              </div>
              
              <hr className="w-[1000px] border-none h-[4px] bg-yellow-500" />
              <div className="overflow-hidden">
                <textarea id='review-input' onChange={(event) => trackCount(event)} type="text" placeholder='Write your review here...' className="text-[30px] text-yellow-500 rounded-b-[50px] w-[1000px] h-[600px] p-[20px] bg-blue-900 bg-opacity-0 focus:outline-none resize-none"></textarea>
              </div>
              <hr className="w-[1000px] border-none h-[4px] bg-yellow-500" />
              <div className="flex flex-row items-center mt-[30px]">
                <div className="mr-[500px] text-[24px] w-[300px]">
                  {reviewWordCount} / 10,000 characters
                </div>
                <div className="flex justify-center text-yellow-500 text-[30px] bg-opacity-30 bg-black w-[150px] py-[10px] rounded-[30px] outline outline-yellow-500 hover:opacity-70">
                  <button onClick={() => postReview()}>Submit</button>
                </div>
              </div>
            </div>
          )
        }
      }

      fetchUserData();
    }
  }, [firstStar, secondStar, thirdStar, fourthStar, fifthStar, reviewWordCount]);

  return(
    <div className="flex flex-col items-center scale-[0.67] origin-top">
      <div className="bg-black bg-opacity-60 w-[3000px] m-[50px] rounded-[50px]">
        <div className="p-[50px] flex text-white">
          <div className="relative">
            <div className="z-[2] absolute top-0">
              <img src={filmCover} className="w-[800px] rounded-[20px] object-contain" />
            </div>
            <div className="z-0 top-0">
              <img src={filmCover} className="w-[800px] blur-[0px] rounded-[20px] object-contain" />
            </div>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center mt-[-110px]">
              <div className="flex">
                <div className="flex flex-col justify-start items-start mt-[100px] ml-[30px]">
                  <div className="flex">
                    <div className="text-[80px] font-[600] break-all text-yellow-500 mt-[-5px] max-w-[700px]">
                      {filmName}
                    </div>
                    <div >
                      <img onClick={(() => handleWatchlist())} src={wlIcon} className="invert w-[80px] mt-[13px] ml-[20px] cursor-pointer hover:opacity-70 hover:duration-200 active:opacity-25" /> 
                    </div>
                  </div>
                  <div className="flex h-[150px] w-[150px] ml-[-45px] mt-[-35px] mb-[-25px]">
                    { rating }
                  </div>
                  <div className="text-[25px] ml-[7px] text-gray-600">
                    <div className="flex">
                      <div>
                        {releaseDate}
                      </div>
                      <div>
                        &nbsp;&#8226;&nbsp; 
                      </div>
                      <div>
                        {runtime}
                      </div>
                    </div>

                    <div>
                      Genre: {genre}
                    </div>

                    <div>
                      Director: {director}
                    </div>

                    <div>
                      Writers: {writers}
                    </div>

                    <div>
                      Actors: {actors}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-[300px] ml-[-13px] hover:opacity-70 hover:duration-200 active:opacity-50">
                      <Link to={imdbUrl} target="_blank">
                        <img src={imdbLogo} />
                      </Link>
                    </div>

                    <div>
                      <Link to={boxOfficeMojoUrl} target="_blank">
                        <img src={boxOfficeMojoLogo} className="w-[300px] h-[130px] object-cover rounded-[20px] hover:opacity-70 hover:duration-200 active:opacity-50" />
                      </Link>
                    </div>
                  </div>
                  
                </div>
                <div>
                  
                </div>
              </div>
            </div>
            <div className="text-[40px] max-w-[1000px] text-white ml-[40px]">
              {plot}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center ml-[70px]">
        <div className="text-[50px] text-white">
          Your Review
        </div>
        
        <hr className="w-[280px] border-none h-[5px] rounded-[12px] bg-yellow-500" />
        
        <div className="text-white">
          { userReview }
        </div>
      </div>

      <div className="flex flex-col items-center justify-center ml-[70px]">
        <div className="text-[50px] text-white">
          User Reviews
        </div>
        
        <hr className="w-[280px] border-none h-[5px] rounded-[12px] bg-yellow-500" />
        
        <div className="flex justify-center items-center text-white flex-wrap w-[4600px]">
          { allReviews }
        </div>
      </div>

     </div>
  )
} 