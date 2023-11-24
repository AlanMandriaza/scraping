import React from 'react';
import CreatorName from './CreatorName';


function App() {
  const creatorIds = ["evakitty_xxx", "mianextdooor", "may_judy", "at1lanta", "divacherry", "liliflower2002", "sandy_mell_rose", "sabri_di", "gina-gerson", "jadejuice", "kamillavanilla"];

  return (
    <div className="App d-flex flex-wrap justify-content-center">
      {creatorIds.map(id => (
        <CreatorName key={id} creatorId={id} />
      ))}
    </div>
  );
}

export default App;
