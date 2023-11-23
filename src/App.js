import React from 'react';
import CreatorName from './CreatorName';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const creatorIds = ["evakitty_xxx", "mianextdooor", "blckmini", "at1lanta"];

  return (
    <div className="App d-flex flex-wrap justify-content-center">
      {creatorIds.map(id => (
        <CreatorName key={id} creatorId={id} />
      ))}
    </div>
  );
}

export default App;
