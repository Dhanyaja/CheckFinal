import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // const url = "https://checkfinal.onrender.com";
  const url = "http://localhost:4000"; // Change this to your backend URL
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [cardsCount, setCardsCount] = useState("");
  const [dueCardsLength, setDueCardsLength] = useState(0);
  const [isDark, setIsDark] = useState(false);

  //for decks
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchDecks();
    cardsCountFunc();
    dueCardsFunc();
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      setIsDark(false);
    }
  }, []);

  const fetchDecks = async () => {
    const newUrl = `${url}/api/deck/decklist`;
    try {
      const response = await axios.get(newUrl, {
        headers: { token },
      });
      const deckData = response.data?.data || [];
      const sortedDecks = deckData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setDecks(sortedDecks);
    } catch (error) {
      console.log(error);
    }
  };

  const cardsCountFunc = async () => {
    const newUrl = `${url}/api/card/cardsCount`;
    try {
      const response = await axios.get(newUrl, { headers: { token: token } });
      setCardsCount(() => response.data.data);
      // setCardsCount(response.data.data)
    } catch (error) {
      console.log(error);
    }
  };

  // due cards logic

  const dueCardsFunc = async () => {
    const newUrl = `${url}/api/card/due`;
    try {
      const response = await axios.get(newUrl, { headers: { token: token } });
      setDueCardsLength((response.data?.data || []).length);
    } catch (error) {
      console.log(error);
      setDueCardsLength(0);
    }
  };

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const contextValue = {
    url,
    token,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    userName,
    setUserName,
    userId,
    setUserId,
    decks,
    setDecks,
    cards,
    setCards,
    fetchDecks,
    cardsCountFunc,
    cardsCount,
    dueCardsLength,
    dueCardsFunc,
    isDark,
    setIsDark,
    toggleTheme,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
