graphlcopter = {};

graphlcopter.chart = function() {
  var chart;
    
  return {
    addSeries: function(metricName){
      $("#error").text("");
      $.ajax({
        url: "/metrics/?path=" + metricName + "&start=1&end=11111111111",
        dataType: "json",
        success: this.loadData
      })
    },
    
    loadData: function(data, textStatus, jqXHR){
      data = data.data;
      for (var i = 0; i < data.length; i++) {
        var series = {
          type: "line",
          name: data[i].name,
          pointInterval: data[i].step * 1000,
          pointStart: data[i].start * 1000,
          data: data[i].values
        }
        
        if (chart) {
          var placeHolder = chart.get("placeholder");
          placeHolder && placeHolder.remove();
          chart.addSeries(series);
        }
        
      }
    },

    init: function(config){
      vgUrl = $("#server").val();
      chart = new Highcharts.StockChart({
        chart: {
          renderTo: config.renderTo || 'graph',
          zoomType: 'x',
          type:     'line',
          width:    config.width || null
        },
        title: { text: config.title || 'Graphlcoptor' },
        xAxis: {
          type: 'datetime',
          title: { text: 'Time' }
        },
        yAxis: {
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        series:[{
          id: "placeholder",
          data: [1]
        }]
      });
    }
  };
}();

graphlcopter.statList = function() {
  var statList, vgUrl;
    
  return { 
    setUrl: function(url) {
      vgUrl = url;
    },
    init: function(renderTo) {
      vgUrl = $("#server").val();
      renderTo = renderTo || "sidebar";
      statList = $("#" + renderTo).jstree({
        json_data: {
          data: []
         },
        themes: {
          theme: "default"
        },
        plugins: [ "themes", "json_data", "ui", "search" ]
      });
      statList.bind("select_node.jstree", function (e, data) { 
        var nodeData = $.data(data.rslt.obj[0]);
        if (nodeData.isLeaf)
          graphlcopter.chart.addSeries(nodeData.path);
        else 
          graphlcopter.statList.addNodes(nodeData.path+".*");
      });
      this.addNodes("*");
    },
    pathToText: function(path) {
      var pathArray = path.split(".");
      return pathArray[pathArray.length - 1];
    },
    addNodes: function(metric) {
      $("#error").text("");
      $.ajax({
        url: vgUrl+"/browse?metric=" + metric,
        crossDomain: true,
        dataType: 'jsonp',
        jsonpCallback: "graphlcopter.statList.loadData",
      })
    },
    loadData: function(data){
      data = data;
      for (var i = 0; i < data.length; i++) {
          node =  { data: {title: this.pathToText(data[i].metric)}, metadata: { path: data[i].metric, isLeaf: data[i].isLeaf }};
        $("#stat-list").jstree("create_node", $("#stat-list"), "last", node);
      }
    }
  }
}();
