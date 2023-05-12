import React from 'react';


function Anime({ data }) {
  return (
    <div>
      <h2>{data.title}</h2>
      <img src={data.image_url} alt={data.title} />
    </div>
  );
}

export default Anime;

