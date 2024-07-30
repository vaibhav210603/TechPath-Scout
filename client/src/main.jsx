import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
  import Hero from './components/Hero'
  import Quiz from './components/Quiz'
  import Layout from './components/Layout.jsx';
  import Contact from './components/Contact.jsx';
import ResultGen from './components/ResultGen.jsx';
  




  const router = createBrowserRouter([
    {
    element:<Layout/>,
   children:[
     {
      path: "/",
      element: <Hero/>
    },

    {
        path: "/quiz",
        element: <Quiz/>
      },

    {
        path: "/contact",
        element: <Contact/>
      },
    {
        path: "/resultgen",
        element: <ResultGen/>
      },
   
      
    
    ]

    }
  ]);
  

ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router}/>
    
  
)
