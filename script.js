let currentSong = new Audio()
let songs;
var album = document.querySelector("#album");
var currFolder = album.innerHTML
var cards;
let folder;
// console.log(cards);

function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(currFolder) {
    let a = await fetch(`songs/${currFolder}`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    console.log(response);

    return songs
}





function playMusic(track, pause = false) {
    currentSong.src = ("/songs" + `/${currFolder}/` + track)
    if (!pause) {

        currentSong.play()
        playSong.src = "svgs/pause.svg"
        // console.log(currentSong.src);


    }

    let songName = document.querySelector(".songname")
    songName.innerHTML = decodeURI(track)
    // let songDuration = document.querySelector(".songtime")
    // songDuration.innerHTML
    // console.log(currentSong.src);
}

async function main() {
    songs = await getSongs(currFolder);
    dynamicAlbums()




    playMusic(songs[0].split(`/${currFolder}/`)[1], true)

    for (const song of songs) {
        let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]

        songUL.innerHTML = songUL.innerHTML + `<li>
                            <div class="song">
                                <img src="svgs/music.svg" alt="">
                                <div class="songinfo"><div>${song.split(`/${currFolder}/`)[1].replaceAll("%20", " ")}</div></div>
                            </div>
                            <img src="svgs/play.svg" alt="" class="invert">
                           </li>`

        Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", () => {
                let track = e.querySelector(".songinfo").firstElementChild.innerHTML
                // console.log(track);

                playMusic(track);
                playSong.src = "svgs/pause.svg"

                // let songName = document.querySelector(".songname")
                // songName.innerHTML = track
                // let songDuration = document.querySelector(".songtime")
                // songDuration.innerHTML

            })

        });
    }
    let playSong = document.querySelector("#playSong");

    playSong.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playSong.src = "svgs/pause.svg"
        }
        else {
            currentSong.pause()
            playSong.src = "svgs/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        let songDuration = document.querySelector(".songtime")
        songDuration.innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 98.5 + "%"
    })

    let seekbar = document.querySelector(".seekbar")
    seekbar.addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration * percent) / 100)
    })

    let hamburger = document.querySelector(".hamburger")
    hamburger.addEventListener("click", () => {
        document.querySelector(".left").style.left = "-10px"
    })

    let close = document.querySelector(".close")
    close.addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    next.addEventListener("click", (e) => {
        let index = songs.indexOf(currentSong.src)

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].split(`/${currFolder}/`)[1]);
            playSong.src = "svgs/pause.svg"
        }
    })

    last.addEventListener("click", (e) => {
        let index = songs.indexOf(currentSong.src)

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].split(`/${currFolder}/`)[1]);
            playSong.src = "svgs/pause.svg"
        }
    })

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {

        currentSong.volume = (e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = "svgs/volume.svg"
        }


    })
    document.querySelector(".volume>img").addEventListener("click", (e) => {


        if (e.target.src.includes("svgs/volume.svg")) {
            e.target.src = "svgs/mute.svg"
            currentSong.volume = 0
            document.querySelector("#range").value = 0
        }
        else {
            e.target.src = "svgs/volume.svg"
            currentSong.volume = .20
            document.querySelector("#range").value = 20
            // console.log(range.value);

        }

    })

}


async function dynamicAlbums() {
    let a = await fetch(`songs/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    let cardContainer = document.querySelector(".cardContainer");

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            folder = e.href.split("/").slice(-2)[0];

            let a = await fetch(`songs/${folder}/info.json`)
            let response = await a.json()

            cardContainer.innerHTML += `<div class="card" data-folder=${folder}>
                    <div class="play">
                    <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                    <!-- Green Circle -->
                    <circle cx="25" cy="25" r="20" fill="#1ed760" />
                    <!-- Play Button Triangle -->
                    <polygon points="20,15 20,35 35,25" fill="black" />
                    </svg>
                    
                    </div>
                    <img src="/songs/${folder}/cover.jpeg" alt="happyHits">
                    <h2>${response.title}</h2>
                    <p style="font-size: 0.8rem;">${response.description}</p>
                    </div>`

        }

    }
    let previousSelectedCard = null;

    Array.from(document.querySelectorAll(".card")).forEach(card => {
        card.addEventListener("click", async (e) => {

            if (previousSelectedCard) {
                previousSelectedCard.classList.remove("active");
            }

            card.classList.add("active");
            previousSelectedCard = card;
            // console.log(previousSelectedCard);

            if (window.matchMedia("(max-width: 500px)").matches) {
                // console.log("its working");

                document.querySelector(".left").style = "left:-10px; transition: all 1s ease-out"
            }

            // Update the current folder when a card is clicked
            currFolder = card.dataset.folder;
            album.innerHTML = currFolder; // Display the current folder
            // console.log(`Updated folder: ${currFolder}`);


            // Fetch and update the song list
            songs = await getSongs(currFolder);

            // Clear the current song list before adding new ones
            let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
            songUL.innerHTML = ""; // Clear previous song list
            // Populate the new song list
            songs.forEach(song => {

                songUL.innerHTML += `<li>
                                        <div class="song">
                                        <img src="svgs/music.svg" alt="">
                                        <div class="songinfo">
                                        <div>${song.split(`/${currFolder}/`)[1].replaceAll("%20", " ")}</div>
                                        </div>
                                        </div>
                                        <img src="svgs/play.svg" alt="" class="invert">
                                    </li>`;
            });

            
            playMusic(songs[0].split(`/${currFolder}/`)[1], true);


            // Re-attach event listeners for each new song item
            Array.from(songUL.getElementsByTagName("li")).forEach(item => {
                item.addEventListener("click", () => {
                    let track = item.querySelector(".songinfo").firstElementChild.innerHTML;
                    // console.log(`Playing track: ${track}`);
                    playMusic(track);
                    playSong.src = "svgs/pause.svg";
                });
            });
        });
    });

}
main()

