import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/global';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MyCarousel = () => {
  const { airingAnime } = useGlobalContext();

  const getBestImage = (anime) => {
    // Prefer high quality webp, then jpg (large), then normal
    const w = anime?.images?.webp;
    const j = anime?.images?.jpg;
    return (
      w?.large_image_url ||
      w?.image_url ||
      j?.large_image_url ||
      j?.image_url ||
      ''
    );
  };

  return (
    <CarouselWrapper>
      <Carousel
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        autoPlay={true}
        interval={4000}
        infiniteLoop={true}
        swipeable
        emulateTouch
      >
        {airingAnime && airingAnime.slice(0, 5).map((anime) => {
          const bestSrc = getBestImage(anime);
          const title = anime.title_english || anime.title;

          return (
            <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
              <div className="slide-wrap">
                <div className="text-container">
                  <strong>{title}</strong>
                  <p>
                    {anime.title_english ? "Sub | Dub" : "Sub"} &nbsp; • &nbsp;
                    {(anime.genres || []).map(g => g.name).join(', ')}
                  </p>
                  <h4>
                    {(anime.synopsis || '').length > 400
                      ? `${anime.synopsis.substring(0, 400)}...`
                      : (anime.synopsis || '')
                    }
                  </h4>

                  <div className="button-container">
                    <button className="continue-button">
                      More Info.
                      <i className="material-symbols-outlined">chevron_right</i>
                    </button>
                    <div className="bookmark-button">
                      <i className="material-icons">bookmark_border</i>
                    </div>
                  </div>
                </div>

                <div className="image-container">
                  {/* Prefer WebP with fallback to JPG */}
                  <picture>
                    {anime?.images?.webp && (
                      <source
                        srcSet={
                          anime.images.webp.large_image_url ||
                          anime.images.webp.image_url
                        }
                        type="image/webp"
                      />
                    )}
                    <img
                      src={bestSrc}
                      alt={title}
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>
            </Link>
          );
        })}
      </Carousel>
    </CarouselWrapper>
  );
};

const CarouselWrapper = styled.div`
  /* overall area */
  .carousel {
    width: 100%;
    height: 55vh;
    overflow: hidden;
    display: flex;
    background: var(--bg);
  }

  /* use accent color for active dot */
  .control-dots .dot.selected {
    height: 10px;
    width: 45px;
    border-radius: 10px;
    background: var(--accent);
    border: none;
  }

  .slide-wrap {
    position: relative;
    height: 55vh;
  }

  strong {
    color: var(--text);
    display: block;
    margin-top: 8%;
    font-size: 2.3em;
    margin-bottom: 0.1em;
  }

  .text-container {
    color: var(--text);
    height: 45vh;
    position: absolute;
    left: 0;
    width: 47%;
    z-index: 2;
    float: left;
    margin-left: 2%;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  p {
    color: var(--muted);
    margin-bottom: 1.2em;
    font-size: 0.9em;
  }

  h4 {
    text-decoration: none;
    font-size: 0.95em;
    font-weight: normal;
    text-align: justify;
    color: var(--muted);
    max-width: 90%;
  }

  .button-container {
    position: absolute;
    bottom: 20px;
    display: flex;
    align-items: center;
  }

  .continue-button, .bookmark-button {
    transition: all 0.25s ease;
  }

  .continue-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: var(--accent);
    color: #fff;
    border: none;
    padding: 10px 50px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 10px;
    margin-right: 12px;
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.25);
  }
  .continue-button:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }

  .bookmark-button {
    box-sizing: border-box;
    width: 42px;
    height: 45px;
    border: 2px solid var(--accent);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
  }
  .bookmark-button:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }
  .bookmark-button i {
    color: var(--accent);
  }

  .image-container {
    /* Prevent upscaling beyond ~900px to avoid blur on huge screens */
    width: min(55%, 900px);
    height: 45vh;
    position: absolute;
    right: 0;
    z-index: 1;
    float: right;
    margin-right: 2%;
  }

  .image-container::after {
    /* Light theme gradient overlay from bg to transparent */
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, var(--bg), transparent);
    pointer-events: none;
  }

  picture, img {
    width: 100%;
    height: 100%;
    display: block;
  }

  img {
    object-fit: cover;
    border-radius: 18px;
    /* Slightly better scaling on some browsers */
    image-rendering: optimizeQuality;
  }

  @media (max-width: 900px) {
    .text-container { width: 55%; }
    .image-container { width: 45%; }
    strong { font-size: 1.8em; }
  }

  @media (max-width: 700px) {
    .text-container {
      width: 100%;
      position: relative;
      height: auto;
      margin: 0;
      padding: 1rem 2rem;
      background: var(--surface);
      border: 1px solid var(--ring);
      border-radius: 12px;
    }
    .image-container {
      position: relative;
      width: 100%;
      height: 32vh;
      margin: 12px 0 0;
    }
  }
`;

export default MyCarousel;
