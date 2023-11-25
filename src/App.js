import React from 'react';
import CreatorName from './CreatorName';


function App() {
  const creatorIds = ["lizzy_vixxen","myamira", "mayukoxo", "may_judy", "at1lanta", "kimbyx", "liliflower2002", "sandy_mell_rose", "mamemm1", "gina-gerson", "jadejuice",
   "kamillavanilla", "emmafiore", "miaaangelll", "annetyoursexy", "wednesday_add", "terry_grace", "skylarmaexo", "fitbryceflix",
    "jenny_eyre_jenny", "livvalittle", "caireen", "kitsune_bb", "milkimind", "kkimkkimmy", "u9712828" , "anvavx", "rachel_blush", 
    "youngnsexy18", "babyvannessa","raychel_kiss","anaimiya","blondie.claire","patty_kawaii","kitten_sophie","mailyti","red_mila","miastars" ];

  return (
    <div className="App d-flex flex-wrap justify-content-center">
      {creatorIds.map(id => (
        <CreatorName key={id} creatorId={id} />
      ))}
    </div>
  );
}

export default App;
