import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-component';
import './App.css';

function App() {
  const [weddingPhotos, setWeddingPhotos] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  const importAll = (r: any) => {
    return r.keys().map(r);
  };

  const getImageName = (filePath: string): string => {
    const filePathSplit: string[] = filePath.split('/');
    const fileNameWithExtension = filePathSplit[filePathSplit.length - 1];

    const fileNameSplit: string[] = fileNameWithExtension.split('.');
    const fileName = fileNameSplit[0];

    return fileName;
  };

  useEffect(() => {
    const allPhotos = importAll(require.context('./assets/wedding-photos', false, /\.(png|jpe?g|svg)$/));
    allPhotos.sort((a: any, b: any) => {
      const photoNameA = getImageName(a.default);
      const photoNameB = getImageName(b.default);

      return photoNameA.localeCompare(photoNameB, undefined, { numeric: true, sensitivity: 'base' });
    });
    setWeddingPhotos(allPhotos);
  }, []);

  const hasMore = visibleCount < weddingPhotos.length;

  return (
    <div className='App'>
      <Masonry
        className='wedding-photos'
        options={{
          columnWidth: '.wedding-photo',
          itemSelector: '.wedding-photo, .wedding-photo-bookend',
          gutter: 10,
          fitWidth: true,
        }}
      >
        <InfiniteScroll
          dataLength={visibleCount}
          next={() => setTimeout(() => {
            setVisibleCount(visibleCount + 5);
          }, 1000)}
          hasMore={hasMore}
          loader={<div>Loading...</div>}
        >
          {weddingPhotos.slice(0, visibleCount).map((image, index) => {
            return (
              <a href={image?.default} title="View Image" target="_blank">
                <img
                  className={index === 0 || index === weddingPhotos.length - 1 ? 'wedding-photo-bookend' : 'wedding-photo'}
                  key={index}
                  src={image?.default}
                />
              </a>
            );
          })}
        </InfiniteScroll>
      </Masonry>
      <div style={{ color: 'white', display: hasMore ? '' : 'none' }}>Loading....</div>
    </div>
  );
}

export default App;
