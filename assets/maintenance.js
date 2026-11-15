window.setTimeout(() => {
  const notice = document.querySelector(".maintenance-notice");
  if (!notice) return;
  document
    .querySelector(".hero")
    ?.style.setProperty(
      "--dismissed-notice-height",
      `${notice.getBoundingClientRect().height}px`,
    );
  notice.remove();
}, 5000);
