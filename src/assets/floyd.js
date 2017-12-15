function floyd(graph, inputNodes) {
  	function getPath(paths, i, j) {
		const k = paths[i][j];
		let str = '';

		if(k == 0) {
			return str;
		}

		str += getPath(paths, i, k - 1);
		str += k;
		str += '-';
		str += getPath(paths, k - 1, j);

		return str;
	}

  	let str = "кратчашие пути:\r\n";
  	const matrix = graph.matrix;
  	const paths = [];

	for(let i = 0; i < matrix.length; i++) {
  		paths.push([]);

  		for(let j = 0; j < matrix[i].length; j++) {
  			paths[i].push(0);
  			if(i != j && matrix[i][j] == 0) {
  				matrix[i][j] = Infinity; 
  			} 
  		}
	}

	for(let k = 0; k < matrix.length; k++) {
	  	for(let i = 0; i < matrix.length; i++) {
	  		for(let j = 0; j < matrix[i].length; j++) {
	  			if(matrix[i][k] + matrix[k][j] < matrix[i][j]) {
	  				matrix[i][j] = matrix[i][k] + matrix[k][j];
	  				paths[i][j] = k + 1;
	  			}
	  		} 
	  	}
	}

	for(let i = 0; i < matrix.length; i++) {
  		for(let j = 0; j < matrix[i].length; j++) {
  			if(i != j) {
				str = str + ' ' + (i + 1) + '-' + getPath(paths, i, j)
						  + (j + 1) + ': ' + matrix[i][j] + ';\r\n';
  			} 
  		}
	}
  	return str;
}

window['plugins']['floyd'] = floyd;
