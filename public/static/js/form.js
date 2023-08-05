/* eslint-disable no-undef */
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  window.addEventListener("DOMContentLoaded", (_) => {
    const startOfToday = new Date().setUTCHours(0, 0, 0, 0);

    const registerToggleMultipleDate = () => {
      // toggle to display To date
      const multipleDateElement = document.querySelector("#multiple-dates");
      const dateToElement = document.querySelector(".c-date-to");
      const labelForDateFromElement = document.querySelector(
        ".c-date-from--label",
      );
      if (multipleDateElement && dateToElement) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        multipleDateElement.addEventListener("change", (_e) => {
          const isMultipleDates = multipleDateElement.checked;
          if (isMultipleDates) {
            dateToElement.classList.remove("hidden");
            if (labelForDateFromElement) {
              labelForDateFromElement.textContent = "From";
            }
          } else {
            dateToElement.classList.add("hidden");
            if (labelForDateFromElement) {
              labelForDateFromElement.textContent = "Date";
            }
          }
        });
      }
    };

    // display: none not working for options in Safari
    const wrapSpan = (option) => {
      const date = new Date(option.value);
      if (date < startOfToday) {
        const span = document.createElement("span");
        span.classList.add("hidden");
        span.appendChild(option);
        return span;
      }
      return option;
    };

    const hideUnnecessaryDates = (selections) => {
      for (let selection of selections) {
        const options = selection.querySelectorAll(".c-date--option");
        for (let option of options) {
          option = wrapSpan(option);
        }
      }
    };

    const replaceAllDates = (selections) => {
      const allDateSelection = document.querySelector("#all-datelist");
      for (let selection of selections) {
        selection.innerHTML = allDateSelection.innerHTML;
      }
    };

    const registerTogglePastDates = () => {
      const hadPastElement = document.querySelector("#all-dates");
      const dateSelections = document.querySelectorAll(".c-date--select");
      hadPastElement.addEventListener("change", () => {
        if (hadPastElement.checked) {
          replaceAllDates(dateSelections);
        } else {
          hideUnnecessaryDates(dateSelections);
        }
      });
    };

    const initialize = () => {
      const dateSelections = document.querySelectorAll(".c-date--select");
      hideUnnecessaryDates(dateSelections);
    };

    initialize();
    registerToggleMultipleDate();
    registerTogglePastDates();
  });
}
