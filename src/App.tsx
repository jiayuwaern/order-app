import React, { useEffect, useState }  from 'react';
import logo from './logo.svg';
import './App.scss';
import axios from 'axios';
import { distance }  from './Hooks/useLocationDistance';
import Menu from './Component/Menu/Menu'

interface RestaurantItem {
  id: number,
  name: string,
  address1: string,
  address2: string,
  latitude: number,
  longitude: number
}

interface menuItem {
    id: number,
    category: string,
    name: string,
    topping: string[],
    price: number,
    rank: number,
}

interface GeoItem {
  latitude: number,
  longitude: number
}

interface Test {
  defaultLatitude: number,
  defaultLongitude: number,
  coords?: GeolocationCoordinates; 
  timestamp?: number;
}

function App() {
  const [restaurantList, setRestaurantList] = useState<RestaurantItem[]|[]>([]);
  const [restaurantGeo, setRestaurantGeo] = useState<GeoItem[]|[]>([]);
  const [locationPosition, setLocationPosition] = useState<Test>();
  const [menuList, setMenuList] = useState<menuItem[]|[]>([]);


  const getRestaurantList = async () => {
    setMenuList([]);
    const result = await axios(
      'https://private-anon-3f35ae8fa6-pizzaapp.apiary-mock.com/restaurants/',
    );
    const list = result.data;
    setRestaurantList(list);
    restaurantList?.forEach(item =>
      setRestaurantGeo(pre => [...pre, {
        latitude: item.latitude,
        longitude: item.longitude,
      }]));
  };

  const getFinalTrial = () => {
    if (restaurantGeo.length >= 1 && locationPosition !== undefined) {
      const trialLatitude = restaurantGeo.map(item => item.latitude);
      const trialLongtude = restaurantGeo.map(item => item.longitude);
      const distanceArray = trialLatitude.map((lat, index) => {
        const log = trialLongtude[index];
        return (
          distance(
            locationPosition?.defaultLatitude!,
            locationPosition?.defaultLongitude! ,
            lat,
            log
          )
        )
      });
      const closest = Math.min(...distanceArray);
      const closestLocationIndex = distanceArray.indexOf(closest);
      const closestGeo = restaurantGeo[closestLocationIndex];
      const closestIndex = restaurantList.findIndex(item => item.longitude === closestGeo.longitude);
      let newRestaurantList = [...restaurantList];
      newRestaurantList.unshift((newRestaurantList.splice(closestIndex))[0]);
      setRestaurantList(newRestaurantList);
    }
    return {};
  }

  const displayMenu = async (event: any) => {
    const restaurantName = event.target.value;
    const findObj = restaurantList.find(item => restaurantName === item.name);
    const result = await axios(
      `https://private-anon-e5167252df-pizzaapp.apiary-mock.com/restaurants/${findObj?.id}/menu?category=Pizza&orderBy=rank`,
    );
    const list = result.data;
    setMenuList(list);
  }
  
  // Fetch restaurant list when the page is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      getRestaurantList();
      getFinalTrial();
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  // Get restaurant Geolocation when the restaurantList updated
  useEffect(() => {
    restaurantList?.forEach(item =>
      setRestaurantGeo(pre => [...pre, {
        latitude: item.latitude,
        longitude: item.longitude,
      }]));
  }, [restaurantList]);

  // Get user Geolocation when the page is loaded
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
          setLocationPosition({
              ...position,
              defaultLatitude: position.coords.latitude,
              defaultLongitude: position.coords.longitude
          });
      });
  } 
}, []);

  return (
    <div>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>pizzeria</p>
          <div  className='App-list'>
            {(restaurantList && menuList.length === 0) ? restaurantList.map((item, index) =>
              <button key={index} value={item.name} onClick={(event) => displayMenu(event)}>{item.name}</button>) : ''}
          </div>
          {(menuList.length === 0) ? (<button onClick={() => getFinalTrial()}>Find the cloest restaurant</button>
          ) : ""}
        </header>
      </div>
      <Menu menuList={menuList} />
    </div>
  );
}

export default App;
