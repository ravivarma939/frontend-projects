import React from 'react'

const button = () => {
  return (
    <div>
        <button className='button'onClick={() =>{
            <div>
                 <span>{weather.name}</span>
                 <div className='city-temp'>
                {Math.round(weather.main.temp)}
                <sup>&deg;C</sup>
            </div>
            </div>
        }}>save</button>
     </div>
  )
}

export default button
