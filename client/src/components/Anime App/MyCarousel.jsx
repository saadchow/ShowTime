import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/global';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const MyCarousel = () => {
  const { airingAnime } = useGlobalContext();

  const bestImage = (a) =>
    a?.images?.webp?.large_image_url ||
    a?.images?.webp?.image_url ||
    a?.images?.jpg?.large_image_url ||
    a?.images?.jpg?.image_url ||
    '';

  const short = (str, n) => (str && str.length > n ? str.slice(0, n).trim() + '…' : str || '');

  return (
    <HeroCarousel>
      <Carousel
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        autoPlay={true}
        interval={5000}
        infiniteLoop={true}
        swipeable
        emulateTouch
      >
        {Array.isArray(airingAnime) &&
          airingAnime.slice(0, 6).map((anime, idx) => {
            const title = anime.title_english || anime.title;
            const genres = (anime.genres || []).map(g => g.name).join(', ');
            const img = bestImage(anime);

            return (
              <div className="slide" key={anime.mal_id}>
                {/* Background art */}
                <div className="bg">
                  <picture>
                    {anime?.images?.webp && (
                      <source
                        srcSet={anime.images.webp.large_image_url || anime.images.webp.image_url}
                        type="image/webp"
                      />
                    )}
                    <img src={img} alt={title} loading="eager" decoding="async" />
                  </picture>
                </div>

                {/* Gradient that fades art to the left for readable text */}
                <div className="fade" />

                {/* Text overlay */}
                <div className="content">
                  <div className="kicker">#{idx + 1} Trending</div>
                  <h2 className="title">{title}</h2>

                  <div className="meta">
                    <span>Sub{anime.title_english ? ' | Dub' : ''}</span>
                    {genres && <span>• {genres}</span>}
                  </div>

                  <p className="desc">{short(anime.synopsis, 320)}</p>

                  <div className="cta">
                    <Link to={`/anime/${anime.mal_id}`} className="btn primary">
                      More Info.
                      <i className="material-symbols-outlined">chevron_right</i>
                    </Link>
                    <Link to={`/anime/${anime.mal_id}`} className="btn ghost">
                      Detail
                      <i className="material-symbols-outlined">chevron_right</i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
      </Carousel>
    </HeroCarousel>
  );
};

const HeroCarousel = styled.div`

.carousel .slide {
  text-align: left !important;
}

.content {
  justify-items: start;   /* grid items left */
  text-align: left;       /* text left */
}

.content .kicker,
.content .title,
.content .meta,
.content .desc,
.content .cta {
  text-align: left;
}

  .carousel {
    width: 100%;
    height: 62vh;
    min-height: 420px;
    max-height: 720px;
    background: var(--bg);
    border-radius: 18px;
    overflow: hidden;
  }

 
  .slide {
    position: relative;
    height: 62vh;
    min-height: 420px;
    max-height: 720px;
  }


  .bg, .bg picture, .bg img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  .bg img {
    object-fit: cover;
    image-rendering: optimizeQuality;
    transform: translateZ(0);
  }
  .fade {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg,
        rgba(248,250,252,0.96) 0%,
        rgba(248,250,252,0.92) 20%,
        rgba(248,250,252,0.70) 38%,
        rgba(248,250,252,0.30) 58%,
        rgba(248,250,252,0.10) 72%,
        rgba(248,250,252,0.00) 86%);
  }

  .content {
    position: absolute;
    inset: 0;
    display: grid;
    align-content: center;
    gap: 14px;
    padding: clamp(16px, 3.5vw, 40px);
    width: min(950px, 60vw);
    color: var(--text);
    z-index: 2;
  }

  .kicker {
    font-weight: 700;
    color: var(--accent);
    letter-spacing: .4px;
  }

  .title {
    font-size: clamp(1.6rem, 4.2vw, 3.2rem);
    margin: 0;
    line-height: 1.1;
    color: var(--text);
  }

  .meta {
    display: flex;
    gap: 12px;
    color: var(--muted);
    font-weight: 600;
  }

  .desc {
    color: var(--muted);
    max-width: 60ch;
    line-height: 1.6;
  }

  .cta {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 18px;
    border-radius: 9999px;
    font-weight: 700;
    text-decoration: none;
    transition: transform .15s ease, opacity .15s ease, box-shadow .15s ease;
  }
  .btn.primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 8px 22px rgba(99,102,241,.25);
  }
  .btn.ghost {
    background: rgba(15,23,42,.08);
    color: var(--text);
  }
  .btn:hover { transform: translateY(-1px); opacity: .96; }

  .control-dots { bottom: 14px; }
  .control-dots .dot {
    width: 10px; height: 10px; border-radius: 9999px;
    background: #fff !important;
    border: 2px solid var(--text);
    opacity: 1 !important;
    box-shadow: 0 0 0 1px rgba(0,0,0,.05);
  }
  .control-dots .dot.selected {
    width: 45px; border-radius: 10px;
    background: var(--accent) !important; border-color: var(--accent);
  }

  .control-arrow {
    top: 50% !important;
    transform: translateY(-50%) !important;
    opacity: 1 !important;
    background: rgba(15,23,42,.25) !important;
    width: 44px; height: 44px; border-radius: 9999px;
  }
  .control-arrow:hover { background: rgba(15,23,42,.38) !important; }
  .control-prev.control-arrow:before { border-right-color: #fff !important; }
  .control-next.control-arrow:before { border-left-color: #fff !important; }

  @media (max-width: 900px) {
    .content { width: auto; }
    .desc { max-width: 100%; }
  }
`;

export default MyCarousel;
