import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import "./Emoji.css"
export default  function App({setEmoji}) {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setEmoji(emojiObject.emoji)
  };
  return (
    <div className="top">
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};