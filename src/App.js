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

  
  const itemsToShow = selectedCard ? groupedAlbums[selectedCard][0].items : [];

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
            <div className="card-label">{`${groupedAlbums[userId][0].title} - ${userId}`}</div>
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


// import React, { useState, useEffect } from 'react';
// import './App.css';
// import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
// import ItemDetails from './Components/ItemDetalis';
// import ItemList from './Components/ItemList';

// function UserCard({ userId, albums, selectedCard, handleCardClick, searchTerm }) {
//   const userAlbums = albums.filter((album) => album.userId === userId);
//   const itemCount = userAlbums.reduce((count, album) => count + (album.items ? album.items.length : 0), 0);

//   return (
//     <Link
//       to={`/item/${userId}`}
//       className={`card ${selectedCard === userId ? 'selected' : ''}`}
//       onClick={() => handleCardClick(userId)}
//     >
//       <div className="item-count">{itemCount}</div>
//       <div className="card-label">{`${userAlbums[0].title} - ${userId}`}</div>
//     </Link>
//   );
// }

// function App() {
//   const [albums, setAlbums] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCard, setSelectedCard] = useState(null);
//   const [seenItems, setSeenItems] = useState({});

//   useEffect(() => {
//     fetch('https://jsonplaceholder.typicode.com/albums')
//       .then((response) => response.json())
//       .then((data) => {
//         const itemPromises = data.map((album) =>
//           fetch(`https://jsonplaceholder.typicode.com/albums/${album.id}/photos`)
//             .then((response) => response.json())
//         );

//         Promise.all(itemPromises)
//           .then((itemData) => {
//             const albumsWithItems = data.map((album, index) => ({
//               ...album,
//               items: itemData[index],
//             }));

//             setAlbums(albumsWithItems);
//           });
//       });
//   }, []);

//   const handleCardClick = (userId) => {
//     setSelectedCard(userId);
//   };

//   const handleItemClick = (itemId) => {
//     setSeenItems((prevSeenItems) => ({
//       ...prevSeenItems,
//       [itemId]: true,
//     }));
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Filter the albums based on the search term
//   const filteredAlbums = albums.filter((album) =>
//     album.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Group albums based on userId
//   const groupedAlbums = filteredAlbums.reduce((grouped, album) => {
//     if (!grouped[album.userId]) {
//       grouped[album.userId] = [];
//     }
//     grouped[album.userId].push(album);
//     return grouped;
//   }, {});

//   // Get the list of items for the selected card
//   // const itemsToShow = selectedCard ? groupedAlbums[selectedCard][0].items : [];

//   return (
//     <div className="App">
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search items..."
//           value={searchTerm}
//           onChange={handleSearch}
//         />
//       </div>
//       <div className="card-container">
//         {Object.keys(groupedAlbums).map((userId) => (
//           <UserCard
//             key={userId}
//             userId={Number(userId)}
//             albums={groupedAlbums[userId]}
//             selectedCard={selectedCard}
//             handleCardClick={handleCardClick}
//             searchTerm={searchTerm}
//           />
//         ))}
//       </div>
//       <div className="item-list-container">
//          {selectedCard !== null ? (
//         <ItemList
//           userId={selectedCard}
//           albums={filteredAlbums} // Use filteredAlbums instead of albums
//           seenItems={seenItems}
//           handleItemClick={handleItemClick}
//           searchTerm={searchTerm}
//         />
//       ) : (
//         <p style={{textAlign:"center"}}>Select a card to view items.</p>
//       )}
//       </div>
//     </div>
//   );
// }

// export default App;
