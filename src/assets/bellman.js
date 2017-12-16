(function (exports) {
  'use strict';

  exports.Vertex = function (id) {
    this.id = id;
  };

  exports.Edge = function (e, v, distance) {
    this.from = e;
    this.to = v;
    this.distance = distance;
  };

  /**
   * Computes shortest paths from a single source
   * vertex to all of the other vertices.
   *
   * @public
   * @param {Array} vertexes Vertices of the graph.
   * @param {Array} edges Edges of the graph.
   * @param {Number} source Start vertex.
   * @returns {Object} Object with two arrays (parents and distances)
   *   with shortest-path information or undefined if the graph
   *   has a negative cycle.
   */
  exports.bellmanFord = function (vertexes, edges, source) {
    var distances = {};
    var parents = {};
    var paths = {};
    var c;
    if (source) {
      for (var i = 0; i < vertexes.length; i += 1) {
        distances[vertexes[i].id] = Infinity;
        parents[vertexes[i].id] = null;
      }
      distances[source.id] = 0;
      for (i = 0; i < vertexes.length - 1; i += 1) {
        paths[i] = [];
        for (var j = 0; j < edges.length; j += 1) {
          c = edges[j];
          if (distances[c.from.id] + c.distance < distances[c.to.id]) {
            paths[i].push(c.to.id);
            distances[c.to.id] = distances[c.from.id] + c.distance;
            parents[c.to.id] = c.from.id;
          }
        }
      }
      for (i = 0; i < edges.length; i += 1) {
        c = edges[i];
        if (distances[c.from.id] + c.distance < distances[c.to.id]) {
          return undefined;
        }
      }
    }
    return { paths: paths, parents: parents, distances: distances };
  };
})(window);

function graphToVertices(graph) {
  return graph.nodes.map(function (node, index) {
    return new Vertex(index);
  });
}

function graphToEdges(graph, v) {
  var edges = [];
  graph.edges.forEach(function (edge) {
    edges.push(
      new Edge(v[edge.getFrom()], v[edge.getTo()], edge.getWeight()));
    edges.push(
      new Edge(v[edge.getTo()], v[edge.getFrom()], edge.getWeight()));
  });

  return edges;
}

function pathForIndex(ford, index, arr) {
  var parent = ford.parents[+index];
  arr.push(+index);
  if (parent != null) {
    pathForIndex(ford, parent, arr);
  }
}

function bellman(graph, inputNodes) {

  var vertices = graphToVertices(graph);
  var edges = graphToEdges(graph, vertices);
  var source = vertices[inputNodes[0]];
  var ford = bellmanFord(vertices, edges, source);

  var paths = {};
  for (var i in ford.parents) {
    pathForIndex(ford, i, paths[i] = []);
  }

  var str = "";
  for (var i in paths) {
    str += "Путь из " + (inputNodes[0] + 1) + " в " + (+i + 1) + ": длина - " + ford.distances[i] + ", вершины: "
      + paths[i].reverse().map(function (i) { return parseInt(i, 10) + 1; }).join(", ") + "\r\n";
  }

  return str;

}

window['plugins']['bellman'] = bellman;
