function inputDemo(graph, inputNodes) {
  var str = "Adjacency matrix: \n";
  for (var i = 0; i < graph.matrix.length; i++) {
    for (var j = 0; j < graph.matrix[i].length; j++) {
      str += graph.matrix[i][j] + ', ';
    }
    str += '\n';
  }
  return str;
}

window['plugins']['inputDemo'] = inputDemo;
