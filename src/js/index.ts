"use strict";

// Import our custom CSS and boostrap modules
import "../scss/styles.scss";
// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

// Importing park data

import parkTypeData from "./data/parkTypeData";
import locationsArray from "./data/locationData";
import nationalParksArray from "./data/nationalParkData";
import { Modal } from "bootstrap";

// Selecting elements

const selectByType = document.querySelector(
  "#select-park-type"
) as HTMLSelectElement;

const selectByLocation = document.querySelector(
  "#select-park-location"
) as HTMLSelectElement;

const parksContainer = document.querySelector(
  ".parks-container"
) as HTMLDivElement;

const buttonsContainer = document.querySelector(
  ".buttons-container"
) as HTMLDivElement;

const myModal = document.querySelector(".modal") as HTMLDivElement;
let cardModal: Modal;

// Variables
let actualPark: Park;
let actualParkIndex: number;
let parks: Park[] = [];

// Interfaces
interface Park {
  LocationID: string;
  LocationName: string;
  Address: string | number;
  City: string;
  State: string;
  ZipCode: number | string;
  Phone: string | number;
  Fax: string | number;
  Latitude: number;
  Longitude: number;
  Location: { coordinates: number[]; type: string };
}

interface Helpers {
  cleanElement: (element: HTMLElement) => void;
  generateHtmlParkCards: (parks: Park[]) => void;
  attachModal: () => void;
  handleCardClick: (event: Event) => void;
}

// Functions
const helpers: Helpers = {
  // Clears container content
  cleanElement: (element: HTMLElement) => {
    element.textContent = "";
  },
  generateHtmlParkCards: (parks: Park[]) => {
    const newHTML = parks.map(
      // Create a card element for each element in the array
      (parkHtml) =>
        `
        <div class="card card-background cursor-pointer">
        <div class="card__icon fs-1"><span>🏔️</span></div>
        <h4 class="card__title">
          ${parkHtml.LocationName}
        </h4>
        <p class="card__apply">
          <span class="card__state">${parkHtml.State}, ${parkHtml.City} 🗺️</span>
        </p>
      </div>
      `
    );
    // Insert to html
    parksContainer.insertAdjacentHTML("beforeend", newHTML.join(""));
  },
  // Managing all parks modals
  attachModal: () => {
    // selecting all card elements generated in html
    const allParks = document.querySelectorAll(".card");

    allParks.forEach((park, index) => {
      park.addEventListener("click", helpers.handleCardClick);
      const actualPark = park as HTMLDivElement;
      actualPark.dataset.parkIndex = index.toString();
    });
  },
  handleCardClick(event) {
    const target = event.target as HTMLDivElement;
    // if(target !== null){}
    const card = target.closest(".card") as HTMLDivElement;
    if (card) {
      const parkIndex = card.dataset.parkIndex;
      console.log(parkIndex);
      if (parkIndex !== undefined) {
        actualPark = parks[parseInt(parkIndex)];
        actualParkIndex = parseInt(parkIndex);
        // Generate modal content
        myModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered ">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fs-5 r" id="exampleModalLabel">${actualPark.LocationName}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body align-items-center justify-content-center d-flex flex-column">
          <div class="card" style="width: 18rem;">
          <div class="card-body ">
            <h5 class="card-title text-center">${actualPark.LocationName}</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          </div>
        </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary btn-save">Save changes</button>
          </div>
        </div>
      </div>
      `;
        cardModal = new bootstrap.Modal(myModal);
        cardModal.show();
      }
    }
  },
};

/**
 * Populates dropdowns with option elements
 * @param {array} queryArray - Arrays that contains the queries. It could be Park Location or Park Type.
 * @param {HTMLSelectElement} element - Select element to add options
 */
const populateDropdown = (
  queryArray: string[],
  element: HTMLSelectElement
): void => {
  // Create a default option with null as the default value
  const defaultOption = new Option("Select One...", "null");
  // Insert default option
  element.insertAdjacentElement("beforeend", defaultOption);
  // Loop over the queryArray and get each individual element
  for (const query of queryArray) {
    // Create a option object for each element
    const newOption = new Option(query, query.toLowerCase());
    // Add the option element to the select dropdown
    element.insertAdjacentElement("beforeend", newOption);
  }
};

const app = (selectType: string) => {
  // When a state / type park is selected, display the parks that meet the criteria
  helpers.cleanElement(parksContainer);
  const selectedOptionIndex =
    selectType === "location"
      ? selectByLocation.selectedIndex
      : selectByType.selectedIndex;
  // Calculate index of selected option
  const selectedOption =
    selectType === "location"
      ? (selectByLocation[selectedOptionIndex] as HTMLOptionElement)
      : (selectByType[selectedOptionIndex] as HTMLOptionElement);

  const selectedValue = selectedOption.value.toLowerCase();

  // Cleaning parks array
  parks = [];

  for (const park of nationalParksArray) {
    if (park.LocationName.toLowerCase().includes(selectedValue)) {
      // Storing generated parks
      parks.push(park);
    } else if (park.State.toLowerCase() === selectedValue) {
      parks.push(park);
    }
  }
  // Generating html cards
  helpers.generateHtmlParkCards(parks);
  // Attaching modal to cards
  helpers.attachModal();

  const card = document.querySelector(".modal");
  card?.addEventListener("click", (e) => {
    const target = e.target as HTMLButtonElement;
    if (target.classList.contains("btn-save")) {
      console.log("running");
      console.log(actualParkIndex);
    }
  });
};

// Event Listeners
window.addEventListener("load", () => {
  // Populates park type dropdown
  populateDropdown(parkTypeData, selectByType);
  // Populates location type dropdown
  populateDropdown(locationsArray, selectByLocation);
});

selectByType.addEventListener("change", () => {
  selectByLocation.selectedIndex = 0;
  app("type");
});
selectByLocation.addEventListener("change", () => {
  selectByType.selectedIndex = 0;
  app("location");
});

parksContainer.addEventListener("click", (e) => {});
