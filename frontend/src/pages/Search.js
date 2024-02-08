import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { AppContext } from "../App";
import searchIcon from '../search-icon.jpg';
import addedToWatchlistIcon from '../added-to-watchlist.png';
import watchlistIcon from '../watchlist-icon.png';
import loadingWheel from '../loading_wheel.gif';
import { Link, useParams } from 'react-router-dom';
import '../App.css';

export const Search = () => {

  let {filmSearchResults, setFilmSearchResults, 
      watchlist, setWatchlist, 
      searchQueryFinal, setSearchQueryFinal,
      currUser, setCurrUser,
      userPk, setUserPk } = useContext(AppContext);

  let [ searchMessage, setSearchMessage ] = useState('');

  const userAPIClient = 'http://127.0.0.1:8000/users/'
  let [ userData, setUserData ] = useState('');

  const params = useParams();
      
  useEffect(() => {
    setFilmSearchResults([]);
    setSearchQueryFinal(String(params.id));
  
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
  }, []);

  useEffect(() => {
    setFilmSearchResults([]);
    runSearchQuery();
  }, [searchQueryFinal]); 

  const runSearchQuery = async () => {

    setFilmSearchResults([]);
    setSearchMessage(`Searching for "${searchQueryFinal}"...`);

    const createOptionsPg = (pageNo) => {
      return ( 
      {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/search/title/${searchQueryFinal}`,
        params: {
          exact: 'false',
          titleType: 'movie',
          page: `${pageNo}`
        },
        headers: {
          'X-RapidAPI-Key': '8fab35d4f4mshbe61ae998f8d673p12fb8cjsna2a3033028eb',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
      });

    }

    const createFilmCovers = (filmArr) => {
      const createOneCover = (filmObj) => {
        let filmCoverUrl = filmObj.primaryImage?.url;
        
        if (filmCoverUrl == undefined || filmCoverUrl == null) {
          return;
        }

        let filmName = filmObj.originalTitleText?.text;
        if (filmName == undefined || filmName == null) {
          return;
        }
        let filmReleaseDay = filmObj.releaseDate?.day;
        let filmReleaseMonth = filmObj.releaseDate?.month;
        let filmReleaseYear = filmObj.releaseDate?.year;
        let filmId = filmObj.id;
        
        if(filmReleaseMonth == null || filmReleaseMonth == undefined) {
          filmReleaseDay = null;
        }

        if(filmId == null || filmId == undefined) {
          return;
        }

        const WatchlistIcon = () => {
          let [ wlIcon, setWlIcon ] = useState(watchlist?.includes(filmId) ? addedToWatchlistIcon : watchlistIcon);
          
          useEffect(() => {
            if(watchlist?.includes(filmId)) {
              setWlIcon(addedToWatchlistIcon);
            } else {
              setWlIcon(watchlistIcon);
            }
          }, [watchlist])
          
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
              <img className='w-[30px] h-[30px] invert ml-[23px]' src={ wlIcon } />
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
                  <img className='w-[270px] h-[480px] bg-black object-contain relative top-0 left-0' src={ filmCoverUrl } />
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

      return (
        filmArr.map(filmObj => createOneCover(filmObj))
      )
    }

    try {
      setFilmSearchResults([]);
      const optionsPromises = [];

      for(let pg = 1; pg < 5; pg++) {
//        const response = await axios.request(createOptionsPg(1));
        optionsPromises.push(axios.request(createOptionsPg(pg)));
      }

      const responses = await Promise.all(optionsPromises)
      const searchResults = responses.flatMap(response => response.data.results);
      if(searchResults.length > 0) {
        setSearchMessage(`Results for "${searchQueryFinal}"`);
        setFilmSearchResults((createFilmCovers(searchResults)));
      } else {
        setSearchMessage(`No results found for "${searchQueryFinal}"`);
      }
      
      
    } catch (error) {
      console.error(error);
      return;
    }
  }

  const userSearchLink = `/search/user/${searchQueryFinal}`
  return(
    <div className="flex flex-col">
      <div className="text-[50px] mt-[50px] ml-[50px] font-[600] text-white">
        {searchMessage} 
        <div className="text-[20px] text-gray-400 text-opacity-60">
          Search for <Link to={userSearchLink} className="text-yellow-400 text-opacity-60 hover:text-opacity-30">users</Link> instead?
        </div>
      </div>
      <div className='flex flex-row items-center justify-center flex-wrap grow-0 shrink-0'>
        { filmSearchResults }
      </div>
    </div>
  );
}