var url = 'Stonks.pdf';
var temp;
var stock = {};
document.querySelector('#textInput').value='';
var t;
var counter = 0;
function createGUI() {
  let keys = Object.keys(stock);
  keys.sort(function(a,b){
    if(a.toLowerCase() < b.toLowerCase()){return -1;}
    if(a.toLowerCase() > b.toLowerCase()){return 1;}
    return 0;
  })
  console.log(keys);
  for(let n=0;n<keys.length;n++){
    let div = document.createElement('DIV');
    div.innerText = keys[n];
    document.querySelector('#container').appendChild(div);
    for(let p=0;p<stock[keys[n]].length;p++){
      let divTwo = document.createElement('DIV');
      let divN = document.createElement('DIV');
      divN.innerText = 'Name';
      let divU = document.createElement('DIV');
      divU.innerText = 'Unit';
      let divCQ = document.createElement('DIV');
      divCQ.innerText = 'Close Quantity';
      let divCSQ = document.createElement('DIV');
      divCSQ.innerText = 'Closing Quantity';
      let divI = document.createElement('DIV');
      divI.innerText = 'Input';
      let divT = document.createElement('DIV');
      divT.innerText = 'Total';
      divTwo.appendChild(divN);
      divTwo.appendChild(divU);
      divTwo.appendChild(divCQ);
      divTwo.appendChild(divCSQ);
      divTwo.appendChild(divI);
      divTwo.appendChild(divT);
      divTwo.className = 'unitContainer';
      let divName = document.createElement('DIV');
      divName.innerText = stock[keys[n]][p].name;
      divName.className = 'clickName';
      divTwo.appendChild(divName);
      let divUnit = document.createElement('DIV');
      divUnit.innerText = stock[keys[n]][p].unit;
      divTwo.appendChild(divUnit);
      let divCloseQuantity = document.createElement('DIV');
      divCloseQuantity.innerText = stock[keys[n]][p].closeQuantity;
      let divClosingQuantity = document.createElement('DIV');
      divClosingQuantity.innerText = stock[keys[n]][p].closingQuantity;
      let divInput = document.createElement('DIV');
      divInput.innerText = stock[keys[n]][p].input;
      divInput.id = stock[keys[n]][p].name+'input';
      let divTotal = document.createElement('DIV');
      divTotal.innerText = stock[keys[n]][p].total;
      divTwo.appendChild(divCloseQuantity);
      divTwo.appendChild(divClosingQuantity);
      divTwo.appendChild(divInput);
      divTwo.appendChild(divTotal);
      divTwo.addEventListener('click', function(e){
        let temp = '';
        let placeholder;
        let t = e.target.parentNode.parentNode.childNodes[0].data;
        console.log(e.target.parentNode.childNodes.length);
        for(let k=0;k<e.target.parentNode.childNodes.length;k++){
          if(e.target.parentNode.childNodes[k].classList[0]=='clickName') {
            temp = e.target.parentNode.childNodes[k].innerText;
            console.log(temp);
            let s = document.querySelector('#textInput');
            console.log(s);

            s.oninput = function(e){
              console.log(t);
              console.log(document.querySelector('#textInput').value);
              stock[t][placeholder].input = s.value;
              document.getElementById(stock[t][placeholder].name+'input').innerText = stock[t][placeholder].input;

            };
            s.focus();
            break;
          }
        }
        for(let j =0;j<stock[t].length;j++){
          if(stock[t][j].name===temp){
            placeholder = j;
            break;
          }
        }
        if(document.getElementById(stock[t][placeholder].name+'input').innerText!=='') {
          document.querySelector('#textInput').value = document.getElementById(stock[t][placeholder].name+'input').innerText;
        }
        else{
        document.querySelector('#textInput').value='';
      }
        //console.log(e.target.parentElement.childNodes[]);
      });
      div.appendChild(divTwo);
    }
  }
}
let cleanUp = function (pdfPage) {
  temp = temp.items.filter(item=>item.str.length>0 && item.str !== ' ' && item.str != 'Purchase Name' && item.str != 'Unit' && item.str != 'Theoretical' && item.str != 'Close Qty' && item.str != 'Closing Quantity' && item.str != 'TOTAL');
  temp.splice(0,18);
  console.log('CleanUp', temp);
  transfer(pdfPage);
}
let transfer = function (pdfPage) {
  counter++;
  let tempGroup;
  for(let i=0;i<temp.length;i++){
    if(temp[i].fontName=='g_d1_f1') {
      tempGroup = temp[i].str;
      if(!stock.hasOwnProperty(tempGroup)){
      stock[tempGroup] = [];
    }
      continue;
    }
    else {
      try{
      let tmp = {name : temp[i].str,
                             unit : temp[++i].str,
                             closeQuantity : temp[++i].str,
                             closingQuantity : '',
                             input : '',
                             total : ''};
      stock[tempGroup].push(tmp);
    }

  catch(error){
    console.error(error);
  }
}

  }
  if(counter==parseInt(pdfPage)){
  let keys = Object.keys(stock);

  for(let k=0;k<keys.length;k++){
    stock[keys[k]].sort(function(a,b){
      if(a.name.toLowerCase() < b.name.toLowerCase()){return -1;}
      if(a.name.toLowerCase() > b.name.toLowerCase()){return 1;}
      return 0;
    })
  }
  console.log('FInish');
  createGUI();
}





}
// Loaded via <script> tag, create shortcut to access PDF.js exports.
var pdfjsLib = window['pdfjs-dist/build/pdf'];
var subsText;
// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js';

function pickAndReadFile() {
  const fileList = this.files;
  console.log(fileList[0]);
  const reader = new FileReader();
  console.log(reader);
  reader.onload = function() {
    console.log('i');
    console.log(reader.result);
    subsText = reader.result.split(',');
    subsText.shift();
    subsText=subsText.join();
    console.log(subsText);
    subsText = atob(subsText);
    console.log(subsText);
    if(subsText){
      var loadingTask = pdfjsLib.getDocument({data:subsText});
      loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');

        // Fetch the first page
        for(let j=1;j<=pdf._pdfInfo.numPages;j++){
        var pageNumber = j;
        pdf.getPage(pageNumber).then(function(page) {
          console.log(`Page ${j} loaded`);
          console.log(page);
          page.getTextContent().then(function(textContent){
            console.log(textContent);
            temp = textContent;
            cleanUp(pdf._pdfInfo.numPages);
          })
        });
      }
      }, function (reason) {
        // PDF loading error
        console.error(reason);
      })
    }

  };
  reader.readAsDataURL(fileList[0]);
// Asynchronous download of PDF

var loadingTask = pdfjsLib.getDocument({data:subsText});
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');


}, function (reason) {
  // PDF loading error
  console.error(reason);
})
}





const myInit = {
  headers:{
    'Content-Type': 'application/pdf'
  }
}

const inputElement = document.getElementById('input');
inputElement.addEventListener("change", pickAndReadFile, false);
function handleFiles() {
  const fileList = this.files;
  console.log(fileList[0]);
  const reader = new FileReader();
  console.log(reader);
  reader.addEventListener('loadend', () =>{
    console.log(reader.result);
  })
  reader.readAsBinaryString(fileList[0]);
  printFile(fileList[0].name);
}
