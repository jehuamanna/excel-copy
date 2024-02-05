const appElement = document.getElementById("app");

let cellClicked = [0,0]


const table = []


for (let i = 0; i < 10; i++){
    const row = document.createElement('div');
    table[i] = []
    row.classList.add('row-outer')
    for (let j = 0 ; j < 8; j++) {
        const cell = document.createElement("div");
        cell.classList.add('cell-outer')
        cell.contentEditable = true;
        cell.addEventListener("click", () => {
            cellClicked= [i,j];
            console.log(cellClicked)
        })
        table[i].push(cell)
        row.appendChild(cell);
        
    }
    appElement.append(row);
}

var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        vKey = 86,
        cKey = 67;

document.addEventListener('keydown', pasteData)

async function pasteData(e) {
   e.preventDefault();  
    var key = e.which || e.keyCode; // keyCode detection
    var ctrl = e.ctrlKey ? e.ctrlKey : ((key === 17) ? true : false); // ctrl detection

    if ( key == 86 && ctrl ) {
        console.log("Ctrl + V Pressed !");
        try {
            const clipboardContents = await navigator.clipboard.read();
            for (const item of clipboardContents) {
              for (const mimeType of item.types) {
                const mimeTypeElement = document.createElement("p");
                mimeTypeElement.innerText = `MIME type: ${mimeType}`;
                console.log(mimeTypeElement)
                if (mimeType === "text/plain") {
                    const blob = await item.getType("text/plain");
                    const blobText = await blob.text();
                  pasteIntoCells(blobText)
                  console.log(blobText)
                } else if (mimeType === "text/html" && getOS() !== "Windows") {
                    const blob = await item.getType("text/html");
                    const blobText = await blob.text();
                  pasteIntoCells(blobText)
                  console.log(blobText)
                }  
                else {
                  throw new Error(`${mimeType} not supported.`);
                }
              }
            }
          } catch (error) {
            console.log(error.message);
          }
    } else if ( key == 67 && ctrl ) {
        console.log("Ctrl + C Pressed !");
    }

    
  }


function pasteIntoCells(data) {

    
    const massagedData = data.split("\n").map(i => i.split("\t"));
    console.log(massagedData, cellClicked)
    
    for(let i = 0; i< Math.min(10, massagedData.length); i++){
        for(let j = 0; j < Math.min(8, massagedData[0].length); j++){
            table[i + cellClicked[0]][j + cellClicked[1]].innerHTML = massagedData[i][j];
        }
    }
}

function getOS() {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
  }