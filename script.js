let showsDropDown = document.getElementById("chooseShowDropDown")
let allShows = getAllShows();
let showNameArray = [];

allShows.forEach(show => {
  showNameArray.push(show.name);
})

showNameArray.sort().forEach(showName => {
let showOption = document.createElement("option")
showOption.innerText = showName;
showsDropDown.append(showOption);
})

showsDropDown.addEventListener("change", function(e){
  allShows.forEach(show => {
    if(show.name === e.target.value){
      let apiUrl = "https://api.tvmaze.com/shows/"+ show.id + "/episodes";
      fetch(apiUrl)
      .then(response => response.json())
      .then(data => { 
        let allEpisodes = data;

        function setup() {
          makeEpisodeDropDown(allEpisodes);
          makePageForEpisodes(allEpisodes);
        }

        //This function determines the format of the season and episode nunmber
        function createSeasonDisplayFormat(episodeList){
          let arrayOfEpisodes = [];
          let episodeDisplayFormat = "";
          episodeList.forEach(episode => {
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
            episodeDisplayFormat = `S${seasonNumber}E${episodeNumber}`;
            arrayOfEpisodes.push(episodeDisplayFormat)
          })
          return arrayOfEpisodes;
        }

        //This function makes a div for each movie
        function makePageForEpisodes(episodeList) {
          const rootElem = document.getElementById("root");
          rootElem.innerHTML = "";
          rootElem.className = "episodesContainer";

          //episodes Container
            const episodesContainer= document.createElement("div");
            episodesContainer.className = "episodes";
            rootElem.append(episodesContainer);

          episodeList.forEach((episode, episodeIndex) => {
            //episodes
            const episodeDiv = document.createElement("div");
            episodeDiv.className = "episode";
            episodesContainer.append(episodeDiv);

            //Episode Title
            const title = document.createElement("h2");
            let episodeDisplayFormatArray = createSeasonDisplayFormat(allEpisodes);
            episodeDisplayFormatArray.forEach((format, formatIndex) => {
              if(formatIndex === episodeIndex){
                title.innerText = `${episode.name} ${format}`;
              }
            })
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




        //This function handles the search function
        function search(episodeList){
          let searchResult = [];
          let matchCounter = 0;
          let regex = new RegExp(searchValue, 'i');
          episodeList.forEach( episode =>  {
            let episodeName = episode.name;
            let episodeSummary = episode.summary;
            if (regex.test(episodeName) || regex.test(episodeSummary)){
              matchCounter++;
              searchResult.push(episode) 
            }
          })

          makePageForEpisodes(searchResult);
          if(matchCounter !== 73){
            const rootElem = document.getElementById("root");
            matchValue = document.createElement("h1");
            matchValue.innerText = matchCounter + " matches found";
            rootElem.prepend(matchValue)
          }
        }


        window.onload = setup()

        document.getElementById("search").addEventListener("input", function(){
          searchValue = document.getElementById("search").value;
          search(allEpisodes)
        })

        //This function creates each dropdown option element
        function makeEpisodeDropDown(episodeList){
          const dropDown = document.getElementById("dropDown");
          episodeList.forEach((episode, episodeIndex) => {
            let episodeOption = document.createElement("option");
            let episodeDisplayFormatArray = createSeasonDisplayFormat(allEpisodes);
          
            episodeDisplayFormatArray.forEach((format, formatIndex) => {
              if(formatIndex === episodeIndex){
                episodeOption.innerText = `${format} - ${episode.name}`;
              }
            })
            dropDown.append(episodeOption);
          })
          
        }

        let dropDown = document.getElementById("dropDown");
        let showAllBtn = document.getElementById("showAllBtn")

        //This event listener listens for if an option has been chosen
        dropDown.addEventListener("change", function(e){
          searchValue = this.value.slice(9);
          search(allEpisodes)
        })

        //This button shows all the movies
        showAllBtn.addEventListener("click", function(){
          searchValue = "";
          search(allEpisodes);
        })

      })
      .catch((error) => console.warn(error))
    }
  })
})