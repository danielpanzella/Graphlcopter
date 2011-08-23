$(document).ready(function() {
	$(document).ready(function () {
	    $('body').layout({ applyDefaultStyles: true });
	});
	
	graphlcopter.chart.init({ title: "graphlcopter", renderTo: "graph", width: 1000 });
	graphlcopter.statList.init("stat-list");
	$("#server").keypress(function(e){
		if(e.which == 13) { 
			url = $("#server").val();
			graphlcopter.chart.setUrl(url);
			graphlcopter.statList.setUrl(url);
		}
	})
})