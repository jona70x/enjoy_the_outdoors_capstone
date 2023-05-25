"use strict";

// Import our custom CSS and boostrap modules
import "../scss/styles.scss";
// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

// Importing mountain data
import mountainsArray from "./data/mountainData";

// // Selecting elements

const mountainsContainer = document.querySelector(
  ".mountains-container"
) as HTMLDivElement;

// Interface

interface Mountain {
  name: string;
  elevation: number;
  effort: string;
  img: string;
  desc: string;
  coords: {
    lat: number;
    lng: number;
  };
}

const myModal = document.querySelector(".modal") as HTMLDivElement;
let cardModal: bootstrap.Modal;
let actualMountain: Mountain;
let actualMountainIndex: number;
// Functions

async function getSunsetForMountain(lat: number, lng: number) {
  let response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`
  );
  let data = await response.json();
  return data;
}

const generateMountainCards = (mountains: Mountain[]) => {
  const mountainsHtml = mountains
    .map(
      // Create a card element for each element in the array
      (mountain) =>
        `
     <div class="mountain mountain--cycling">
          <h2 class="mountain__title">${mountain.name} 🏔️</h2>
      
          <div class="mountain__details">
            <span class="mountain__icon">⬆️</span>
            <span class="mountain__value">Elevation</span>
            <span class="mountain__unit">${mountain.elevation} feet</span>
          </div>
     </div>
        `
    )
    .join("");
  // Insert to html
  mountainsContainer.insertAdjacentHTML("beforeend", mountainsHtml);
};

const attachModal = () => {
  // selecting all card elements generated in html
  const allMountains = document.querySelectorAll(".mountain");

  allMountains.forEach((mountain, index) => {
    mountain.addEventListener("click", (e) => {
      handleCardClick(e);
    });
    const actualMountain = mountain as HTMLDivElement;
    actualMountain.dataset.parkIndex = index.toString();
  });
};

const handleCardClick = async (event: Event) => {
  const target = event.target as HTMLDivElement;
  const mountain = target.closest(".mountain") as HTMLDivElement;
  if (mountain) {
    const parkIndex = mountain.dataset.parkIndex;

    if (parkIndex !== undefined) {
      actualMountain = mountainsArray[parseInt(parkIndex)];
      actualMountainIndex = parseInt(parkIndex);

      const mountainSunset = await getSunsetForMountain(44.320686, -71.291742);
      const sunset = mountainSunset.results.sunset;
      const sunrise = mountainSunset.results.sunrise;

      // Generate modal content
      myModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-background ">
            <div class="modal-body align-items-center  justify-content-center d-flex flex-column">
              <div class="card park-card overflow-hidden" style="width: 25rem; height:auto">
              <img src="../assets/${actualMountain.img}" class="card-img-top" alt="${actualMountain.name}">
                  <div class="card-body">
                    <h3 class="card-title text-center mb-4">${actualMountain.name} 🏔️</h3>
                    <p class="card-text">
                      <ul class='lh-lg'>
                          <li><span class='fw-bold'>
                          ⬆️ Elevation: </span>${actualMountain.elevation} feet</li>
                          <li><span class='fw-bold'>
                         🏋🏼 Effort: </span>${actualMountain.effort}</li>
                        <li><span class='fw-bold'>📝 Description: </span>${actualMountain.desc}</li>
                        <li><span class='fw-bold'>🗺️ Coordinates: </span>${actualMountain.coords.lat}, ${actualMountain.coords.lng}</li>
                        <li><span class='fw-bold'>☀️ Sunrise: </span>${sunrise} UTC </li>
                        <li><span class='fw-bold'>🌑 Sunset: </span>${sunset} UTC</li>
                      </ul>
  
                    </p>
                  </div>
              </div>
            </div>
            <div class='d-flex justify-content-center gap-2 mb-3'>
              <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-outline-light">Save changes</button>
            </div>
          </div>
        </div>
        `;
      cardModal = new bootstrap.Modal(myModal);
      cardModal.show();
    }
  }
};

// const app = (selectType: string) => {
//   // When a state / type park is selected, display the parks that meet the criteria
//   helpers.cleanElement(parksContainer);
//   const selectedOptionIndex =
//     selectType === "location"
//       ? selectByLocation.selectedIndex
//       : selectByType.selectedIndex;
//   // Calculate index of selected option
//   const selectedOption =
//     selectType === "location"
//       ? (selectByLocation[selectedOptionIndex] as HTMLOptionElement)
//       : (selectByType[selectedOptionIndex] as HTMLOptionElement);

//   const selectedValue = selectedOption.value.toLowerCase();

//   // Cleaning parks array
//   parks = [];

//   for (const park of nationalParksArray) {
//     if (park.LocationName.toLowerCase().includes(selectedValue)) {
//       // Storing generated parks
//       parks.push(park);
//     } else if (park.State.toLowerCase() === selectedValue) {
//       parks.push(park);
//     } else if (selectType === "all") {
//       parks.push(park);
//     }
//   }
//   // Generating html cards
//   helpers.generateHtmlParkCards(parks);
//   // Attaching modal to cards
//   helpers.attachModal();
//   //
//   addInformationContent(parks);

//   const card = document.querySelector(".modal");
//   card?.addEventListener("click", (e) => {
//     const target = e.target as HTMLButtonElement;
//     if (target.classList.contains("btn-save")) {
//
//     }
//   });
// };

// // Event Listeners
window.addEventListener("load", () => {
  // Populates mountain container
  generateMountainCards(mountainsArray);
  attachModal();
});
