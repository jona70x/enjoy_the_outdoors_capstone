"use strict";

// Import our custom CSS and boostrap modules
import "../scss/styles.scss";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.css";
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

// Variables
let actualPark: Park;
let actualParkIndex: number;
let parks: Park[] = [];
const elementsPerPage = 8;

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
  generateHtmlParkCards: (comparisonValue: string) => string[];
  attachModal: (parks: Park[]) => void;
  showPage: (list: Park[], page: number, selectedOption: string) => void;
  addPaginationButtons: (parks: Park[]) => void;
}

// Functions

const helpers: Helpers = {
  // Clears container content
  cleanElement: (element: HTMLElement) => {
    element.textContent = "";
  },
  generateHtmlParkCards: (comparisonValue: string) => {
    // Cleaning parks array
    parks = [];

    for (let park of nationalParksArray) {
      if (park.LocationName.toLowerCase().includes(comparisonValue)) {
        // Storing generated parks
        parks.push(park);
      } else if (park.State.toLowerCase() === comparisonValue) {
        parks.push(park);
      }
    }

    const newHTML = parks.map(
      // Create a card element for each element in the array
      (parkHtml) => {
        return `
      <div class="card cursor-pointer" style="width: 12rem; height: 11rem;">
        <div class="card-body d-flex align-items-center">
        <h5 class="card-title text-center">${parkHtml.LocationName}</h5>
        </div>
      </div>
      `;
      }
    );
    // Insert to html
    return newHTML;
  },
  // Managing all parks modals
  attachModal: (parksArray) => {
    // selecting all card elements generated in html
    const allParks = document.querySelectorAll(".card");

    // Attaching events listeners and generating modal cards
    allParks.forEach((park, index) => {
      park.addEventListener("click", () => {
        actualPark = parksArray[index];
        actualParkIndex = index;
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
  showPage: function (list: Park[], page: number, selectedOption: string) {
    const startIndex = page * elementsPerPage - elementsPerPage;
    const endIndex = page * elementsPerPage;
    const selectedValue = selectedOption.toLowerCase();
    const totalHtml = this.generateHtmlParkCards(selectedValue);

    let html = [];
    for (let i = 0; i < totalHtml.length; i++) {
      if (i >= startIndex && i < endIndex) {
        html.push(totalHtml[i]);
      }
    }

    parksContainer.insertAdjacentHTML("beforeend", html.join(""));
  },
  addPaginationButtons(parks: Park[]) {
    if (parks.length === 0) {
      return;
    }
    buttonsContainer.innerHTML = "";
    const paginationNumber = parks.length / elementsPerPage;

    let html = "";
    for (let i = 0; i < paginationNumber; i++) {
      html += `
           <li> <button type="button">${i + 1}</button> </li>
             `;
    }
    buttonsContainer.insertAdjacentHTML("beforeend", html);
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
  const selectedOptionIndex =
    selectType === "location"
      ? selectByLocation.selectedIndex
      : selectByType.selectedIndex;
  // Calculate index of selected option
  const selectedOption =
    selectType === "location"
      ? (selectByLocation[selectedOptionIndex] as HTMLOptionElement)
      : (selectByType[selectedOptionIndex] as HTMLOptionElement);

  // When a state / type park is selected, display the parks that meet the criteria
  helpers.cleanElement(parksContainer);
  // Generating html cards
  helpers.showPage(parks, 1, selectedOption.value);

  helpers.addPaginationButtons(parks);
  // Attaching modal to cards
  helpers.attachModal(parks);

  const allButtons = buttonsContainer.children;
  // If there is just one button, disabled it
  const firstButton = allButtons[0].children[0] as HTMLButtonElement;
  if (allButtons.length === 1 || firstButton.textContent === "1") {
    firstButton.disabled = true;
    firstButton.className = "btn-active";
  }

  buttonsContainer.addEventListener("click", (event) => {
    const allButtons = buttonsContainer.children;
    const targetBtn = event.target as HTMLButtonElement;
    //If we are not clicking the button, automatically returns
    if (targetBtn.type !== "button") {
      return;
    }

    // Iterating over all buttons
    for (let i = 0; i < allButtons.length; i++) {
      const singleButton = allButtons[i].children[0] as HTMLButtonElement;
      singleButton.className = "";
      singleButton.disabled = false;

      if (
        singleButton.textContent === targetBtn.textContent &&
        targetBtn.textContent !== "1"
      ) {
        firstButton.disabled = false;
        //Adding active class to clicked button
        singleButton.className = "btn-active";
        singleButton.disabled = true;
        helpers.cleanElement(parksContainer);
        //showing content in their respective page number
        helpers.showPage(parks, +targetBtn.textContent!, selectedOption.value);
      }
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
