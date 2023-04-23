/* eslint-disable no-undef */
{
  window.addEventListener("DOMContentLoaded", (_) => {
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
          dateToElement.style.display = "block";
          if (labelForDateFromElement) {
            labelForDateFromElement.textContent = "From";
          }
        } else {
          dateToElement.style.display = "none";
          labelForDateFromElement.textContent = "Date";
        }
      });
    }
  });
}
