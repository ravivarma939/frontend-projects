import React, { useState, useEffect } from "react";
import { fetchWeather } from "./api/fetchWeather";
import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [savedWeathers, setSavedWeathers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("savedWeathers")) || [];
    setSavedWeathers(savedData);
  }, []);

  const search = async (e) => {
    if (e.key === "Enter") {
      try {
        const data = await fetchWeather(query);
        if (data.main) {
          setWeather(data);
        } else {
          setModalMessage(`City "${query}" not found in the database.`);
          setShowModal(true);
        }
        setQuery("");
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setModalMessage(`City "${query}" not found in the database.`);
        setShowModal(true);
      }
    }
  };

  const saveWeather = () => {
    if (weather && weather.main) {
      const newWeather = {
        name: weather.name,
        temp: Math.round(weather.main.temp),
        country: weather.sys.country,
      };

      const savedData = JSON.parse(localStorage.getItem("savedWeathers")) || [];

      if (
        !savedData.some(
          (item) =>
            item.name === newWeather.name && item.country === newWeather.country
        )
      ) {
        savedData.push(newWeather);

        if (savedData.length > 3) {
          savedData.shift();
        }

        localStorage.setItem("savedWeathers", JSON.stringify(savedData));
        setSavedWeathers(savedData);
        alert("Weather data saved!");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <div className="main-container">
      <div className="search-section">
        <input
          type="text"
          className="search"
          placeholder="search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={search}
        />
      </div>

      {weather.main && (
        <div className="city">
          <h2 className="city-name">
            <span>{weather.name}</span>
            <sup>{weather.sys.country}</sup>
          </h2>
          <div className="city-temp">
            {Math.round(weather.main.temp)}
            <sup>&deg;C</sup>
          </div>
          <div className="info">
            <img
              className="city-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
      )}

      <div className="save-button-container">
        <button className="save-button" onClick={saveWeather}>
          Save
        </button>
      </div>

      {savedWeathers.length > 0 && (
        <div className="saved-weather">
          {savedWeathers.map((item, index) => (
            <div key={index} className="saved-item">
              <p>
                {item.name}, {item.country}
              </p>
              <p>{item.temp}&deg;C</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Error</h2>
            <p>{modalMessage}</p>
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
