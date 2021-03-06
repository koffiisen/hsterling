let siteURL = "https://www.matchendirect.fr";
let select = document.getElementById('match_date');
let dates_infos = [];
let table = $('#match_info');

const getDate = function (url, callback) {
    let dates = [];
    getHTML(url, function (results) {
        let options = results.querySelectorAll('select')[0].options;

        for (let i = 0; i < options.length; i++)
            dates.push(url + options[i].value);

        //console.log(dates);
        return callback(dates);
    })
};

getDate(Cors + siteURL, function (dates) {
    let loader;
    loading(panel => {
        loader = panel;
    });

    setTimeout(function () {
        if (dates !== null && dates.length > 0) {
            for (let d = 0; d < dates.length; d++) {
                let temp = dates[d].split("-");
                let result_date = temp[temp.length - 3] + "-" + temp[temp.length - 2] + "-" + temp[temp.length - 1];

                select.add(new Option(result_date.replace("/", ""), dates[d]));
            }
            setTimeout(function () {
                loader.close();
            }, 3000);

        }
    }, 3000);

});

$('#match_date').on('change', function () {
    let loader;
    loading(panel => {
        loader = panel;
    });
    let date = select.options[select.selectedIndex].text;
    decode(this.value, date, loader);
});

function decode(uri, date, loader) {
    dates_infos = [];
    getHTML(uri, function (results) {
        let tables = results.querySelectorAll('table');

        if (tables !== null && tables.length > 0) {
            for (let ti = 0; ti < tables.length; ti++) {
                let nodes = tables[ti].childNodes[0].childNodes;

                if (nodes !== null && nodes.length > 0) {
                    for (let n = 0; n < nodes.length; n++) {
                        try {
                            if (nodes[n].children !== null && nodes[n].children.length > 0) {
                                for (let c = 0; c < nodes[n].children.length; c++) {
                                    let hours = nodes[n].children[0].innerText;

                                    let eq1 = nodes[n].children[2].children[0].children[0].innerText;
                                    let eq2 = nodes[n].children[2].children[0].children[2].innerText;
                                    let score = nodes[n].children[2].children[0].children[1].innerText;

                                    let globals_info = eq1 + " " + score + " " + eq2;

                                    let info = {
                                        'date': date,
                                        'hours': hours,
                                        'eqsc': globals_info
                                    };

                                    console.log(globals_info);

                                    dates_infos.elegantPush(info, function (e) {
                                        return e.date === info.date && e.hours === info.hours && e.eqsc === info.eqsc;
                                    });
                                }
                            }

                        } catch (e) {
                            console.log(e instanceof TypeError);
                        }
                    }
                }
            }
            populate(dates_infos, loader);
        }

    });
}

function populate(info, loader) {

    table.DataTable().clear().draw();

    setTimeout(function () {
        let ti = 1000;
        setTimeout(function () {
            let datatable = table.dataTable({
                destroy: true,
                dom: 'Bfrtip',
                lengthMenu: [[25, 100, -1], [25, 100, "All"]],
                pageLength: 25,
                buttons: ['copy',
                    {
                        extend: 'excel',
                        title: 'Match_En_Direct.' + select.options[select.selectedIndex].text
                    },
                    {
                        extend: 'pdf',
                        title: 'Match_En_Direct.' + select.options[select.selectedIndex].text
                    },
                    {
                        extend: 'print',
                        title: 'Match_En_Direct.' + select.options[select.selectedIndex].text
                    },
                    {
                        extend: 'csv',
                        title: 'Match_En_Direct.' + select.options[select.selectedIndex].text
                    }],
                exportOptions: {
                    modifier: {
                        search: 'applied',
                        order: 'applied'
                    }
                },
                "scrollY": ($(window).height() - 365) + "px",
                "scrollCollapse": true,
                "responsive": true,
                "processing": true,
                "aaData": info,
                "aoColumnDefs": [
                    {
                        "width": "30%",
                        "aTargets": [0]
                        , "sType": "text"
                        , "mRender": function (date, type, full) {
                            return '<strong>' + full.date + '</strong>';
                        }
                    },
                    {
                        "width": "10%",
                        "aTargets": [1]
                        , "sType": "date"
                        , "mRender": function (hours, type, full) {
                            return '<div style="filter: drop-shadow(0 1px 2px black);">' + full.hours + '</div>';
                        }
                    },
                    {
                        "width": "60%",
                        "aTargets": [2]
                        , "sType": "text"
                        , "mRender": function (eqsc, type, full) {
                            return '<strong><div style="font-size:15px;white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 75ch;">' + full.eqsc + '</div></strong>';
                        }
                    }
                ]
            });
            loader.close();
        }, ti);

    }, 200);

}

function loading(pcallback) {
    let panel = jsPanel.modal.create({
        contentSize: 'auto 33',
        border: '#ffc107',
        header: false,
        closeOnBackdrop: false, // see notes below
        closeOnEscape: false,
        content:
            '<div style="background-color: #0f0f10">' +
            '<div class="spinner-grow text-primary" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>\n' +
            '<div class="spinner-grow text-secondary" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>\n' +
            '<div class="spinner-grow text-success" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>\n' +
            '<div class="spinner-grow text-danger" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>\n' +
            '<div class="spinner-grow text-warning" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>\n' +
            '<div class="spinner-grow text-info" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>\n' +
            '<div class="spinner-grow text-light" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>\n' +
            '<div class="spinner-grow text-dark" role="status">\n' +
            '  <span class="sr-only">Loading...</span>\n' +
            '</div>' +
            '</div>'
    });
    pcallback(panel);
}
