async function getMyGroupSubmissions(){
    var submissions={}
    await getRequest("/dashboard/submissions/my",{})
    .then((d) => {
        var error=JSON.parse(d.error)
        if(error.error_code!=200){
            showSnackBar(error.error_code,error.error_message);
        }
        else{
            d=JSON.parse(d.data);
            console.log(d);
            processGroupData(submissions,d);
        }
    });
    return submissions;
}



function createSubmissionList(submissions,listid,listitemid){
    var s=submissions["raw_submissions"];
    var list = document.getElementById(listid);
    
    console.log(s);
    s.forEach(function (item) {
        console.log(item);
        var row = document.getElementById(listitemid).cloneNode(true);
        row.style.zIndex = 0;
        row.style.position="relative";
        row.removeAttribute('id');
        row.querySelector('.item-submission-id').innerHTML=item['id'];
        var date=new Date(item['submitted_at']);
        console.log(date.toISOString().split('T')[0],date.toISOString().split('T')[1]);
        
        row.querySelector('.item-submission-at').innerHTML=date.toISOString().split('T')[0]+" "+date.toISOString().split('T')[1].split(".")[0];
        row.querySelector('.item-submission-time-s').innerHTML=microsToSeconds(item['qpu_time']);
        row.querySelector('.btn').addEventListener("click", ()=>{inspect(item);} );
        row.querySelector('.item-submission-time-ms').innerHTML=microsToMillis(item['qpu_time']);
        row.querySelector('.item-submission-time-us').innerHTML=microsToRemainingMicros(item['qpu_time']);

        list.appendChild(row);
    });
    
}


async function inspect(item){
    await postRequest("/start-inspection/",{
        problem:item['problems'],
        sampleset:item['results'],
    })
    .then((d) => {
        console.log(d);
    });
}

function processGroupData(submissions,d){
    submissions["number"]=d.submissions.length;
    submissions["raw_submissions"]=d.submissions;
    
    submissions["total_qpu_used"]=0;
    var dates=[]
    for(var i=0;i<d.submissions.length;i++){
        submissions["total_qpu_used"]+=d.submissions[i].qpu_time;
        dates[i]=new Date(d.submissions[i].submitted_at).toISOString().split('T')[0];
    }
    submissions["total_qpu_task"]=d.task.qpu_group_time;
    submissions["total_qpu_percentage"]=(submissions["total_qpu_used"]/submissions["total_qpu_task"]*100).toFixed(3);

    
    var results={}
    var cumulativeResults={}
    var simulatedResults = {};
    var hybridResults={}
    var quantumResults={}
    if(dates.length>0){
        var minDate = new Date(dates.reduce(function (a, b) { return a < b ? a : b; })); 
        var maxDate = new Date(dates.reduce(function (a, b) { return a > b ? a : b; }));
        var date=new Date(minDate.getTime());
    
        var cumulative=0;

        for (var i=0; i<d.submissions.length; i++) {
            if (!results.hasOwnProperty(new Date(d.submissions[i].submitted_at).toISOString().split('T')[0])) { 
                results[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]=0;

                simulatedResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]=0;
                hybridResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]=0;
                quantumResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]=0;
                /*if(d.submissions[i].submission_sampler=="S"){
                    simulatedResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]=0;
                }
                if(d.submissions[i].submission_sampler=="H"){
                    hybridResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]=0;
                }
                if(d.submissions[i].submission_sampler=="Q"){
                    quantumResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]=0;
                }*/
            }
            results[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]+= d.submissions[i].qpu_time;
            
            if(d.submissions[i].submission_sampler=="S"){
                simulatedResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]+= d.submissions[i].qpu_time;
            }
            if(d.submissions[i].submission_sampler=="H"){
                hybridResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]+= d.submissions[i].qpu_time;
            }
            if(d.submissions[i].submission_sampler=="Q"){
                quantumResults[new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]]+= d.submissions[i].qpu_time;
            }

            var next=new Date(new Date(d.submissions[i].submitted_at).getTime());
            var prev=new Date(new Date(d.submissions[i].submitted_at).getTime());
            prev.setDate(prev.getDate() -1);
            next.setDate(next.getDate() +1);
            if (prev>=minDate&&!results.hasOwnProperty(prev.toISOString().split('T')[0])) { 
                results[prev.toISOString().split('T')[0]]= 0;
                simulatedResults[prev.toISOString().split('T')[0]]= 0;
                hybridResults[prev.toISOString().split('T')[0]]= 0;
                quantumResults[prev.toISOString().split('T')[0]]= 0;
            }
            if (next<=maxDate&&!results.hasOwnProperty(next.toISOString().split('T')[0])) { 
                results[next.toISOString().split('T')[0]]= 0;
                simulatedResults[next.toISOString().split('T')[0]]= 0;
                hybridResults[next.toISOString().split('T')[0]]= 0;
                quantumResults[next.toISOString().split('T')[0]]= 0;
            }
        }
        var date=new Date(dates.reduce(function (a, b) { return a < b ? a : b; }));
        
        while(date<=maxDate){
            for (var i=0; i<d.submissions.length; i++) {
                if(new Date(d.submissions[i].submitted_at).toISOString().split('T')[0]==date.toISOString().split('T')[0]){
                    var copiedDate = new Date(date.getTime());
                    var copiedDate1 = new Date(date.getTime());
                    copiedDate.setDate(copiedDate.getDate() -1);
                    copiedDate1.setDate(copiedDate1.getDate() + 1);

                    if (copiedDate>=minDate && !cumulativeResults.hasOwnProperty(copiedDate.toISOString().split('T')[0])) { 
                        cumulativeResults[copiedDate.toISOString().split('T')[0]]= cumulative;
                    }
                    
                    cumulative+=d.submissions[i].qpu_time;
                    cumulativeResults[date.toISOString().split('T')[0]]= cumulative;

                    if (copiedDate1<=maxDate) { 
                        cumulativeResults[copiedDate1.toISOString().split('T')[0]]= cumulative;
                    }
                }
            }
            date.setDate(date.getDate() + 1);
        }


        var dataset=[];
        var cumulativeDataset=[];
        var quantumDataset=[];
        var simulatedDataset=[];
        var hybridDataset=[];
        var i=0;
        for (var key in results) {
            if (results.hasOwnProperty(key)) {
                dataset[i]={t:key, y:results[key]}
                i=i+1;
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
        var i=0;
        for (var key in cumulativeResults) {
            if (cumulativeResults.hasOwnProperty(key)) {
                cumulativeDataset[i]={t:key, y:cumulativeResults[key]}
                i=i+1;
            }
        }


        cumulativeDataset=cumulativeDataset.sort(function(a,b){
            return new Date(a.t) - new Date(b.t)
        })
        dataset=dataset.sort(function(a,b){
            return new Date(a.t) - new Date(b.t)
        })
        simulatedDataset=simulatedDataset.sort(function(a,b){
            return new Date(a.t) - new Date(b.t)
        })
        quantumDataset=quantumDataset.sort(function(a,b){
            return new Date(a.t) - new Date(b.t)
        })
        hybridDataset=hybridDataset.sort(function(a,b){
            return new Date(a.t) - new Date(b.t)
        })

        
        submissions["chart_dataset"]=dataset;
        submissions["chart_cumulative_dataset"]=cumulativeDataset;
        submissions["chart_quantum_dataset"]=quantumDataset;
        submissions["chart_hybrid_dataset"]=hybridDataset;
        submissions["chart_simulated_dataset"]=simulatedDataset;
    }
    else{
        submissions["chart_dataset"]=[];
        submissions["chart_cumulative_dataset"]=[];
        submissions["chart_quantum_dataset"]=[];
        submissions["chart_hybrid_dataset"]=[];
        submissions["chart_simulated_dataset"]=[];
    }
    return submissions;

}