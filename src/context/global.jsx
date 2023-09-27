import React, {createContext, useContext, useReducer} from "react";

const GlobalContext = createContext();

const baseUrl = "https://api.jikan.moe/v4";

const Loading = "Loading";
const Search = "Search";
const Get_Popular_Anime = "Get_Popular_Anime";
const Get_Upcoming_Anime = "Get_Upcoming_Anime";
const Get_Airing_Anime = "Get_Airing_Anime";
const Get_Pictures = "Get_Pictures"

const reducer = (state, action) => {
    switch(action.type){
        case Loading:
            return {...state, loading:true}
        case Get_Popular_Anime:
            return {...state, popularAnime: action.payload, loading:false}
        case Search:
            return {...state, searchResults: action.payload, loading:false}
        case Get_Upcoming_Anime:
            return {...state, upcomingAnime: action.payload, loading:false}
        case Get_Airing_Anime:
            return {...state, airingAnime: action.payload, loading:false}
        case Get_Pictures:
            return {...state, pictures: action.payload, loading:false}
        default:
            return state;
    }
}

export const GlobalContextProvider = ({children}) => {

    const initalState = {
        popularAnime: [],
        upcomingAnime: [],
        airingAnime: [],
        pictures: [],
        isSearch: false,
        searchResults: [],
        loading: false,
    }

    const [state, dispatch] = useReducer (reducer, initalState)
    const [search, setSearch] = React.useState('');
    const [isSearch, setIsSearch] = React.useState(false);

     const handleChange = (e) => {
        setSearch(e.target.value);
        if(e.target.value === ''){
            state.isSearch = false;
        }
    }

   const handleSubmit = (e) => {
    e.preventDefault();
    if(search){
      searchAnime(search);
      setIsSearch(true); 
    }else{
      setIsSearch(false); 
      alert('Please enter a search term')
    }
  }

    const getPopularAnime = async () => {
        dispatch({type:Loading})
        const response = await fetch (`${baseUrl}/top/anime?filter=bypopularity`)
        const data = await response.json();
        dispatch({type: Get_Popular_Anime, payload: data.data})
    }

     const getUpcomingAnime = async () => {
        dispatch({type:Loading})
        const response = await fetch (`${baseUrl}/top/anime?filter=upcoming`)
        const data = await response.json();
        dispatch({type: Get_Upcoming_Anime, payload: data.data})
    }

     const getAiringAnime = async () => {
        dispatch({type:Loading})
        const response = await fetch (`${baseUrl}/top/anime?filter=airing`)
        const data = await response.json();
        dispatch({type: Get_Airing_Anime, payload: data.data})
    }

     const getAnimePictures = async (id) => {
        dispatch({type:Loading})
        const response = await fetch (`https://api.jikan.moe/v4/characters/${id}/pictures`)
        const data = await response.json();
        dispatch({type: Get_Pictures, payload: data.data})
    }

     const searchAnime = async (anime) => {
        dispatch({type:Loading})
        const response = await fetch (`https://api.jikan.moe/v4/anime?q=${anime}&order_by=popularity&sort=asc&sfw`)
        const data = await response.json();
        dispatch({type: Search, payload: data.data})
    }

    React.useEffect (() => {
        getPopularAnime();
    }, [])

    return (
    <GlobalContext.Provider value={{
      ...state,
      isSearch, 
      setIsSearch, 
      handleChange,
      handleSubmit,
      searchAnime,
      search,
      getPopularAnime,
      getUpcomingAnime,
      getAiringAnime,
      getAnimePictures,
      dispatch
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}