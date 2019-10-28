const getHTML = function (url, callback) {

    // Feature detection
    if (!window.XMLHttpRequest) return;

    // Create new request
    let xhr = new XMLHttpRequest();

    // Setup callback
    xhr.onload = function () {
        if (callback && typeof (callback) === 'function') {
            callback(this.responseXML);
        }
    };

    // Get the HTML
    xhr.open('GET', url);
    xhr.responseType = 'document';
    xhr.send();
};
let Cors = "https://cors-anywhere.herokuapp.com/";


function getTableData(element) {
    // function to get table cells data (from: https://coursesweb.net/ )
    // receives table ID. Returns 2 dimensional array with TD data in each row
    var t_rows = element.querySelectorAll('tbody tr');    // rows from tbody
    var t_data = [];    // will store data from each TD of each row
    var ix = 0;    // index of rows in t_data

    // gets and dds td data in t_data
    for (var i = 0; i < t_rows.length; i++) {
        var row_tds = t_rows[i].querySelectorAll('td');
        if (row_tds.length > 0) {
            t_data[ix] = [];
            for (var i2 = 0; i2 < row_tds.length; i2++) t_data[ix].push((row_tds[i2].innerText || row_tds[i2].textContent));
            ix++;
        }
    }
    return t_data;
}

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
};

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.elegantPush = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};


function removeOptions(selectbox) {
    let i;
    for (i = selectbox.options.length - 1; i >= 0; i--) {
        selectbox.remove(i);
    }
}