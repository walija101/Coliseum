import React from "react";
import AddFriends from "./AddFriends";
import Swiping from "./Swiping";

// react is awesome

function Home(){
  return(
    <div className="w-full h-full flex items-center justify-center">
      <Swiping />
    </div>
  );
}

export default Home;
