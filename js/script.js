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

/*getDate(Cors + siteURL, function (dates) {
    getHTML(dates[0], function (results) {
        let tables = results.querySelectorAll('table');
        let temp = dates[0].split("-");
        let result_date = temp[temp.length - 3] + "-" + temp[temp.length - 2] + "-" + temp[temp.length - 1];

        let nodes = tables[0].childNodes[0].childNodes;

        if (nodes !== null && nodes.length > 0) {
            for (let n = 0; n < nodes.length; n++) {
                try {
                    if (nodes[n].children !== null && nodes[n].children.length > 0) {
                        for (let c = 0; c < nodes[n].children.length; c++) {
                            let hours = nodes[n].children[0].innerText;
                            let globals_info = nodes[n].children[2].innerText;

                            let equipe1 = globals_info.split("-")[0];
                            let equipe2 = globals_info.split("-")[1];

                            let score_eq1 = equipe1.charAt(equipe1.search(/\d/));
                            let score_eq2 = equipe2.charAt(equipe2.search(/\d/));

                            let eq_score = globals_info.substring(0, equipe1.search(/\d/)) + " " + score_eq1 + " - " + score_eq2 + " " + equipe2.substring(equipe2.search(/\d/) + 1, equipe2.length - 1);


                            let info = {
                                'date': result_date.replace("/", ""),
                                'hours': hours,
                                'equipe-scrore': eq_score
                            };

                            console.log(info);

                        }
                    }

                } catch (e) {
                    console.log(e instanceof TypeError);
                }
            }
        }
    })
});*/

$('#match_date').on('change', function () {
    let date = select.options[select.selectedIndex].text;
    decode(this.value, date);
});

function decode(uri, date) {
    dates_infos = [];
    getHTML(uri, function (results) {
        let tables = results.querySelectorAll('table');
        let nodes = tables[0].childNodes[0].childNodes;

        if (nodes !== null && nodes.length > 0) {
            for (let n = 0; n < nodes.length; n++) {
                try {
                    if (nodes[n].children !== null && nodes[n].children.length > 0) {
                        for (let c = 0; c < nodes[n].children.length; c++) {
                            let hours = nodes[n].children[0].innerText;
                            let globals_info = nodes[n].children[2].innerText;

                            let equipe1 = globals_info.split("-")[0];
                            let equipe2 = globals_info.split("-")[1];

                            let score_eq1 = equipe1.charAt(equipe1.search(/\d/));
                            let score_eq2 = equipe2.charAt(equipe2.search(/\d/));

                            let eq_score = globals_info.substring(0, equipe1.search(/\d/)) + " " + score_eq1 + " - " + score_eq2 + " " + equipe2.substring(equipe2.search(/\d/) + 1, equipe2.length - 1);

                            let info = {
                                'date': date,
                                'hours': hours,
                                'eqsc': eq_score
                            };

                            dates_infos.push(info);

                            console.log(info);
                        }
                    }

                } catch (e) {
                    console.log(e instanceof TypeError);
                }
            }
            populate(dates_infos);
        }
    });
}

function populate(info) {

    table.DataTable().clear().draw();

    setTimeout(function () {
        let ti = 1000;
        let loader;
        loading(panel => {
            loader = panel;
        });
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