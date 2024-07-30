import { useEffect, useState } from 'react'
import './App.css'


function App() {

  const [flag,setFlag]=useState(true);
useEffect(()=>{
  setTimeout(()=>{
    setFlag(false);
   },3000);
})
  

   
  return (

    <div className="App">

      

    </div>
  );
}

export default App;
