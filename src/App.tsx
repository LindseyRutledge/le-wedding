import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-component';
import './App.css';

function App() {
  const [weddingPhotos, setWeddingPhotos] = useState<any[]>([]);
  const [weddingPhotoThumbnails, setWeddingPhotoThumbnails] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string>();
  const [visibleCount, setVisibleCount] = useState<number>(20);

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
    setWeddingPhotos(allPhotos);

    const allPhotosSmall = importAll(require.context('./assets/wedding-photos-thumbnails', false, /\.(png|jpe?g|svg)$/));
    allPhotosSmall.sort((a: any, b: any) => {
      const photoNameA = getImageName(a.default);
      const photoNameB = getImageName(b.default);

      return photoNameA.localeCompare(photoNameB, undefined, { numeric: true, sensitivity: 'base' });
    });
    setWeddingPhotoThumbnails(allPhotosSmall);
  }, []);

  const hasMore = visibleCount < weddingPhotos.length;

  const renderSelectedPhoto = () => {
    if (selectedPhoto) {
      const imageName = getImageName(selectedPhoto);

      const matchingPhoto = weddingPhotos.find((photo) => {
        return photo.default.includes(imageName);
      });

      return (
        <div
          className='selected-photo'
          onClick={(e) => setSelectedPhoto(undefined)}
        >
          <img
            className='selected-photo-img'
            src={matchingPhoto ? matchingPhoto.default : selectedPhoto}
            onClick={(e) => e.stopPropagation()}
          />
          <div className='close-icon'>&#10006;</div>
        </div>
      );
    }
  };

  return (
    <div className='App'>
      {renderSelectedPhoto()}
      <a
        className='all-photos-link'
        href='https://drive.google.com/drive/folders/1eqQKcQzigJ7UIst5_eu8fbMSYO4MxmHG?usp=sharing'
      >
        Full Quality Photos and Videos (Click Here)
      </a>
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
            setVisibleCount(visibleCount + 20);
          }, 500)}
          hasMore={hasMore}
          loader={<div>Loading...</div>}
        >
          {weddingPhotoThumbnails.slice(0, visibleCount).map((image, index) => {
            return (
              <img
                className={index === 0 || index === weddingPhotos.length - 1 ? 'wedding-photo-bookend' : 'wedding-photo'}
                key={index}
                src={image?.default}
                onClick={() => setSelectedPhoto(image?.default)}
              />
            );
          })}
        </InfiniteScroll>
      </Masonry>
      <div style={{ color: 'white', display: hasMore ? '' : 'none' }}>Loading....</div>
    </div>
  );
}

export default App;
