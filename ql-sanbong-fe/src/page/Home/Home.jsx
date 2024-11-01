import React from "react";
import Navbar from "../../component/Navbar/Navbar";
import Carousel from "./Carousel/carousel";
import Search from "./Search/Search";
import Popular from "./ProductPopular/Popular";
import San from "./San/San";
const Home = () => {
  return (
    <div>
      <Navbar />
      <Carousel />
      <Search />
      <Popular />
      <San />
    </div>
  );
};

export default Home;
