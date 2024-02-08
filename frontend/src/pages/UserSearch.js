import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import defaultPfp from '../default_pfp.jpg';

export const UserSearch = () => {
  let [ searchResults, setSearchResults ] = useState();
  
  const params = useParams();
  const searchReq = params.id;

  const userSearchAPIClient = `http://127.0.0.1:8000/users_search/${searchReq}`

  const createUserResults = async(userData) => {
    const createUserBox = async(name) => {
      const userProfileLink = `/user/${name}`
      const userAPIClient = `http://127.0.0.1:8000/users/${name}`;
      let url = defaultPfp;

      const fetchUserData = async() => {
        try {
          const userObj = await axios.request(userAPIClient)
          const profileAPIClient = `http://127.0.0.1:8000/users/${userObj.data.pk}/profile`;
          const profile = await axios.get(profileAPIClient, {
            responseType: 'blob',   
          });
          const blob = profile.data;
          url = URL.createObjectURL(blob);
        } catch (error) {
          console.error(error);
        }
        
      }

      await fetchUserData();

      return(
        <div>
          <Link to={userProfileLink}>
            <div className='flex flex-row items-top mt-[50px] bg-black px-[20px] py-[30px] mr-[100px] bg-opacity-60 hover:bg-opacity-40 cursor-pointer rounded-[20px]'>
              <div>
                <img src={url} className='w-[100px] h-[100px] rounded-[20px] mr-[20px]'></img>
              </div>
              <div className='text-yellow-400 text-[35px] w-[300px]'>
                { name }
              </div>
            </div>
          </Link>
        </div>
      );
    }

    let res = await Promise.all(userData.map(async (x) => createUserBox(x.username)));
    setSearchResults(res);
  }

  useEffect(() => {

    const fetchUserResults = async() => {
      const userObjs = await axios.request(userSearchAPIClient);
      createUserResults(userObjs.data);
    }

    fetchUserResults();
  }, []);

  return(
    <div>
      <div className='text-[50px] mt-[50px] ml-[50px] font-[600] text-white'>
        Search results for {searchReq}...
      </div>
      <div className='flex flex-row items-center justify-center flex-wrap grow-0 shrink-0'>
        { searchResults }
      </div>
    </div>
  )

}