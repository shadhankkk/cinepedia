import { useEffect, useState, createContext } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Navbar } from './pages/Navbar';
import { Film } from './pages/Film';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { UserSearch } from './pages/UserSearch';
import { UserProfile } from './pages/UserProfile';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import searchIcon from './search-icon.jpg';
import watchlistIcon from './watchlist-icon.png';
import addedToWatchlistIcon from './added-to-watchlist.png';

export const AppContext = createContext();

function App() {

  let [ searchQuery, setSearchQuery ] = useState("");
  let [ searchQueryFinal, setSearchQueryFinal ]  = useState('');
  let [ filmSearchResults, setFilmSearchResults ] = useState([]);
  let [ watchlist, setWatchlist ] = useState([]);
  let [ currUser, setCurrUser ] = useState();
  let [ userPk, setUserPk ] = useState(-1);
  let [ detectUserPfpChange, setDetectUserPfpChange ] = useState(false);

//  useEffect(() => console.log(searchQuery), [searchQuery]);

  return (
    <div>
      <AppContext.Provider value={{searchQuery, setSearchQuery,
                                   searchQueryFinal, setSearchQueryFinal, 
                                   filmSearchResults, setFilmSearchResults,
                                   watchlist, setWatchlist,
                                   currUser, setCurrUser,
                                   userPk, setUserPk,
                                   detectUserPfpChange, setDetectUserPfpChange }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/search/:id' element={<Search />} />
            <Route path='/film/:id' element={<Film />} />
            <Route path='/login/' element={<Login />} />
            <Route path='/signup/' element={<Signup />} />
            <Route path='/profile/' element={<Profile />} />
            <Route path='/search/user/:id' element={<UserSearch />} />
            <Route path='/user/:id' element={<UserProfile />} />
          </Routes>
        </Router>
          
      </AppContext.Provider>
    </div>
  );
}

export default App;