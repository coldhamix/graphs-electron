function graphCounter(graph, inputNodes) {
	console.log(inputNodes);
  return "Вершин: " + graph.nodes.length + ", ребер: " + graph.edges.length + "; входные параметры: " + inputNodes.join(' ');
}

window['plugins']['graphCounter'] = graphCounter;
