"use strict";

// Import our custom CSS and boostrap modules
import "../scss/styles.scss";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.css";

// Importing park data

import parkTypeData from "./data/parkTypeData";
import locationsArray from "./data/locationData";
import nationalParksArray from "./data/nationalParkData";

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
  generateHtml: (park: Park) => string;
}

// Functions

const helpers: Helpers = {
  generateHtml: (park: Park) => {
    return `
    <div class="card" style="width: 18rem; height: 18rem;">
    <img class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title">${park.LocationName}</h5>
      <p class="card-text">
        Some quick example text to build on the card title and make up
        the bulk of the card's content.
      </p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>
    `;
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

// Clears container content
const cleanElement = (element: HTMLElement) => {
  element.textContent = "";
};

const generateHtmlCards = (selectType: string) => {
  // When a state / type park is selected, display the parks that meet the criteria
  cleanElement(parksContainer);
  const selectedOptionIndex =
    selectType === "location"
      ? selectByLocation.selectedIndex
      : selectByType.selectedIndex;
  // Calculate index of selected option
  // const selectedOptionIndex = selectByType.selectedIndex;
  const selectedOption =
    selectType === "location"
      ? (selectByLocation[selectedOptionIndex] as HTMLOptionElement)
      : (selectByType[selectedOptionIndex] as HTMLOptionElement);

  const selectedValue = selectedOption.value.toLowerCase();
  console.log(selectedOption);

  let html: string = "";
  for (const park of nationalParksArray) {
    if (park.LocationName.toLowerCase().includes(selectedValue)) {
      // Create a card element for each element in the array
      html = helpers.generateHtml(park);
      // Insert to html
      parksContainer.insertAdjacentHTML("afterbegin", html);
    } else if (park.State.toLowerCase() === selectedValue) {
      html = helpers.generateHtml(park);
      parksContainer.insertAdjacentHTML("afterbegin", html);
    }
  }
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
  generateHtmlCards("type");
});
selectByLocation.addEventListener("change", () => {
  selectByType.selectedIndex = 0;
  generateHtmlCards("location");
});
