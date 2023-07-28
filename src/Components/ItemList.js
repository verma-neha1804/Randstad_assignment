import React from 'react';
import "./ItemList.css"

function ItemList({ userId, items, seenItems, handleItemClick }) {
  return (
    <div className="item-list">
      <h2>{`Items for User ID: ${userId}`}</h2>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={seenItems[item.id] ? 'seen' : ''}
            onClick={() => handleItemClick(item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;
// import React from 'react';
// import './ItemList.css';

// function ItemList({ userId, albums, seenItems, handleItemClick, searchTerm }) {
//   // Find the items for the selected user based on the 'userId' prop
//   const selectedAlbum = albums.find((album) => album.userId === userId);
//   const itemsToShow = selectedAlbum ? selectedAlbum.items || [] : [];

//   // Filter items based on the search term
//   const filteredItems = itemsToShow.filter((item) =>
//     item.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="item-list">
//       <h2>{`Items for User ID: ${userId}`}</h2>
//       <ul>
//         {filteredItems.length > 0 ? (
//           filteredItems.map((item) => (
//             <li
//               key={item.id}
//               className={seenItems[item.id] ? 'seen' : ''}
//               onClick={() => handleItemClick(item.id)}
//             >
//               {item.title}
//             </li>
//           ))
//         ) : (
//           <li>No items found.</li>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default ItemList;
