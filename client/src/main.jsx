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
import SignIn from './components/pages/signin/SignIn.jsx';
import Contact from './components/pages/contact/Contact.jsx';
import Loading from './components/Loading'; // Import the Loading component

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
        path: "/resultgen",
        element: <ResultGen />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      
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
