import { createContext, useContext, useEffect, useState } from 'react';

const uniContexts = createContext();
export const useUniContexts = () => useContext(uniContexts);

function UniContexts({ children }) {
  // user
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // calculator page
  const [items, setItems] = useState([]);
  const [isCalcExpanded, setIsCalcExpanded] = useState(true);
  const [session, setSession] = useState({
    id: '',
    sessionTitle: '',
    sessionAt: '',
    sessionTotal: 0,
    bazarList: [],
    month: '',
    year: '',
  });
  const [totalSessions, setTotalSessions] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('hasData')) return;
    console.log(totalSessions);
  }, [totalSessions]);

  // all the functions need a separate FunctionContext.jsx file.
  // object to save in the local Storage
  // {
  //   date: '9-2025',
  //   sessions: [...totalSessions]
  // }

  useEffect(() => {
    const hasData = localStorage.getItem('hasData');
    if (!hasData) {
      setTotalSessions([
        {
          id: 'laskdjf',
          sessionTitle: 'custom title',
          sessionAt: new Date(),
          sessionTotal: 120,
          bazarList: [
            {
              id: 'fdasdf',
              itemName: 'lau',
              price: 40,
              unit: 'kg',
              quantity: 2,
              total: 80,
              addedAt: new Date(),
            },
          ],
          month: '9',
          year: '2025',
        },
      ]);
      localStorage.setItem(
        'bazarSessions',
        JSON.stringify([
          {
            id: 'laskdjf',
            sessionTitle: 'custom title',
            sessionAt: new Date(),
            sessionTotal: 120,
            bazarList: [
              {
                id: 'fdasdf',
                itemName: 'lau',
                price: 40,
                unit: 'kg',
                quantity: 2,
                total: 80,
                addedAt: new Date(),
              },
            ],
            month: '9',
            year: '2025',
          },
        ]),
      );
      localStorage.setItem('hasData', 'true');
      return;
    }

    setTotalSessions(JSON.parse(localStorage.getItem('bazarSessions')));
  }, []);

  return <uniContexts.Provider value={{ isLoggedIn, setIsLoggedIn, items, setItems, totalSessions, setTotalSessions, isCalcExpanded, setIsCalcExpanded, session, setSession }}>{children}</uniContexts.Provider>;
}

export default UniContexts;
