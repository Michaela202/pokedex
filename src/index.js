import React from 'react';
import ReactDOM from 'react-dom';

import { RouterProvider, createHashRouter } from 'react-router-dom'; // Import RouterProvider

import App from './rountes/App.js';
import About from './rountes/About.js';
import Root from './rountes/Root.js';

const router = createHashRouter([
  {
      path: "/",
      element: <Root />,
      children:[
        {
          path: "/",
          element: <App />,
      },

        {
          path: "/about",
          element: <About />,
      },
     

      ]
  },
 
]);

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)