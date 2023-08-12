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
    const hideOption = (option) => {
      const span = document.createElement("span");
      span.classList.add("hidden");
      span.appendChild(option);
      return span;
    };

    const hidePastDates = () => {
      const selections = document.querySelectorAll(".c-date--select");
      for (let selection of selections) {
        const options = selection.querySelectorAll(".c-date--option");
        for (let option of options) {
          const date = new Date(option.value);
          if (date < startOfToday) {
            hideOption(option);
          }
        }
      }
    };

    const replaceAllDates = () => {
      const selections = document.querySelectorAll(".c-date--select");
      const allDateSelection = document.querySelector("#all-datelist");
      for (let selection of selections) {
        selection.innerHTML = allDateSelection.innerHTML;
      }
    };

    const registerTogglePastDates = () => {
      const hadPastElement = document.querySelector("#all-dates");
      hadPastElement.addEventListener("change", () => {
        if (hadPastElement.checked) {
          replaceAllDates();
        } else {
          hidePastDates();
        }
      });
    };

    hidePastDates();
    registerToggleMultipleDate();
    registerTogglePastDates();
  });
}
