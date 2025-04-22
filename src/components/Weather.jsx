import React, { useEffect, useRef, useState } from 'react'
import clear_icon from '../assets/clear.png'
import search_icon from '../assets/search.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import thunder_icon from '../assets/thunder.png'
import humidity_icon from '../assets/humidity.png'
import wind_icon from '../assets/wind.png'
import sunset_icon from '../assets/sunset.png'
import sunrise_icon from '../assets/sunrise.png'
import clear_gif from '../assets/clear_gi.gif'
import cloud_gif from '../assets/cloud_gifs.gif'
import snow_gif from '../assets/snow_gifs.gif'
import rain_gif from '../assets/rain.gif'
import thunder_gif from '../assets/thunder.gif'
import drizzle_gif from '../assets/drizzle.gif'

import day_icon from '../assets/day.jpeg'
import night_icon from '../assets/night.jpg'
import { Col, Row } from 'react-bootstrap'


function Weather() {

  const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": cloud_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": thunder_icon,  // You'll need a thunder icon image
    "11n": thunder_icon,
    "13d": snow_icon,
    "13n": snow_icon,

  };
  const countryNames = {
    AF: "Afghanistan",
    AL: "Albania",
    AR: "Argentina",
    AU: "Australia",
    BD: "Bangladesh",
    BR: "Brazil",
    CA: "Canada",
    CN: "China",
    DE: "Germany",
    EG: "Egypt",
    ES: "Spain",
    FR: "France",
    GB: "United Kingdom",
    IN: "India",
    IT: "Italy",
    JP: "Japan",
    MX: "Mexico",
    NG: "Nigeria",
    RU: "Russia",
    US: "United States",

  };
  function reset() {
    // setWeatherData(0)
    setWeatherData(false);  // Clear weather data
    inputRef.current.value = "";



  }
  //  Add state for timezone and dt

  const [cityTime, setCityTime] = useState("");
  const [cityDateTimeInfo, setCityDateTimeInfo] = useState({
    dt: null,
    timezone: null
  });
  const search = async (city) => {
    if (!city) {
      alert("Enetr City Name")
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return
      }
      console.log(data);

      const iconCode = data.weather[0].icon;
      const icon = allIcons[iconCode] || clear_icon;
      const countryFullName = countryNames[data.sys.country] || data.sys.country;
      const sky_condition = data.weather[0].main
      // saving dt and timezone
      setCityDateTimeInfo({
        dt: data.dt,
        timezone: data.timezone
      });
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        country: countryFullName,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        sky: sky_condition
      });
    } catch (error) {
      setWeatherData(false)
      console.error("Error fetching weather data:", error);
    }
  };
  // dark light modes
  const [darkMode, setDarkMode] = useState(false);

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };
// 
  const backgroundStyle = {
    backgroundImage:`url(${darkMode ? "https://images.pexels.com/photos/813269/pexels-photo-813269.jpeg?cs=srgb&dl=pexels-minan1398-813269.jpg&fm=jpg": "https://t3.ftcdn.net/jpg/09/48/32/12/360_F_948321220_CEq8RzYKdkPubpgfEhGIxTAXN7DgippC.jpg" })`,   // Light mode background
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '150vh',
    width: '100vw',
    transition: 'background-image 0.5s ease-in-out',
    color: darkMode ? 'white' : 'black',
  };
  // to change sky accoding to sky-condition

  const [videoSrc, setVideoSrc] = useState("");
  useEffect(() => {
    if (weatherData && weatherData.sky) {
      const sky_data = weatherData.sky.toLowerCase(); // Normalize to lowercase

      switch (sky_data) {
        case "clouds":
          setVideoSrc(cloud_gif);
          break;
        case "clear":
          setVideoSrc(clear_gif);
          break;
        case "rain":
          setVideoSrc(rain_gif);
          break;
        case "snow":
          setVideoSrc(snow_gif);
          break;
        case "thunderstorm":
          setVideoSrc(thunder_gif);
          break;
        case "drizzle":
          setVideoSrc(drizzle_gif);
          break;
        default:
          setVideoSrc(clear_gif);
          break;
      }
    }
  }, [weatherData]);


  // to update local time every second

  useEffect(() => {
    const updateCityTime = () => {
      if (cityDateTimeInfo.timezone !== null) {
        const nowUTC = new Date(); // This is your local time
        const utcTimeInMs = nowUTC.getTime() + (nowUTC.getTimezoneOffset() * 60000); // Convert to UTC

        const localTimeInMs = utcTimeInMs + cityDateTimeInfo.timezone * 1000; // Add city timezone offset
        const localDate = new Date(localTimeInMs);

        const formatter = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        setCityTime(formatter.format(localDate));
        setIsDay(localDate.getHours() >= 6 && localDate.getHours() < 18);
      }
    };

    const interval = setInterval(updateCityTime, 1000);
    return () => clearInterval(interval);
  }, [cityDateTimeInfo]);
  // dynamically update background according to AM and PM

  // temperature conversion

  const [isCelsius, setIsCelsius] = useState(true);


  return (
    <div className='main' style={backgroundStyle}>

<button
        onClick={toggleMode}
        style={{
          position: 'absolute',
          top: '15px',
          right: '20px',
          padding: '8px ',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: darkMode ? '#ffffff33' : '#00000033',
          color: darkMode ? '#fff' : '#000',
          cursor: 'pointer',
        }}
      >
        {/* {darkMode ? 'Light' : 'Dark '} */}
        {darkMode ? 'Light' : 'Dark '}
      </button>
      <p className='TempNow'>TempNow <span style={{fontSize:"15px",fontStyle:"italic"}}>- Your Personal Forecast, Anytime, Anywhere.</span></p>
      <div className="weather ">
        <div className="search-bar">
          <input ref={inputRef} type="text" placeholder='Search' />
          <img className='search-key' src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
        </div>
        <Row className='datencountry pt-3'>
          <Col lg={4} className='pe-5'>
            Country: {weatherData.country}
          </Col>
          <Col lg={4} className=''>
            <span className='reset' onClick={reset}>Reset</span><br />

          </Col>
          <Col lg={4} className='ps-5'>{cityTime || "Local Time"}</Col>

        </Row>
        {/* <img
        src={isDay ? <>{day_icon}</> : <>{</>} // Make sure these images exist in public folder
        alt={isDay ? "Daytime" : "Nighttime"}
        className="w-64 h-auto rounded-xl mx-auto"
      /> */}
        <div>


          {weatherData && (
            <>
              <center>
                <img src={weatherData.icon} alt="" className='weather-icon' />
              </center>
              <p className='temperature text-center'>{isCelsius
                ? `${weatherData.temperature}°C`
                : `${((weatherData.temperature * 9) / 5 + 32).toFixed(1)}°F`}</p>
              <p className='location text-center'>{weatherData.location}</p>
              <button className='tempChange' onClick={() => setIsCelsius(!isCelsius)}> Convert to {isCelsius ? '°F' : '°C'}</button>

              <Row className="weather-data text-center">
                <Col className="col">
                  <img src={humidity_icon} alt="" style={{ marginTop: "20px" }} />
                  <div>
                    <span>Humidity</span>
                    <p>{weatherData.humidity}</p>

                  </div>
                </Col>
                <Col className="col">
                  <img src={wind_icon} alt="" style={{ marginTop: "10px" }} />
                  <div>
                    <span>Wind Speed</span>
                    <p>{weatherData.windSpeed}</p>

                  </div>
                </Col>
                <Col className='col'>
                  <img src={sunrise_icon} alt="sunrise" style={{ width: "60px", height: "42px" }} />
                  <div>

                    <span>Sunrise </span>
                    <p>{new Date(weatherData.sunrise * 1000).toLocaleTimeString()} </p>

                  </div>
                </Col>
                <Col className="sun w-25">
                  <img src={sunset_icon} alt="sunset" style={{ width: "60px", height: "42px" }} />
                  <div>
                    <span> Sunset</span>
                    <p>{new Date(weatherData.sunset * 1000).toLocaleTimeString()}</p>

                  </div>
                </Col>
              </Row>

              <div className='video'>
                <div >
                  {videoSrc && (
                    <img src={videoSrc} alt="Weather background" className="background-video" />
                  )}
                </div>
              </div>

            </>
          )}

        </div>
      </div>

    </div>
  );
}

export default Weather
