import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Hero from './components/pages/home/Hero';
import Quiz from './components/Quiz';
import Layout from './components/Layout.jsx';
import Assistant from './components/pages/assistant/Assistant.jsx';
import ResultGen from './components/pages/resultgen/ResultGen';
import Preresultgen from './components/pages/preresultgen/Preresultgen';
import SignIn from './components/pages/signin/SignIn.jsx';
import Login from './components/pages/signin/Login.jsx';
import Contact from './components/pages/contact/Contact.jsx';
import Loading from './components/Loading'; // Import the Loading component
import FAQ from './components/pages/FAQ/Faq.jsx';
import AboutUs from './components/pages/aboutus/AboutUs.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Hero />,
      },
      {
        path: "/quiz",
        element: <Quiz />,
      },

      {
        path: "/assistant",
        element: <Assistant />,
      },

      {
        path: "/preresultgen",
        element: <Preresultgen/>,
      },

      {
        path: "/resultgen",
        element: <ResultGen />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },

      {
        path:"/FAQ",
        element:<FAQ></FAQ>
      }
      ,
      {
        path:"/AboutUs",
        element:<AboutUs></AboutUs>
      }
      
    ],
  },
]);

const Root = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      {!loadingComplete && <Loading onLoadingComplete={() => setLoadingComplete(true)} />}
      {loadingComplete && <RouterProvider router={router} />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
