import React from 'react';
import CreatorName from './CreatorName';


function App() {
  const creatorIds = [
    "abbeyrhode", "adelveigel", "alice_lo", "ambersweetheart",
    "amyclayre", "anna_kyoto", "annagreat", "annielust",
    "arabelladerose", "arilaviee", "ariaoki", "asian.candy",
    "asian_eye", "asian_gaze", "asiadoll",
    "baby_yona", "babykenzvip", "babyvannessa", "barbie_cake",
    "bella_lla", "bellabumzy", "belle_deli", "bunny_polly",
    "cocoalicemodel", "come_to_my_bad", "cowgirlcandice",
    "cjfanspage", "cjmiles", "draken_lady", "elaina_stjames", "elizza_kitten",
    "emilly_vip", "fitbryceadams",
    "funsizedasian", "gingerteeny", "gianna_diorxxx", "goldentier",
    , "hongkongdoll", "imurhappiness",
    "innocentcailyn", "issakaraj", "itsdaniday", "jenawolfy",
    "judyevans69", "karina_sm", "kat.aphrodisiac", "katemaxx",
    "kathrineonline", "katiebeex", "katielin_nextdoor",
    "kkimkkimmy", "kleioxxx", "kira.evans",
    "laurenjasmine", "leliloo",
    "lil_lolli1", "lilymichi",
    "lorengrey", "lucymochi", "lu2hot", "maidavika", "marissafrost",
    "mi_ameli", "milkimind",
    "milkydi_vip", "miss_sweet_mia", "misslee403",
    "misswarmjfree", "darcylovesyou", "sexythangyang",
    "obeymistressterra", "bunni.emmie", "lilykawaii",
    "bridgetteb", "lolatessa", "your_lusty_mom", "darkmoon_rider",
    "sofiasilk", "jamie_marie", "honeygold",
    "theconnelltwins", "tinyhakka", "vintagebarbiex",
    "eroticmedusa", "thejinnychu", "meridianaua", "jessy_nanny",
    "kazumisworld", "princessisi", "babe_cherry",
    "aeasia", "spo0pykitten", "im.over.covid", "leahgoeswilde",
    "liakoh", "rhiannonblue", "eva_moses", "soffi_fire",
    "madison420ivy", "neptuneexplainsitall",
    "miakhalifa", "thebumbumqueen", "jameelahh", "princess_kidaa", "jasmine.mills",
    "sayori_shai", "jessbess", "veronicarae", "noemiedufresne",
    "princessarits", "lilsatanbaby", "wetchinaaa", "danahamm",
    "ninamilano", "sukisucchouse69", "anriokita_real", "ivycooperrr",
    "sheis_bond", "leilaniangelvip", "yaela_vonk", "stellewds",
    "wednesday_add", "itstarasins", "theabbycross",
    "lilkymchiii", "jasmineteaa", "baybekimchi", "getwilder",
    "perripiper", "myamira", "minori_rise", "kaylee",
    "kaylanileix", "rocketreyna", "vegasasianchick", "allipark22",
    "mayukoxo", "may_judy", "at1lanta", "kimbyx",
    "liliflower2002", "sandy_mell_rose", "mamemm1", "gina-gerson",
    "jadejuice", "kamillavanilla", "emmafiore", "miaaangelll",
    "annetyoursexy", "terry_grace", "skylarmaexo", "fitbryceflix",
    "jenny_eyre_jenny", "livvalittle", "caireen", "kitsune_bb",
    "anvavx", "rachel_blush", "youngnsexy18",
    "raychel_kiss", "anaimiya", "blondie.claire", "patty_kawaii",
    "kitten_sophie", "mailyti", "red_mila", "miastars"
  ];


  return (
    <div className="App d-flex flex-wrap justify-content-center">
      {creatorIds.map(id => (
        <CreatorName key={id} creatorId={id} />
      ))}
    </div>
  );
}

export default App;