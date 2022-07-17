
export const loadTemplate = () => {
    const body = document.querySelector("body");
    const header = createHeader();
    body.append(header);
    const mainContainer = document.createElement("main");
    mainContainer.className = "main-container";
    body.append(mainContainer);
}

const createHeader = () => {
    const header = document.createElement("header");
    const title = document.createElement("h1");
    title.style.textAlign = "center";
    title.innerText = "Victor's Streaming Site";
    header.appendChild(title);
    return header;
}