/* eslint-disable no-undef */
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  window.addEventListener("DOMContentLoaded", (_) => {
    const startOfToday = new Date().setUTCHours(0, 0, 0, 0);

    const registerToggleMultipleDate = () => {
      // toggle to display To date
      const multipleDateElement = document.querySelector("#multiple-dates");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      multipleDateElement.addEventListener("change", (_e) => {
        const dateToElement = document.querySelector(".c-date-to");
        const labelForDateFromElement = document.querySelector(
          ".c-date-from--label",
        );

        if (multipleDateElement.checked) {
          dateToElement.classList.remove("hidden");
          labelForDateFromElement.textContent = "From";
        } else {
          dateToElement.classList.add("hidden");
          labelForDateFromElement.textContent = "Date";
        }
      });
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

    const hideUnnecessaryDates = () => {
      const selections = document.querySelectorAll(".c-date--select");
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
          hideUnnecessaryDates();
        }
      });
    };

    hideUnnecessaryDates();
    registerToggleMultipleDate();
    registerTogglePastDates();
  });
}
