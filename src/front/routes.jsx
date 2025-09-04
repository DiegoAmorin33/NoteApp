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
import LoginForm from "./pages/LoginForm";
import Profile from "./pages/Profile"; // ✅ Importación corregida

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path= "/" element={<Home />} />
      <Route path= "/profile" element={<Profile />} /> 
      <Route path="/single/:theId" element={ <Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/RegisterForm" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/noteDetail/:id" element={<NoteDetail />} />
    </Route>
  )
);