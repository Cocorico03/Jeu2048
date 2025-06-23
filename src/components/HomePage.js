import React from 'react';
import {Link} from 'react-router-dom';
import './HomePage.css';



function HomePage() {
  return (
    <div className='homepage'>

      <h1> Welcome to 2048 </h1>
      <p className='homePg'>
       Step into the thrilling universe of 2048, an irresistible puzzle that’s 
       captured the imagination of players young and old across the globe. 
       With its intuitive gameplay and addictive challenge, this game is as satisfying for quick breaks as it is for deep strategy sessions. 
       Whether you're just discovering the game or aiming for the coveted 2048 tile, you'll find a level that suits your pace.
        This version even offers a beginner-friendly mode where the goal is simply to reach 64, a perfect way to ease into the experience. So take a breath, sharpen your logic, and let the numbers dance!
      </p>
      <Link to="/game">
        <button className='play-button'> Play Now</button>
      </Link>
      
    </div>
  )
}

export default HomePage
