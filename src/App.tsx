import React, { useEffect, useState } from 'react';
import './App.css';
import Masonry from 'react-masonry-component';

function App() {
  const [weddingPhotos, setWeddingPhotos] = useState<any[]>([]);

  const importAll = (r: any) => {
    return r.keys().map(r);
  };

  useEffect(() => {
    setWeddingPhotos(importAll(require.context('./assets/wedding-photos', false, /\.(png|jpe?g|svg)$/)));
  }, []);

  console.log(weddingPhotos);

  return (
    <div className='App'>
      <Masonry
        className='wedding-photos'
        options={{
          columnWidth: '.wedding-photo',
          itemSelector: '.wedding-photo',
          gutter: 10,
          fitWidth: true,
          percentPosition: true,
        }}
        // @ts-ignore
        imagesLoadedOptions={{ background: '.wedding-photo' }}
      >
        {weddingPhotos.map((image, index) => {
          return (
            <img className='wedding-photo' key={index} src={image?.default} />
          );
        })}
      </Masonry>
    </div>
  );
}

export default App;
