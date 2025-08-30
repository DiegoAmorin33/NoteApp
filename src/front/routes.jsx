import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import NoteDetail from "./pages/NoteDetail";

import RegisterForm from "./pages/RegisterForm";

import { Profile } from "./pages/Profile";


export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route index element={<Home />} /> 
        <Route path="/single/:theId" element={ <Single />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/noteDetail" element={<NoteDetail />} />

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path= "/" element={<Home />} />
        <Route path= "/Profile" element={<Profile />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
      </Route>
    )
); 