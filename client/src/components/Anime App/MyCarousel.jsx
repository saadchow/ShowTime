import React, { useEffect, useMemo, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/global';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const heroCache = new Map(); // mal_id -> hero URL

// load an image to read its intrinsic size
const measureImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ src, w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ src, w: 0, h: 0 });
    img.referrerPolicy = 'no-referrer'; // Jikan/MAL ok
    img.decoding = 'async';
    img.src = src;
  });

// pick the landscape (>= 1.3:1) with the greatest width
const pickWidestLandscape = async (urls) => {
  const results = await Promise.all(urls.map(measureImage));
  const landscapes = results.filter(r => r.w > 0 && r.h > 0 && r.w / r.h >= 1.3);
  const best = landscapes.sort((a, b) => b.w - a.w)[0] || results.sort((a, b) => b.w - a.w)[0];
  return best?.src || '';
};

async function findBestHero(mal_id) {
  if (heroCache.has(mal_id)) return heroCache.get(mal_id);

  try {
    // 1) Try trailer max image (landscape)
    const fullRes = await fetch(`https://api.jikan.moe/v4/anime/${mal_id}/full`);
    const fullJson = await fullRes.json();
    const trailerMax = fullJson?.data?.trailer?.images?.maximum_image_url
      || fullJson?.data?.trailer?.images?.large_image_url
      || fullJson?.data?.trailer?.images?.image_url;
    if (trailerMax) {
      heroCache.set(mal_id, trailerMax);
      return trailerMax;
    }
  } catch (e) {
    // ignore
  }

  try {
    // 2) Try pictures endpoint; pick the widest landscape image
    const picsRes = await fetch(`https://api.jikan.moe/v4/anime/${mal_id}/pictures`);
    const picsJson = await picsRes.json();
    const picUrls = (picsJson?.data || [])
      .map(p => p?.images?.webp?.image_url || p?.images?.jpg?.image_url)
      .filter(Boolean);
    if (picUrls.length) {
      const bestPic = await pickWidestLandscape(picUrls);
      if (bestPic) {
        heroCache.set(mal_id, bestPic);
        return bestPic;
      }
    }
  } catch (e) {
    // ignore
  }

  // 3) fallback (poster)
  heroCache.set(mal_id, '');
  return '';
}

const MyCarousel = () => {
  const { airingAnime } = useGlobalContext();
  const top = useMemo(() => (Array.isArray(airingAnime) ? airingAnime.slice(0, 6) : []), [airingAnime]);
  const [heroes, setHeroes] = useState({}); // { mal_id: heroUrl }

  useEffect(() => {
    let abort = false;
    (async () => {
      const entries = await Promise.all(
        top.map(async (a) => {
          const hero = await findBestHero(a.mal_id);
          return [a.mal_id, hero];
        })
      );
      if (!abort) {
        const merged = {};
        entries.forEach(([id, url]) => (merged[id] = url));
        setHeroes(merged);
      }
    })();
    return () => { abort = true; };
  }, [top]);

  const poster = (a) =>
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
        {top.map((anime, idx) => {
          const title = anime.title_english || anime.title;
          const genres = (anime.genres || []).map(g => g.name).join(', ');
          const hero = heroes[anime.mal_id] || poster(anime);

          return (
            <div className="slide" key={anime.mal_id}>
              {/* Background hero (prefer landscape) */}
              <div className="bg">
                <picture>
                  <img src={hero} alt={title} loading="eager" decoding="async" />
                </picture>
              </div>

              {/* Fade so text is readable; light theme by default */}
              <div className="fade" />

              {/* Left-aligned overlay content */}
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
  .carousel {
    width: 100%;
    height: 62vh;
    min-height: 420px;
    max-height: 720px;
    background: var(--bg);
    border-radius: 18px;
    overflow: hidden;
  }

  /* Ensure slide content is left-aligned (library centers by default) */
  .carousel .slide { text-align: left !important; }

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
    object-fit: cover;           /* fill without squishing */
    image-rendering: optimizeQuality;
    transform: translateZ(0);
  }

  /* Light fade left -> right for readability */
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
    justify-items: start;  /* left align grid children */
    gap: 14px;
    padding: clamp(16px, 3.5vw, 40px);
    width: min(950px, 60vw);
    color: var(--text);
    z-index: 2;
    text-align: left;      /* text left */
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

  /* Dots with outline + accent pill for selected */
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

  /* Centered, readable arrows */
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
