
// Status Flag
let extensionActive = false;
let elementStyle;
let hoveredOnClose = false;

const rightClickListner = () => {
    window.addEventListener('contextmenu', (event) => {
        createFullPopup()
    })
}

const rightClickRemoveListner = () => {
    window.removeEventListener('contextmenu', (event) => {

    })
}

const executeFontFinder = () => {
    let previousTarget = null;
    document.querySelectorAll("a").forEach((anchortag) => {
        anchortag.style.pointerEvents = "none";
    })

    function getBgColor(el) {
        const defaultBg = "rgba(0, 0, 0, 0)";
        while (el.parentNode) {
            const computedBg = window.getComputedStyle(el).backgroundColor;
            el = el.parentNode;
            if (computedBg !== defaultBg) {
                return computedBg;
            }
        }
        return defaultBg;
    }

    rightClickListner()
    function onMouseMove(e) {
        if (extensionActive) {
            let style = null;
            let fontData = null;
            let x = e.pageX;
            let y = e.pageY;
            let className = e.target.className;
            let tagName = e.target.tagName.toLowerCase();
            let backgroundColor = null;
            if (e.target === previousTarget || !(e.target instanceof Element)) {
                createPopup({ x, y })
                return false;
            }


            previousTarget = e.target;
            style = window.getComputedStyle(e.target);
            backgroundColor = getBgColor(e.target);

            elementStyle = {
                family: style.fontFamily,
                weight: style.fontWeight,
                size: style.fontSize,
                lineHeight: style.lineHeight,
                color: style.color,
                fontStyle: style.fontStyle,
                x,
                y
            };

            try {
                if (tagName != "div" && className != "close-fontfinder") {
                    createPopup(elementStyle)
                }
                // chrome.runtime.sendMessage(elementStyle);
            } catch (e) {
                document.removeEventListener("mousemove", onMouseMove, false);
                createPopup({ x, y })
            }
        }
        return false;
    }

    document.addEventListener("mousemove", onMouseMove, false);

    let closeFontFinder = document.createElement("p")
    closeFontFinder.setAttribute("class", "close-fontfinder");
    closeFontFinder.innerText = "Close";
    document.querySelector("body").appendChild(closeFontFinder);

    closeFontFinder.addEventListener("click", () => {
        document.querySelector(".close-fontfinder").remove();
        if (document.querySelector(".fontfinder-data-full")) {
            document.querySelector(".fontfinder-data-full").remove();
        }
        if (document.querySelector(".fontfinder-data")) {
            document.querySelector(".fontfinder-data").remove();
        }
        extensionActive = false;
    })

    closeFontFinder.onmouseover = function () {
        hoveredOnClose = true;
        if (document.querySelector(".fontfinder-data")) {
            document.querySelector(".fontfinder-data").style.display = "none";
        }
    }

    closeFontFinder.onmouseout = function () {
        hoveredOnClose = false;
        if (document.querySelector(".fontfinder-data")) {
            document.querySelector(".fontfinder-data").style.display = "flex";
        }
    }
}

const stopFontFiner = () => {

    // document.removeEventListener("mousemove",onMouseMove);
    document.querySelectorAll("a").forEach((anchortag) => {
        anchortag.style.pointerEvents = "auto";
    })
}

const createPopup = (elementStyle) => {
    if (document.querySelector(".fontfinder-data")) {
        document.querySelector(".fontfinder-data").style.top = elementStyle.y + 10 + "px";
        document.querySelector(".fontfinder-data").style.left = elementStyle.x + 10 + "px";
        if (elementStyle.family) {
            document.querySelector(".fontstyle-data").innerText = elementStyle.family.includes("script") ? elementStyle.family.split("script")[0].replaceAll('"', "") : elementStyle.family.split(",")[0].replaceAll('"', "");
        }
    } else {
        // if(elementStyle.family){
        let poupDiv = document.createElement("div");
        poupDiv.setAttribute("class", "fontfinder-data");
        let fontStyle = document.createElement("p");
        fontStyle.setAttribute("class", "fontstyle-data");
        fontStyle.innerText = elementStyle.family.includes("script") ? elementStyle.family.split("script")[0].replaceAll('"', "") : elementStyle.family.split(",")[0].replaceAll('"', "");
        poupDiv.style.top = elementStyle.y + 10 + "px";
        poupDiv.style.left = elementStyle.x + 10 + "px";
        poupDiv.appendChild(fontStyle);
        document.querySelector("body").appendChild(poupDiv);
        // }
    }
}

const createFullPopup = (elementStyle) => {
    elementStyle.family = elementStyle.family.includes("script") ? elementStyle.family.split("script")[0].replaceAll('"', "") : elementStyle.family.split(",")[0].replaceAll('"', "");

    let fullPoupDiv = document.createElement("div");
    fullPoupDiv.setAttribute("class", "fontfinder-data-full");

    let heading = document.createElement("div");
    heading.setAttribute("class", "");

    let fontFamily = document.createElement("p");
    fontFamily.setAttribute("class", "fontfamily-data-full style-list");
    fontFamily.innerHTML = `<span>Font Family:</span>${elementStyle.family.includes("script") ? elementStyle.family.split("script")[0].replaceAll('"', "") : elementStyle.family.split(",")[0].replaceAll('"', "")}`;

    let fontWeight = document.createElement("p");
    fontWeight.setAttribute("class", "fontweight-data-full style-list");
    fontWeight.innerHTML = `<span>Font Weight:</span>${elementStyle.weight}`;

    let fontSize = document.createElement("p");
    fontSize.setAttribute("class", "fontsize-data-full style-list");
    fontSize.innerHTML = `<span>Font Size:</span>${elementStyle.size}`;

    let lineHeight = document.createElement("p");
    lineHeight.setAttribute("class", "lineheight-data-full style-list");
    lineHeight.innerHTML = `<span>Font LineHeight:</span>${elementStyle.lineHeight}`;

    let color = document.createElement("p");
    color.setAttribute("class", "color-data-full style-list");
    color.innerHTML = `<span>Font Color:</span>${elementStyle.color}`;

    let fontStyle = document.createElement("p");
    fontStyle.setAttribute("class", "fontstyle-data-full style-list");
    fontStyle.innerHTML = `<span>Font Style:</span>${elementStyle.fontStyle}`;

    fullPoupDiv.style.top = elementStyle.y + 10 + "px";
    fullPoupDiv.style.left = elementStyle.x + 10 + "px";

    let saveStyle = document.createElement("button");
    saveStyle.setAttribute("class", "savestyle");
    saveStyle.innerText = "Save Style";

    saveStyle.addEventListener("click", () => {
        chrome.runtime.sendMessage({ cloudStyles: elementStyle })
        stopFontFiner();
        chrome.storage.sync.get(null, (data) => {
            elementStyle.time = Date.now();
            elementStyle.url = window.location.href;
            if (document.querySelector('[rel="icon"]')) {
                elementStyle.icon = document.querySelector('[rel="icon"]').href;
            }
            data.savedStyles.push(elementStyle);
            chrome.storage.sync.set({ savedStyles: data.savedStyles });
            extensionActive = true;
            document.querySelector(".fontfinder-data-full").remove();
        })
    })

    let closeFullPopupDiv = document.createElement("p");
    closeFullPopupDiv.setAttribute("class", "close-fullpopup");
    closeFullPopupDiv.innerText = "x";

    closeFullPopupDiv.addEventListener("click", () => {
        extensionActive = true;
        document.querySelector(".fontfinder-data-full").remove();
    })

    fullPoupDiv.appendChild(closeFullPopupDiv);
    fullPoupDiv.appendChild(fontFamily);
    fullPoupDiv.appendChild(fontWeight);
    fullPoupDiv.appendChild(fontSize);
    fullPoupDiv.appendChild(lineHeight);
    fullPoupDiv.appendChild(color);
    fullPoupDiv.appendChild(fontStyle);
    fullPoupDiv.appendChild(saveStyle);

    document.querySelector("body").appendChild(fullPoupDiv);
}

const createFloatingIcon = () => {
    let floatingIcon = document.createElement("div");
    floatingIcon.setAttribute("class", "fff-floating-icon");
    floatingIcon.innerText = "🔼";

    let savedStyles = document.createElement("div");
    savedStyles.setAttribute("class", "fff-saved-styled");

    chrome.storage.sync.get(null, (data) => {
        if (data.savedStyles) {
            for (let i = 0; i < data.savedStyles.length; i++) {
                let styleItem = document.createElement("div");
                styleItem.setAttribute("class", "fff-style-item");

                let fontStyle = document.createElement("p");
                fontStyle.setAttribute("class", "fff-font-family");
                fontStyle.innerText = "Roboto";

                let fontSize = document.createElement("p");
                fontSize.setAttribute("class", "fff-font-size");
                fontSize.innerText = "12px";

                styleItem.appendChild(fontStyle);
                styleItem.appendChild(fontSize);

                savedStyles.appendChild(styleItem);
            }
        }
    })

    document.querySelector("body").appendChild(savedStyles);
    document.querySelector("body").appendChild(floatingIcon);
}

const removeFloatingIcon = () => {
    document.querySelector(".fff-floating-icon").remove();
    document.querySelector(".fff-saved-styled").remove();
}

// onMessage Listener
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "toggle") {
        // extensionActive = !extensionActive;
        extensionActive = true;
        hoveredOnClose = false;
        if (extensionActive) {
            executeFontFinder();
        } else {
            rightClickRemoveListner()
            stopFontFiner()
            // createFloatingIcon()
        }

        sendResponse({ action: "confirm" })
    }
});

var onMousedown = function (e) {
    if (extensionActive) {
        if (e.which === 1) {
            /* Left Mouse Click */
            if (!hoveredOnClose) {
                createFullPopup(elementStyle);
                stopFontFiner()
                extensionActive = false;
            }
        }
        else if (e.which === 2) { /* Middle Mouse Click */ }
        else if (e.which === 3) { /* Right Mouse Click */ }
    }
};

window.addEventListener("mousedown", onMousedown);


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {

    if (request.message == "fontMatched") {
        let fontWeight = request.fontWeight
        let weight = document.createElement("iframe")
        weight.src = fontWeight
        document.getElementsByTagName("head")[0].appendChild(weight)
    }



})

