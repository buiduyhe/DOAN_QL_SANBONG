import React from "react";
import Navbar from "../../component/Navbar/Navbar";
import Carousel from "./Carousel/carousel";
import Search from "./Search/Search";
import Popular from "./ProductPopular/Popular";
import San from "./San/San";
import Booksan from "./BookSan/Booksan";
import Footer from "../../component/Footer/Footer";
const Home = () => {
  return (
    <div>
      <Navbar />
      <Carousel />
      <Search />
      <Popular />
      <San />
      <Booksan />
      <Footer />
    </div>
  );
};

export default Home;
