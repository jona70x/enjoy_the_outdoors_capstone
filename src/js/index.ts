"use strict";

// Import our custom CSS and boostrap modules
import "../scss/styles.scss";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.css";

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
const myModal = document.querySelector(".modal") as HTMLDivElement;

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
  generateHtml: (park: Park) => string;
  attachModal: (parks: Park[]) => void;
}

// Functions

const helpers: Helpers = {
  // Clears container content
  cleanElement: (element: HTMLElement) => {
    element.textContent = "";
  },
  generateHtml: (park: Park) => {
    return `
    <div class="card" style="width: 12rem; height: 11rem;">
    <div class="card-body d-flex align-items-center">
      <h5 class="card-title text-center">${park.LocationName}</h5>
    </div>
  </div>
    `;
  },
  // Managing all parks modals
  attachModal: (parks) => {
    // selecting all card elements generated in html
    const allParks = document.querySelectorAll(".card");

    // Attaching events listeners and generating modal cards
    allParks.forEach((park, index) => {
      const actualPark = parks[index];
      park.addEventListener("click", () => {
        myModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
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
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
      `;
        const exampleModal = new Modal(myModal);
        exampleModal.show();
      });
    });
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
  console.log(selectedOption);

  let html: string = "";
  // Storing generated parks
  let parks: Park[] = [];
  for (const park of nationalParksArray) {
    if (park.LocationName.toLowerCase().includes(selectedValue)) {
      parks.push(park);
      // Create a card element for each element in the array
      html = helpers.generateHtml(park);
      // Insert to html
      parksContainer.insertAdjacentHTML("beforeend", html);
    } else if (park.State.toLowerCase() === selectedValue) {
      parks.push(park);
      html = helpers.generateHtml(park);
      parksContainer.insertAdjacentHTML("beforeend", html);
    }
  }
  // // Managing all parks modals
  helpers.attachModal(parks);
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
