let findFontBtn = document.querySelector(".findfont");
let savedStyles = document.querySelector(".saved-styles");
let histBtn = document.getElementById("hist");
let histCont = document.getElementById("domain-styles")
let closeHist = document.getElementById("closeHist");


findFontBtn.addEventListener("click", () => {
    chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) {
            chrome.tabs.sendMessage(tabArray[0].id, { action: "toggle" });
            window.close();
        }
    );
})

const renderFunction = (data) => {

}

chrome.storage.sync.get(null, (data) => {
    if (data.savedStyles.length > 0) {
        data.savedStyles.map((element, i) => {
            element.family = element.family.includes("script") ? element.family.split("script")[0].replaceAll('"', "") : element.family.split(",")[0].replaceAll('"', "");

            let tempSavedStyle = `
            <div class="collapsiblehead"><button type="button" class="collapsible"><img class="domain-icon" src="${element.icon ? element.icon : './icons/icon16v2.png'}"/> ${element.family}<img class="arrow-buttons" src="./icons/downarrow.png"></button></div>
            <div class="content">
                <div class="call-to-action"><h3>Style</h3><div class="img-wrapper"><img class="redirect${element.time} redirect-icon" src="./icons/redirect_url.png"/><img class="copy${element.time} copy-icon" src="./icons/copy.png"/><img class="delete${element.time} delete-icon" src="./icons/delete.png"/></div></div>
                <p class="fontfamily-data-full style-list"><span>font-family: </span>${element.family}</p>
                <p class="fontweight-data-full style-list"><span>font-weight: </span>${element.weight}</p>
                <p class="fontsize-data-full style-list"><span>font-size: </span>${element.size}</p>
                <p class="lineheight-data-full style-list"><span>line-height: </span>${element.lineHeight}</p>
                <p class="color-data-full style-list"><span>color: </span>${element.color}</p>
                <p class="fontstyle-data-full style-list"><span>font-style: </span>${element.fontStyle}</p>
            </div>`;

            let fullPoupDiv = document.createElement("div");
            fullPoupDiv.setAttribute("class", `style${element.time} fontfinder-data-full`);

            fullPoupDiv.innerHTML = tempSavedStyle;

            fullPoupDiv.style.top = element.y + "px";
            fullPoupDiv.style.left = element.x + "px";

            savedStyles.appendChild(fullPoupDiv);

            let redirect = document.querySelector(`.redirect${element.time}`);
            let copy = document.querySelector(`.copy${element.time}`);
            let del = document.querySelector(`.delete${element.time}`);

            redirect.addEventListener("click", () => {
                window.open(`${element.url}`);
            })

            copy.addEventListener("click", () => {
                var generate = `font-family: ${element.family};\nfont-style: ${element.fontStyle};\nfont-weight: ${element.weight};\ncolor: ${element.color};\nsize: ${element.size};\nline-height: ${element.lineHeight};`;
                navigator.clipboard.writeText(generate);
            })

            del.addEventListener("click", () => {
                chrome.storage.sync.get(null, (d) => {
                    let filteredData = d.savedStyles.filter((x, i) => {
                        return x.time != element.time
                    })
                    document.querySelector(`.style${element.time}`).remove();

                    if (filteredData.length == 0) {
                        document.querySelector(".nodata").style.display = "unset";
                    }

                    chrome.storage.sync.set({ savedStyles: filteredData });
                })

            })

        })
    } else {
        document.querySelector(".nodata").style.display = "unset";
    }


    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.parentElement.nextElementSibling;
            var imgEle = this.querySelector(".arrow-buttons");
            if (content.style.display === "block") {
                content.style.display = "none";
                imgEle.src = "./icons/downarrow.png";
            } else {
                content.style.display = "block";
                imgEle.src = "./icons/uparrow.png";
            }
        });
    }
})

chrome.runtime.sendMessage({ cloudHist: "getHist" })


function createCard(item) {


    // Create card container
    const card = document.createElement('div');
    card.className = 'card';

    // Create and append card content
    const family = document.createElement('p');
    family.textContent = item.family;
    card.appendChild(family);

    const weight = document.createElement('p');
    weight.textContent = `Weight: ${item.weight}`;
    card.appendChild(weight);

    const size = document.createElement('p');
    size.textContent = `Size: ${item.size}`;
    card.appendChild(size);

    const lineHeight = document.createElement('p');
    lineHeight.textContent = `Line Height: ${item.line_height}`;
    card.appendChild(lineHeight);

    const color = document.createElement('p');
    color.textContent = `Color: ${item.color}`;
    card.appendChild(color);

    const pgUrl = document.createElement('p');
    pgUrl.innerHTML = `URL: <a target="_blank">${item.url}</a>`
    pgUrl.classList.add('ellipsis');
    card.appendChild(pgUrl);
    pgUrl.onclick = () => {
        window.open(item.url);
    }

    // Append card to the container
    return card;
}

// Function to render all cards
function renderCards(data) {
    const container = document.getElementById('domain-styles');
    if (data.length > 0) {
        data.forEach(item => {
            const card = createCard(item);
            container.appendChild(card);
        });
    }

}

histBtn.addEventListener("click", () => {
    histCont.style.display = "block";

    if (document.querySelector(".card")) {
        document.querySelectorAll(".card").forEach((e) => {
            
            e.remove();

        })
    }

    chrome.storage.local.get('fontHistory', function (items) {
        renderCards(items.fontHistory);
    })
})
closeHist.addEventListener('click', () => {
    histCont.style.display = "none";
})


