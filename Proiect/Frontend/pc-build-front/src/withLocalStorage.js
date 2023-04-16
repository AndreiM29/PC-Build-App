import React, { useState, useEffect } from "react";

const withLocalStorage = (Component, storageKey) => {
  const WithLocalStorage = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const storedOption = localStorage.getItem(storageKey);
      if (storedOption) {
        setSelectedOption(storedOption);
        setCurrentIndex(options.indexOf(storedOption));
      }
    }, []); 

    const handleOptionSelect = (event) => {
      const option = event.target.value;
      setSelectedOption(option);
      setCurrentIndex(options.indexOf(option));
      localStorage.setItem(storageKey, option);
    };

    return (
      <Component
        selectedOption={selectedOption}
        options={options}
        currentIndex={currentIndex}
        handleOptionSelect={handleOptionSelect}
      />
    );
  };

  return WithLocalStorage;
};

export default withLocalStorage;
