/* eslint-disable no-undef */
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  window.addEventListener("DOMContentLoaded", (_) => {
    const toggleMultipleDate = () => {
      // toggle to display To date
      const multipleDateElement = document.querySelector("#multiple-dates");
      const dateToElement = document.querySelector(".c-date-to");
      const labelForDateFromElement = document.querySelector(
        ".c-date-from--label"
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

    const showAllDates = () => {
      const allDatesElement = document.querySelector("#all-dates");
      const options = document.querySelectorAll(".c-date--option");
      const today = new Date().setUTCHours(0, 0, 0, 0);
      allDatesElement.addEventListener("change", () => {
        const isAllDates = allDatesElement.checked;
        if (isAllDates) {
          options.forEach((option) => {
            option.classList.remove("hidden");
          });
        } else {
          options.forEach((option) => {
            const date = new Date(option.value);
            if (date < today) {
              option.classList.add("hidden");
            }
          });
        }
      });
    };

    toggleMultipleDate();
    showAllDates();
  });
}
