function graphCounter(graph, inputNodes) {
  return "Вершин: " + graph.nodes.length + ", ребер: " + graph.edges.length + "; входные параметры: " + inputNodes.join(' ');
}

window['plugins']['graphCounter'] = graphCounter;
