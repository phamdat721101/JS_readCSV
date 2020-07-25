(function() {
  'use strict';

  let form = document.forms.myform;
  form.myfile.addEventListener('change', function(e) {
    let result = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(result, 'shift-jis');

    reader.onerror = function(event) {
      alert('ファイルの取り込みに失敗しました。');
    };

    reader.onload = function(event) {
      let lineArr = reader.result.split('\n');
      let itemArr = [];
      lineArr.forEach(function(value, row) {
        itemArr[row] = replaceColon(value, "$").split("$");
        itemArr[row].forEach(function(value, col) {
          let checkVal = value.trim();
          if(checkVal.substr(0 ,1) !== '"' || checkVal.substr(checkVal.length - 1, 1) !== '"') return;
          itemArr[row][col] = checkVal.substring(1, checkVal.length - 1);
        });
      });

      let fragment = document.createDocumentFragment();
      let tableWrapper = fragment.appendChild(document.createElement("table"));
      let header = tableWrapper.appendChild(document.createElement("thead"));
      let body = tableWrapper.appendChild(document.createElement("tbody"));
      itemArr.forEach(function(value, index) {
        if(index === 0) {
          // header
          let row = header.appendChild(document.createElement("tr"));
          value.forEach(function(value) {
            let col = row.appendChild(document.createElement("th"));
            col.innerHTML = value;
          });
        } else {
          // body
          let peer = document.getElementById("peers").value
          let row = body.appendChild(document.createElement("tr"));
          let Url = ''
          switch(peer){
            case "peer1":
              Url = 'http://localhost:3000/api/shuffle'
              break;
            case "peer2":
              Url = 'http://localhost:4000/api/shuffle'
              break;
            case "peer3":
              Url = 'http://localhost:5000/api/shuffle'
              break;
            default:
              Url = 'http://localhost:3000/api/shuffle'
              break;
          } 
          const data = {
            "peerId":peer,
            "shuffleId": index,
            "Unnamed": value[1],
            "ID": value[2],
            "B_min": value[3],
            "B_max": value[4],
            "B_mean": value[5],
            "B_std": value[6],
            "B_skew": value[7],
            "B_kurtosis": value[8],
            "B_mode": value[9],
            "B_entropy": value[10],
            "B_energy": value[11],
            "G_min": value[12],
            "G_max": value[13],
            "G_mean": value[14],
            "G_std": value[15],
            "G_skew": value[16],
            "G_kurtosis": value[17],
            "G_mode": value[18],
            "G_entropy": value[19],
            "G_energy": value[20],
            "R_min": value[21],
            "R_max": value[22],
            "R_mean": value[23],
            "R_std": value[24],
            "R_skew": value[25],
            "R_kurtosis": value[26],
            "R_mode": value[27],
            "R_entropy": value[28],
            "R_energy": value[29],
            "h_mean": value[30],
            "v_mean": value[31],
            "cb_mean": value[32],
            "cr_mean": value[33],
            "gray_mean": value[34],
            "contrast": value[35],
            "correlation": value[36],
            "energy": value[37],
            "homogeneity": value[38]
          }
          $.post(Url, data, function(data, status){
            console.log(`${data} and status is ${status}`)
          })
          value.forEach(function(value) {
            let col = row.appendChild(document.createElement("td"));
            col.innerHTML = value;
          });
        }
      });

      let result = document.getElementById("result");
      result.appendChild(fragment);
    };
  });
})();

/**
 * @param {object} - Object
 * @param {string} - String 
 */
function replaceColon(value, repStr) {
  let quotCount = 0;
  let str = "";

  for(let i = 0; i <= value.length; i++) {
    switch(value.substr(i, 1)) {
      case '"':
        str += value.substr(i, 1);
        quotCount += 1;
        break;
      case ',':
        if(quotCount % 2 === 0) {
          str += repStr;
        } else {
          str += value.substr(i, 1);
        }
        break;
      default:
        str += value.substr(i, 1);
        break;
    }
  }

  return str;
}