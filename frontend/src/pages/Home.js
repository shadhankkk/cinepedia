import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from "../App";
import addedToWatchlistIcon from '../added-to-watchlist.png';
import watchlistIcon from '../watchlist-icon.png';
import { Link } from 'react-router-dom';
import '../App.css';

export const Home = () => {

  let {watchlist, setWatchlist, currUser, setCurrUser, userPk, setUserPk} = useContext(AppContext);
  let [ popMovies, setPopMovies ] = useState([]);
  let [ topRatedMovies, setTopRatedMovies ] = useState([]);
  let [ currMovies, setCurrMovies ] = useState([]);
  let [ topGrossing, setTopGrossing ] = useState([]);
  let [ action, setAction ] = useState([]);
  let [ comedy, setComedy ] = useState([]);
  let [ sciFi, setSciFi ] = useState([]);
  let [ horror, setHorror ] = useState([]);
  let [ romance, setRomance ] = useState([]);

  const userAPIClient = 'http://127.0.0.1:8000/users/'
  let [ userData, setUserData ]  = useState('');

  const createFilmCovers = (filmArr) => {
    const createOneCover = (filmObj) => {
      let filmCoverUrl = filmObj.primaryImage?.url;
      if (filmCoverUrl == undefined || filmCoverUrl == null) {
        return;
      }
      let filmName = filmObj.originalTitleText?.text;
      let filmReleaseDay = filmObj.releaseDate?.day;
      let filmReleaseMonth = filmObj.releaseDate?.month;
      let filmReleaseYear = filmObj.releaseDate?.year;
      let filmId = filmObj.id;
        
        if(filmId == null || filmId == undefined) {
          return;
        }

      if(filmReleaseMonth == null || filmReleaseMonth == undefined) {
        filmReleaseDay = null;
      }

      const WatchlistIcon = () => {
        let [ wlIcon, setWlIcon ] = useState(watchlist?.includes(filmId) ? addedToWatchlistIcon : watchlistIcon);
        const handleWatchlist = async() => {
          
          if(!currUser) {
            window.location.href = '/login';
          }
      
          const watchlistAPIClient = `http://127.0.0.1:8000/${currUser}/watchlist/${filmId}`
          let newWatchlistItem = {user: userPk, movieId: filmId}
          let len = watchlist.length;
          for(let item = 0; item < len; item++) {
            if(watchlist[item] == filmId) {
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
      
          watchlist.push(filmId);
          setWlIcon(addedToWatchlistIcon);
          setWatchlist(watchlist);
          return;
        }
        
        return(
          <div id={`${filmId}WatchlistIcon`} onClick={() => handleWatchlist()} className={`absolute top-[10px] left-[-18px] z-[1] hover:opacity-50 transition-opacity hover:duration-200 opacity-75 active:opacity-25`}>
            <img className='w-[30px] h-[30px] invert ml-[23px]' src={watchlist.includes(filmId) ? addedToWatchlistIcon : watchlistIcon} />
          </div>
        );
      }

      return (
        <div key={filmId} className="flex flex-col items-center m-[50px] text-white rounded-r-[20px] rounded-b-[30px] w-[300px] cursor-pointer hover:opacity-60">
            <Link to={`../film/${filmId}`}>
              <div className="outline outline-yellow-400 outline-[4px] rounded-b-[20px] rounded-tr-[20px]">
                <div id={`${filmId}`} className="flex justify-center bg-black rounded-tr-[30px] relative">
                  <Link>
                    <WatchlistIcon />
                  </Link>
                  <img className='w-[270px] h-[480px] bg-black object-contain relative top-0 left-0' src={ `${filmCoverUrl}` } />
                </div>
                
                <div className='flex flex-row items-center justify-between pr-[10px] pl-[10px] pt-[10px] text-black bg-yellow-400 rounded-b-[14px] p-[20px] w-[100%]'>
                  <h2 className="w-[180px] text-ellipsis whitespace-nowrap overflow-hidden m-[4px]">{ filmName }</h2>
                  
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

    if(filmArr == null || filmArr == undefined) {
      return;
    }

    return (
      filmArr.map(filmObj => createOneCover(filmObj))
    )
  }

  const generateRandomFilms = async(label) => {
    const options = {
      method: 'GET',
      url: 'https://moviesdatabase.p.rapidapi.com/titles/random',
      params: {
        list: `${label}`
      },
      headers: {
        'X-RapidAPI-Key': '8fab35d4f4mshbe61ae998f8d673p12fb8cjsna2a3033028eb',
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      const randRes = await response.data.results;
      
      return randRes;
      
    } catch (error) {
      console.error(error);
    }
  }

  const generateRandomGenre = async(genre) => {
    const options = {
      method: 'GET',
      url: 'https://moviesdatabase.p.rapidapi.com/titles/random',
      params: {
        list: 'top_boxoffice_200',
        genre: `${genre}`
      },
      headers: {
        'X-RapidAPI-Key': '8fab35d4f4mshbe61ae998f8d673p12fb8cjsna2a3033028eb',
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      const randRes = response.data.results;
      
      return randRes;
      
    } catch (error) {
      console.error(error);
    }
  }

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

    const genSet = async(label) => {
      return generateRandomFilms(`${label}`).then(res => createFilmCovers(res));
    }

    const genSetGenre = async(label) => {
      return generateRandomGenre(`${label}`).then(res => createFilmCovers(res));
    }
    const awaitSets = async() => {

      setPopMovies(await genSet('top_boxoffice_200'));
      setTopRatedMovies(await genSet('top_boxoffice_200'));
      setTopGrossing(await genSet('top_boxoffice_200'));
      setAction(await genSetGenre('Action'));
      setComedy(await genSetGenre('Comedy'));
      setSciFi(await genSetGenre('Sci-Fi'));
      setHorror(await genSetGenre('Horror'));
      setRomance(await genSetGenre('Romance'));
    }

    awaitSets();
  }, []);

  const FilmRow = ({label, type}) => {
    return(
      <div>
        <div>
          <h1 className='text-[50px] mt-[50px] ml-[50px] font-[600] text-yellow-500'>{label}</h1>
        </div>
        
        <div className='flex overflow-scroll overflow-y-hidden'>
          {type}
        </div>
      </div>
    )
  }

  return(
    <div className='flex flex-col'>
      <FilmRow label='Popular Films' type={popMovies} />

      <FilmRow label='Top Rated Films' type={topRatedMovies} />

      <FilmRow label='Top Grossing Films' type={topGrossing} />

      <FilmRow label='Action Films' type={action} />

      <FilmRow label = 'Comedy Films' type={comedy} />

      <FilmRow label = 'Sci-Fi Films' type={sciFi} />

      <FilmRow label = 'Horror Films' type={horror} />

      <FilmRow label = 'Romance Films' type={romance} />
    </div>
  )

}