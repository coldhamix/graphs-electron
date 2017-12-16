var Graph = (function (undefined) {

  var extractKeys = function (obj) {
    var keys = [], key;
    for (key in obj) {
      Object.prototype.hasOwnProperty.call(obj, key) && keys.push(key);
    }
    return keys;
  }

  var sorter = function (a, b) {
    return parseFloat(a) - parseFloat(b);
  }

  var findPaths = function (map, start, end, infinity) {
    infinity = infinity || Infinity;

    var costs = {},
      open = {'0': [start]},
      predecessors = {},
      keys;

    var addToOpen = function (cost, vertex) {
      var key = "" + cost;
      if (!open[key]) open[key] = [];
      open[key].push(vertex);
    }

    costs[start] = 0;

    while (open) {
      if (!(keys = extractKeys(open)).length) break;

      keys.sort(sorter);

      var key = keys[0],
        bucket = open[key],
        node = bucket.shift(),
        currentCost = parseFloat(key),
        adjacentNodes = map[node] || {};

      if (!bucket.length) delete open[key];

      for (var vertex in adjacentNodes) {
        if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
          var cost = adjacentNodes[vertex],
            totalCost = cost + currentCost,
            vertexCost = costs[vertex];

          if ((vertexCost === undefined) || (vertexCost > totalCost)) {
            costs[vertex] = totalCost;
            addToOpen(totalCost, vertex);
            predecessors[vertex] = node;
          }
        }
      }
    }

    if (costs[end] === undefined) {
      return null;
    } else {
      return predecessors;
    }

  }

  var extractShortest = function (predecessors, end) {
    var nodes = [],
      u = end;

    while (u !== undefined) {
      nodes.push(u);
      u = predecessors[u];
    }

    nodes.reverse();
    return nodes;
  }

  var findShortestPath = function (map, nodes) {
    var start = nodes.shift(),
      end,
      predecessors,
      path = [],
      shortest;

    while (nodes.length) {
      end = nodes.shift();
      predecessors = findPaths(map, start, end);

      if (predecessors) {
        shortest = extractShortest(predecessors, end);
        if (nodes.length) {
          path.push.apply(path, shortest.slice(0, -1));
        } else {
          return path.concat(shortest);
        }
      } else {
        return null;
      }

      start = end;
    }
  }

  var toArray = function (list, offset) {
    try {
      return Array.prototype.slice.call(list, offset);
    } catch (e) {
      var a = [];
      for (var i = offset || 0, l = list.length; i < l; ++i) {
        a.push(list[i]);
      }
      return a;
    }
  }

  var Graph = function (map) {
    this.map = map;
  }

  Graph.prototype.findShortestPath = function (start, end) {
    if (Object.prototype.toString.call(start) === '[object Array]') {
      return findShortestPath(this.map, start);
    } else if (arguments.length === 2) {
      return findShortestPath(this.map, [start, end]);
    } else {
      return findShortestPath(this.map, toArray(arguments));
    }
  }

  Graph.findShortestPath = function (map, start, end) {
    if (Object.prototype.toString.call(start) === '[object Array]') {
      return findShortestPath(map, start);
    } else if (arguments.length === 3) {
      return findShortestPath(map, [start, end]);
    } else {
      return findShortestPath(map, toArray(arguments, 1));
    }
  }

  return Graph;

})();

function graphToMap(graph) {

  var m = graph.matrix;

  for (var i = 0; i < m.length; i++) {
    for (var j = 0; j < m[i].length; j++) {
      if (!m[i][j]) {
        delete m[i][j];
      }
    }
    m[i] = Object.assign({}, m[i]);
  }

  return m;
}

function pathLength(map, path) {
  var len = 0;
  for (var i = 0; i < path.length - 1; i++) {
    len += map[path[i]][path[i + 1]];
  }
  return len;
}

function fixItem(item) {
  return parseInt(item, 10) + 1;
}

function dijkstra(graph, inputNodes) {
  var map = graphToMap(graph);
  var g = new Graph(map);

  var str = "";
  for (var i = 0; i < graph.nodes.length; i++) {
    var path = g.findShortestPath(inputNodes[0], i);
    var length = pathLength(map, path);

    str += "Длина кратчайшего пути из " + (inputNodes[0] + 1) + " в " + (i + 1) + ": " + length +
      ". Вершины: " + path.map(fixItem).join(", ") + "\r\n";
  }
  return str;
}

window['plugins']['dijkstra'] = dijkstra;
