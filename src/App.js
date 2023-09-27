import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnimeItem from "./components/Anime App/AnimeItem";
import Gallery from "./components/Anime App/Gallery";
import Homepage from "./components/Anime App/Homepage";
import { AnimeProvider, AnimeContext } from './components/Anime App/AnimeContext';
import NavBar from './components/Anime App/NavBar';
import CurrentlyWatching from "./components/Anime App/CurrentlyWatching";
import Completed from "./components/Anime App/Completed";
import PlanToWatch from "./components/Anime App/PlanToWatch";
import Notification from './components/Anime App/Notification';
import LandingPage from "./components/Anime App/LandingPage";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const [rendered, setRendered] = React.useState('popular');
  

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
          <AnimeProvider>
            <BrowserRouter>
            <UserButton />
              <NavBar />
                <Routes>
                  <Route path="/" element={<Homepage rendered={rendered} setRendered={setRendered} />} />
                  <Route path="/anime/:id" element={<AnimeItem />} />
                  <Route path="/character/:id" element={<Gallery />} />
                  <Route path='/plan-to-watch' element={<PlanToWatch />} />
                  <Route path="/currently-watching" element={<CurrentlyWatching />} />
                  <Route path="/completed" element={<Completed />} />
                  <Route path="/landing" element={<LandingPage />} />
                </Routes>
              <NotificationWrapper />
            </BrowserRouter>
          </AnimeProvider>
      
      </SignedIn>
      
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider> 
  );
}

const NotificationWrapper = () => {
  const { notification, setNotification } = React.useContext(AnimeContext);
  return notification && <Notification message={notification} setNotification={setNotification} />;
}

export default App;
