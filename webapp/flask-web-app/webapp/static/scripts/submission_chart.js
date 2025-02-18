function updateChartData(chartid, submissionsList) {

    var dates = []
    for (var i = 0; i < submissionsList.length; i++) {
        dates[i] = new Date(submissionsList[i].date_time).toISOString().split('T')[0];
    }

    var results = {};
    var cumulativeResults = {}
    var simulatedResults = {};
    var hybridResults = {}
    var quantumResults = {}

    if (dates.length > 0) {
        var minDate = new Date(dates.reduce(function (a, b) { return a < b ? a : b; }));
        var maxDate = new Date(dates.reduce(function (a, b) { return a > b ? a : b; }));
        var date = new Date(minDate.getTime());

        var cumulative = 0;

        for (var i = 0; i < submissionsList.length; i++) {
            if (!results.hasOwnProperty(new Date(submissionsList[i].date_time).toISOString().split('T')[0])) {
                results[new Date(submissionsList[i].date_time).toISOString().split('T')[0]] = 0;
                simulatedResults[new Date(submissionsList[i].date_time).toISOString().split('T')[0]] = 0;
                hybridResults[new Date(submissionsList[i].date_time).toISOString().split('T')[0]] = 0;
                quantumResults[new Date(submissionsList[i].date_time).toISOString().split('T')[0]] = 0;
            }
            results[new Date(submissionsList[i].date_time).toISOString().split('T')[0]] += submissionsList[i].qpu_time;

            if (submissionsList[i].submission_sampler == "S") {
                //console.log("CIAO")
                simulatedResults[new Date(submissionsList[i].date_time).toISOString().split('T')[0]] += submissionsList[i].qpu_time;
                console.log(simulatedResults);
            }
            if (submissionsList[i].submission_sampler == "H") {
                hybridResults[new Date(submissionsList[i].date_time).toISOString().split('T')[0]] += submissionsList[i].qpu_time;
            }
            if (submissionsList[i].submission_sampler == "Q") {
                quantumResults[new Date(submissionsList[i].date_time).toISOString().split('T')[0]] += submissionsList[i].qpu_time;
            }

            var next = new Date(new Date(submissionsList[i].date_time).getTime());
            var prev = new Date(new Date(submissionsList[i].date_time).getTime());
            prev.setDate(prev.getDate() - 1);
            next.setDate(next.getDate() + 1);
            /*if (prev >= minDate && !results.hasOwnProperty(prev.toISOString().split('T')[0])) {
                results[prev.toISOString().split('T')[0]] = 0;
                simulatedResults[prev.toISOString().split('T')[0]]= 0;
                hybridResults[prev.toISOString().split('T')[0]]= 0;
                quantumResults[prev.toISOString().split('T')[0]]= 0;
            }*/
            if (prev >= minDate && !simulatedResults.hasOwnProperty(prev.toISOString().split('T')[0])) {
                simulatedResults[prev.toISOString().split('T')[0]]= 0;
            }
            if (prev >= minDate && !hybridResults.hasOwnProperty(prev.toISOString().split('T')[0])) {
                hybridResults[prev.toISOString().split('T')[0]]= 0;
            }
            if (prev >= minDate && !quantumResults.hasOwnProperty(prev.toISOString().split('T')[0])) {
                quantumResults[prev.toISOString().split('T')[0]]= 0;
            }


            /*if (next <= maxDate && !results.hasOwnProperty(next.toISOString().split('T')[0])) {
                results[next.toISOString().split('T')[0]] = 0;
                simulatedResults[next.toISOString().split('T')[0]]= 0;
                hybridResults[next.toISOString().split('T')[0]]= 0;
                quantumResults[next.toISOString().split('T')[0]]= 0;
            }*/
            if (next <= maxDate && !simulatedResults.hasOwnProperty(next.toISOString().split('T')[0])) {
                simulatedResults[next.toISOString().split('T')[0]]= 0;
            }
            if (next <= maxDate && !hybridResults.hasOwnProperty(next.toISOString().split('T')[0])) {
                hybridResults[next.toISOString().split('T')[0]]= 0;
            }
            if (next <= maxDate && !quantumResults.hasOwnProperty(next.toISOString().split('T')[0])) {
                quantumResults[next.toISOString().split('T')[0]]= 0;
            }
        }

        console.log(simulatedResults);
        var date = new Date(dates.reduce(function (a, b) { return a < b ? a : b; }));

        while (date <= maxDate) {
            for (var i = 0; i < submissionsList.length; i++) {
                if (new Date(submissionsList[i].date_time).toISOString().split('T')[0] == date.toISOString().split('T')[0]) {
                    var copiedDate = new Date(date.getTime());
                    var copiedDate1 = new Date(date.getTime());
                    copiedDate.setDate(copiedDate.getDate() - 1);
                    copiedDate1.setDate(copiedDate1.getDate() + 1);

                    if (copiedDate >= minDate && !cumulativeResults.hasOwnProperty(copiedDate.toISOString().split('T')[0]) && !submissionsList[i].submission_sampler == "S") {
                        cumulativeResults[copiedDate.toISOString().split('T')[0]] = cumulative;
                    }
                    if(!submissionsList[i].submission_sampler == "S"){
                        cumulative += submissionsList[i].qpu_time;
                        cumulativeResults[date.toISOString().split('T')[0]] = cumulative;
                    }
                    //cumulative += submissionsList[i].qpu_time;
                    //cumulativeResults[date.toISOString().split('T')[0]] = cumulative;

                    if (copiedDate1 <= maxDate) {
                        cumulativeResults[copiedDate1.toISOString().split('T')[0]] = cumulative;
                    }
                }
            }
            date.setDate(date.getDate() + 1);
        }

        var dataset = []
        var cumulativeDataset = []
        var quantumDataset=[];
        var simulatedDataset=[];
        var hybridDataset=[];
        var i = 0;
        for (var key in results) {
            if (results.hasOwnProperty(key)) {
                dataset[i] = { t: key, y: results[key] }
                i++;
            }
        }

        var i=0;
        for (var key in hybridResults) {
            if (hybridResults.hasOwnProperty(key)) {
                hybridDataset[i]={t:key, y:hybridResults[key]}
                i=i+1;
            }
        }
        var i=0;
        for (var key in quantumResults) {
            if (quantumResults.hasOwnProperty(key)) {
                quantumDataset[i]={t:key, y:quantumResults[key]}
                i=i+1;
            }
        }
        var i=0;
        for (var key in simulatedResults) {
            if (simulatedResults.hasOwnProperty(key)) {
                simulatedDataset[i]={t:key, y:simulatedResults[key]}
                i=i+1;
            }
        }

        var i = 0;
        for (var key in cumulativeResults) {
            if (cumulativeResults.hasOwnProperty(key)) {
                cumulativeDataset[i] = { t: key, y: cumulativeResults[key] }
                i++;
            }
        }
        cumulativeDataset = cumulativeDataset.sort(function (a, b) {
            return new Date(a.t) - new Date(b.t)
        })
        dataset = dataset.sort(function (a, b) {
            return new Date(a.t) - new Date(b.t)
        });
        simulatedDataset=simulatedDataset.sort(function(a,b){
            return new Date(a.t) - new Date(b.t)
        })
        quantumDataset=quantumDataset.sort(function(a,b){
            return new Date(a.t) - new Date(b.t)
        })
        hybridDataset=hybridDataset.sort(function(a,b){
            return new Date(a.t) - new Date(b.t)
        })
    }
    else {
        dataset = []
        cumulativeDataset = []
        quantumDataset=[];
        simulatedDataset=[];
        hybridDataset=[];
    }

    Chart.defaults.global.defaultFontFamily = "Montserrat";
    var config = {
        type: 'line',
        options: {
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'nearest',
                axis: 'x'
            },
            legend: {
                labels: {
                    fontColor: 'black'
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return microsToSecondsAndMillis(tooltipItem.yLabel);
                    }
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'll',
                    },
                    ticks: {
                        fontColor: "black",
                    },
                }],
                yAxes: [{
                    ticks: {
                        fontColor: "black",
                        callback: function (label, index, labels) {
                            return microsToSecondsAndMillis(label);
                        }
                    },
                }]
            }
        },
        data: {
            datasets: [
                /*{
                    label: 'QPU Time',
                    fontColor: "black",
                    data: [],
                    lineTension: 0.1,
                    borderColor: '#c30010',
                    backgroundColor: 'rgba(	195, 0, 16,0.1)',
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: true,
                    borderWidth: 3,
                },*/
                /*{
                    label: 'QPU Charged Cumulative Time',
                    fontColor: "black",
                    data: [],
                    lineTension: 0.1,
                    borderColor: '#007cc3',
                    backgroundColor: 'rgba(0, 124, 195,0.1)',
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: true,
                    borderWidth: 3,
                },*/
                {
                    label: 'SA Access Time',
                    fontColor: "black",
                    data: [],
                    lineTension: 0.1,
                    borderColor: '#c41fc3',
                    backgroundColor: 'rgba(0, 124, 195,0.1)',
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: true,
                    borderWidth: 3,
                },
                {
                    label: 'QA Access Time',
                    fontColor: "black",
                    data: [],
                    lineTension: 0.1,
                    borderColor: '#816887',
                    backgroundColor: 'rgba(0, 124, 195,0.1)',
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: true,
                    borderWidth: 3,
                },
                {
                    label: 'Hybrid QA Charged Time',
                    fontColor: "black",
                    data: [],
                    lineTension: 0.1,
                    borderColor: '#58ac75',
                    backgroundColor: 'rgba(0, 124, 195,0.1)',
                    pointRadius: 2,
                    pointHoverRadius: 8,
                    fill: true,
                    borderWidth: 3,
                },
            ]
        }
    };

    var ctx = document.getElementById(chartid).getContext("2d");
    var myChart = new Chart(ctx, config);
    //myChart.data.datasets[0].data = dataset;
    //myChart.data.datasets[0].data = cumulativeDataset;
    myChart.data.datasets[0].data = simulatedDataset;
    myChart.data.datasets[1].data = quantumDataset;
    myChart.data.datasets[2].data = hybridDataset;
    /*quantumDataset=[];
        simulatedDataset=[];
        hybridDataset=[];*/
    myChart.update();
}
