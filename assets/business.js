// Reuse visible business details instead of maintaining a second copy in JSON-LD.
(() => {
  const schema = document.getElementById("business-data");
  const hours = document.querySelector("[data-opening-days]");
  const business = JSON.parse(schema.textContent);
  business.legalName = document
    .getElementById("business-legal-name")
    .textContent.replace(/\s+/g, " ")
    .trim();
  business.openingHoursSpecification = {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.dataset.openingDays.split(/\s+/),
    opens: hours
      .querySelector('[data-opening-time="opens"]')
      .textContent.trim(),
    closes: hours
      .querySelector('[data-opening-time="closes"]')
      .textContent.trim(),
  };
  schema.textContent = JSON.stringify(business);
})();
