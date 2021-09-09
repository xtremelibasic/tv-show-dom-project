//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.className = "episodes";

  episodeList.forEach(episode => {
    
    //DIV
    const episodeDiv = document.createElement("div");
    episodeDiv.className = "episode";
    rootElem.append(episodeDiv);

    //Episode Title
    const title = document.createElement("h2");
    let seasonNumber = String(episode.season);
    let episodeNumber = String(episode.number);
    if(seasonNumber.length > 1){
      seasonNumber = seasonNumber;
    } else {
      seasonNumber = "0" + seasonNumber;
    }
    if(episodeNumber.length > 1){
      episodeNumber = episodeNumber;
    } else {
      episodeNumber = "0" + episodeNumber;
    }
    title.innerText = `${episode.name} S${seasonNumber}E${episodeNumber}`;
    episodeDiv.append(title)
    
    //Thumbnail
    const thumbnail = document.createElement("img");
    thumbnail.className = "thumbnail";
    thumbnail.src = episode.image.medium;
    thumbnail.alt = `${episode.name} season${episode.season} episode${episode.number}`;
    episodeDiv.append(thumbnail)

    //Summary
    const summary = document.createElement("div");
    summary.innerHTML = episode.summary;
    episodeDiv.append(summary);
  })

  //Disclaimer
  const disclaimer = document.createElement("h4");
  disclaimer.innerHTML = "All data in this page was originally gotten from <a href='https://www.tvmaze.com/1'>TVMaze.com</a>"
  rootElem.append(disclaimer);
}

window.onload = setup;
