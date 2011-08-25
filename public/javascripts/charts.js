$(document).ready(function() {
	graphlcopter.chart.init({ title: "graphlcopter", renderTo: "graph" });
	graphlcopter.statList.init("sidebar");

	$("#server").keypress(function(e){
		if(e.which == 13) { 
			url = $("#server").val();
			graphlcopter.chart.setUrl(url);
			graphlcopter.statList.setUrl(url);
		}
	})
})