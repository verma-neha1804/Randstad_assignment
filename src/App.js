import React, { useState, useEffect } from 'react';
import './App.css';
import ItemList from './Components/ItemList';

function App() {
  const [albums, setAlbums] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [seenItems, setSeenItems] = useState({});

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then((response) => response.json())
      .then((data) => {
        const itemPromises = data.map((album) =>
          fetch(`https://jsonplaceholder.typicode.com/albums/${album.id}/photos`)
            .then((response) => response.json())
        );

        Promise.all(itemPromises)
          .then((itemData) => {
            const albumsWithItems = data.map((album, index) => ({
              ...album,
              items: itemData[index],
            }));

            setAlbums(albumsWithItems);
          });
      });
  }, []);

  const handleCardClick = (userId) => {
    setSelectedCard(userId);
  };

  const handleItemClick = (itemId) => {
    setSeenItems((prevSeenItems) => ({
      ...prevSeenItems,
      [itemId]: true,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedAlbums = filteredAlbums.reduce((grouped, album) => {
    if (!grouped[album.userId]) {
      grouped[album.userId] = [];
    }
    grouped[album.userId].push(album);
    return grouped;
  }, {});

  const cardItemCounts = Object.keys(groupedAlbums).reduce((countObj, userId) => {
    const unseenItemCount = groupedAlbums[userId].reduce(
      (count, album) =>
        count +
        album.items.reduce((itemCount, item) => itemCount + (!seenItems[item.id] ? 1 : 0), 0),
      0
    );
    return {
      ...countObj,
      [userId]: unseenItemCount,
    };
  }, {});

  const itemsToShow = selectedCard && groupedAlbums.hasOwnProperty(selectedCard) ? groupedAlbums[selectedCard][0].items : [];

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="card-container">
        {Object.keys(groupedAlbums).map((userId) => (
          <div
            key={userId}
            className={`card ${selectedCard === userId ? 'selected' : ''}`}
            onClick={() => handleCardClick(userId)}
          >
            <div className="item-count">{cardItemCounts[userId]}</div>
            <div className="card-label">{`${groupedAlbums[userId][0].title} `}</div>
            <div className="card-label">{`UserID - ${userId}`}</div>
          </div>
        ))}
      </div>
      {selectedCard && (
        <ItemList
          userId={selectedCard}
          items={itemsToShow}
          seenItems={seenItems}
          handleItemClick={handleItemClick}
        />
      )}
    </div>
  );
}

export default App;
