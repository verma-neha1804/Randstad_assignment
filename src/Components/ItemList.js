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
