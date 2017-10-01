function graphCounter(graph) {
  return "Вершин: " + graph.nodes.length + ", ребер: " + graph.edges.length;
}

window['plugins']['graphCounter'] = graphCounter;
