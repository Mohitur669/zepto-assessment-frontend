import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import './App.css';

interface Chip {
  id: number;
  label: string;
}

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [items, setItems] = useState<string[]>(['Apple', 'Orange', 'Mango', 'Lichi', 'Guava']);
  const [chips, setChips] = useState<Chip[]>([]);
  const lastChipRef = useRef<Chip | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chips]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      addChip(inputValue.trim());
      setInputValue('');
    } else if (event.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      if (lastChipRef.current) {
        removeChip(lastChipRef.current.id);
      } else {
        highlightLastChip();
      }
    }
  };

  const addChip = (label: string) => {
    const newChip: Chip = { id: Date.now(), label };
    setChips((prevChips) => [...prevChips, newChip]);
    setItems((prevItems) => prevItems.filter((item) => item !== label));
  };

  const removeChip = (chipId: number) => {
    const removedChip = chips.find((chip) => chip.id === chipId);
    if (removedChip) {
      setChips((prevChips) => prevChips.filter((chip) => chip.id !== chipId));
      setItems((prevItems) => [...prevItems, removedChip.label]);
    }
  };

  const highlightLastChip = () => {
    const lastChip = chips[chips.length - 1];
    if (lastChip) {
      lastChipRef.current = lastChip;
    }
  };

  return (
    <div className="App">
      <div className="chips-container">
        {chips.map((chip) => (
          <div key={chip.id} className="chip">
            {chip.label}
            <span className="chip-remove" onClick={() => removeChip(chip.id)}>
            {" "}X
            </span>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
        placeholder="Type here..."
        className="input-field"
      />
      <div className="item-list">
        {items
          .filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()))
          .map((item) => (
            <div key={item} className="item" onClick={() => addChip(item)}>
              {item}
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;