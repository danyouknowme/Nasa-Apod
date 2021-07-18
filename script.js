const resultsNav = document.getElementById("resultsNav");
const favourtiesNav = document.getElementById("favouritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

const showContent = (page) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    loader.classList.add("hidden");
    if (page === "results") {
        resultsNav.classList.remove("hidden");
        favourtiesNav.classList.add("hidden");
    } else {
        resultsNav.classList.add("hidden");
        favourtiesNav.classList.remove("hidden");
    }
}

const createDOMNodes = (page) => {
    const currentArray = page === "results" ? resultsArray : Object.values(favourites);
    currentArray.forEach((result) => {
        // Card container
        const card = document.createElement("div");
        card.classList.add("card");
        // Link
        const link = document.createElement("a");
        link.href = result.hdurl;
        link.title = "View Full Image";
        link.target = "_blank";
        // Image
        const image = document.createElement("img");
        image.src = result.url;
        image.alt = "NASA Picture of the Day";
        link.loading = "lazy";
        image.classList.add("card-img-top");
        // Card Body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        // Card Title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement("p");
        saveText.classList.add("clickable");
        if (page === "results") {
            saveText.textContent = "Add to Favourites";
            saveText.setAttribute("onclick", `saveFavourite("${result.url}")`);
        } else {
            saveText.textContent = "Remove Favourites";
            saveText.setAttribute("onclick", `removeFavourite("${result.url}")`);
        }
        // Card Text
        const cardText = document.createElement("p");
        cardText.textContent = result.explanation;
        // Footer Container;
        const footer = document.createElement("small");
        footer.classList.add("text-muted");
        //  Date
        const date = document.createElement("strong");
        date.textContent = result.date;
        // Copyright
        const copyrightResult = !result.copyright ? "" : result.copyright;
        const copyright = document.createElement("span");
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

const updateDOM = (page) => {
    // Get Favourites from localStorage
    if (localStorage.getItem("nasaFavourites")) {
        favourites = JSON.parse(localStorage.getItem("nasaFavourites"));
    }
    imagesContainer.textContent = "";
    createDOMNodes(page);
    showContent(page);
}

// Get 10 Images from NASA API
const getNasaPictures = async () => {
    // Show Loader
    loader.classList.remove("hidden");
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM("results");
    } catch (error) {
        // Catch Error Here
    }
}

// Add result to Favourites
const saveFavourite = (itemUrl) => {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;
            // Show Save Confirmation for 2 Seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set Favourite in localStorage
            localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
        }
    });
}

// Remove item from Favourites
const removeFavourite = (itemUrl) => {
    if (favourites[itemUrl]) {
        delete favourites[itemUrl];
        // Set Favourite in localStorage
        localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
        updateDOM("favourites");
    }
}

getNasaPictures();