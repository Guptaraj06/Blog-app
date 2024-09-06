import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Header from "./components/Header";
import About from "./pages/About";
import Footer from "./components/Footer";
import PrivateRouter from "./components/PrivateRouter";
import OnlyAdminPrivateRouter from "./components/OnlyAdminPrivateRouter";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import ScrollToTop from "./components/ScrollToTop";
import PostPage from "./pages/PostPage";
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route element={<PrivateRouter />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRouter />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>

        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
};

export default App;
