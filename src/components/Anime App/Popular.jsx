import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../../context/global'
import styled from 'styled-components'
import Sidebar from './Sidebar'

function Popular({rendered}) {
    const {popularAnime,isSearch, searchResults} = useGlobalContext()

    const conditionalRender = () => {
   if(!isSearch && rendered === 'popular'){
  return popularAnime && popularAnime.slice(0, 20).map((anime) => {
    return (
      <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
        <img src={anime.images.jpg.large_image_url} alt={anime.title} />
        <p>{anime.title}</p>
      </Link>
    );
  });
    }else{
        return searchResults.map((anime) => {
            return <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                <img src={anime.images.jpg.large_image_url} alt={anime.title} />
                <p>{anime.title}</p>
            </Link>
        })
    }
}


    return (
        <PopularStyled>
            <Sidebar />
            <div className="popular-anime">
                {conditionalRender()}
            </div>
        </PopularStyled>
    )
}

const PopularStyled = styled.div`
    display: flex;
    .popular-anime{
        margin-top: 2rem;
        padding-top: 2rem;
        padding-bottom: 2rem;
        padding-left: 1rem;
        padding-right: 4rem;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 3rem;
        background-color: black;
        a{
            height: 500px;
            border-radius: 7px;
            border: 2px solid #D3D3D3;
        }
        a img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 5px;
        }
        p {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            overflow: hidden;
            color: white;
        }
    }
`;




export default Popular