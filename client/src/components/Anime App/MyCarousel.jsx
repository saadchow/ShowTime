import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/global';
import { Link } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

const MyCarousel = () => {
    const { airingAnime } = useGlobalContext();    
    
    return (
        <CarouselWrapper>
            <Carousel showThumbs={false} showStatus={false} showIndicators={true} autoPlay={true} interval={4000} infiniteLoop ={true}>
                {airingAnime && airingAnime.slice(0, 5).map((anime) => (
                   <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
                        <div className='image-container'>
                         <img src={anime.images.jpg.large_image_url} alt="" />
                        </div>
                        <div className='text-container'>
                            <strong>{anime.title_english || anime.title}</strong>
                            <p>{anime.title_english ? "Sub | Dub" : "Sub"} &nbsp; • &nbsp; {anime.genres.map(genre => genre.name).join(', ')}</p>
                            <h4>{anime.synopsis.length > 400 ? anime.synopsis.substring(0, 400) + "..." : anime.synopsis}</h4>
                            
                            <div className='button-container'>
                                <button className='continue-button'>More Info.<i class="material-symbols-outlined">chevron_right</i></button>
                                <div className='bookmark-button'><i class="material-icons">bookmark_border</i></div>
                            </div>
                        </div>
                        {console.log(anime)}
                    </Link>
                    
            ))}
            </Carousel>
        </CarouselWrapper>
    );
};


const CarouselWrapper = styled.div`

    .carousel {
        width: 100%;
        height: 55vh; 
        overflow: hidden; 
        display: flex;
    }
   
    .control-dots .dot.selected {
        height: 10px; 
        width: 45px; 
        border-radius: 10px; 
        background: orange; 
        border: none;
    }
    
    strong {
        color: white;
        display: block;
        margin-top: 8%;
        font-size: 2.3em;
        margin-bottom: 0.1em;
    }

    .text-container {
        color: white;
        height: 45vh;
        position: absolute;
        left: 0;
        width: 47%; 
        z-index: 2; 
        float: left;
        margin-left:2%;
        text-align: left;
        flex-direction: column;
        justify-content: center;
    }

    .image-container::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0));
    }

    h4 {
        text-decoration: none;
        font-size: 0.8em;
        font-weight: normal;
        text-align: justify;
    }

    .image-container {
        height: 45vh; 
        position: absolute;
        right: 0;
        width: 55%; 
        z-index: 1; 
        float: right;
        margin-right: 2%;
        position: relative;
    }

    img {
        width: 100%;
        height: 100%; 
        object-fit: cover; 
        border-radius: 50px;
    }    
    
    p {
        color:#D3D3D3;
        margin-bottom: 3em;
        font-size:0.75em;
    }

.button-container {
    position: absolute;
    bottom: 20px;
    display: flex;
    align-items: center;
}

.continue-button, .bookmark-button {
    transition: all 0.3s ease; /* Smooth transition */
}

.continue-button {
    display: inline-flex; 
    justify-content: center;
    align-items: center;  
    background-color: orange;
    color: black;
    border: none;
    padding: 10px 50px;
    text-align: center;
    text-decoration: none;
    font-size: 20px;
    cursor: pointer;
    border-radius: 5px;
    margin-right: 12px;
}

.continue-button:hover {
    transform: scale(1.1); /* Enlarge the button */
    background-color: #ffb732; /* Lighten the button color */
}

.bookmark-button {
    box-sizing: border-box;
    width: 42px;
    height: 45px;
    border: 2px solid orange;
    display: inline-flex; 
    justify-content: center;
    align-items: center;  
}

.bookmark-button:hover {
    transform: scale(1.1); /* Enlarge the button */
    border-color: #ffb732; /* Lighten the button border color */
}

.bookmark-button i {
    color: orange;
}

.bookmark-button:hover i {
    color: #ffb732; /* Lighten the icon color on hover */
}


`;

export default MyCarousel;
