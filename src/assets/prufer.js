function prufer(graph, inputNodes) {
  	let str = "Код Прюфера для данного графа: ";
  	const nodes = [];
  	const edges = graph.edges;
  	const code = [];

  	for(let i = 0; i < graph.nodes.length; i++) {
  		nodes.push(i);
  	}

  	while(edges.length != 1) {
  		const length = nodes.length;
  		for(let node of nodes) {
  			let isLeaf = true;
  			let edge = null;

  			for(let _edge of edges) {
  				if(node == _edge.getTo() || node == _edge.getFrom()) {
  					if(edge == null) {
  						edge = _edge;
  					} else {
  						isLeaf = false;
  						break;
  					}
  				}
  			}

  			if(isLeaf) {
  				if(node == edge.getFrom()) {
  					code.push(edge.getTo() + 1);
  				} else {
  					code.push(edge.getFrom() + 1);
  				}

  				for(let i = 0; i < nodes.length; i++) {
  					if(node == nodes[i]) {
  						nodes.splice(i, 1);
  						break;
  					}
  				}
  				for(let i = 0; i < edges.length; i++) {
  					if(edge == edges[i]) {
  						edges.splice(i, 1);
  						break;
  					}
  				}
  				console.log(nodes);
  				console.log(code);
  				break;
  			}
  		}

  		if(length == nodes.length) {
  			return "Данный граф невозможно преобразовать в код Прюфера"
  		}
  	}

  	for(let i = 0; i < code.length; i++) {
  		str += code[i];
  		str += " ";
  	}
  	return str;
}

window['plugins']['prufer'] = prufer;
