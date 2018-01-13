var	empty = false;
var	n_found = true;
var segm = true;
var segm_found = false;
var step = 0;
var Planar = {
	Planarity: function (A, num) {
        var result = new Array(0);
        var adj = new Array(num);
        for (var i = 0; i < num; i++) {
            adj[i] = new Array(0);
        }
        //Список смежности
        for (var i = 0; i < num; i++)
            for (var j = 0; j < num; j++) {
                if (Planar.Cond(A[i][j]))
                    adj[i].push(j);
            }
        //--------------------
        //Цикл
        var Verts = new Array(0);
		Planar.Cycle(adj, num, Verts);
        var cyc = "";
	if(n_found) {
		cyc = cyc.concat("Цикл не найден. Граф планарен.");
		result.push(cyc);
	}
	else{
        cyc = cyc.concat("Цикл - ", Planar.F_Str(Verts));
        result.push(cyc);
        //------------------
        //Грани
        var Faces = new Array(2);
        Faces[0] = Planar.Copy(Verts);
		Faces[1] = Planar.Copy(Verts);
        //-------------------
        var Mat = Planar.MCopy(A);
        Planar.E_Del(Mat, Verts);
		Mat[Verts[0]][Verts[Verts.length - 1]] = Mat[Verts[Verts.length - 1]][Verts[0]] = 0;
        //Добавление цепей
        if (Planar.Adding(Mat, Verts, Faces,result)) {
			var res = "Граф планарен";
            result.push(res);			
		}
		else{
			var res = "Граф не планарен";
            result.push(res);	
		}
        //-----------------------
	}
	return result;
    },
    Copy: function (arr) {
        var res = new Array(arr.length);
        for (var num = 0; num < arr.length; num++) {
            res[num] = arr[num];
        }
        return res;
    },
    MCopy : function (arr) {
        var res = new Array(arr.length);
        for (var i = 0; i < arr.length; i++) {
            res[i] = new Array(arr[i].length);
            for (var j = 0; j < arr[i].length; j++)
                res[i][j] = arr[i][j];
        }
        return res;
    },
    Max : function (arr) {
        var max = arr[0];
        var index = 0;
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
                index = i;
            }
        }
        return index;
    },
    Search : function (A, cycle, count, index, start) {
        if (count != 1) {
			var cycle1 = Planar.Copy(cycle);
                cycle1.push(index);
            for (var i = 0; (i < A[index].length) && n_found; i++) {
                if (cycle.indexOf(A[index][i]) != -1)
                    continue;
                
                Planar.Search(A, cycle1, count - 1, A[index][i], start);
                if (!(n_found))
                    for (var j = cycle.length; j < cycle1.length; j++)
                        cycle.push(cycle1[j]);
            }
        }
        else {
            if (A[index].indexOf(start) != -1) {
                cycle.push(index);
                n_found = false;
            }
        }
    },
    Cycle : function (A, count, cycle) {
		n_found = true;
        var index = Planar.M_Pow(A);
        for (var i = count; ((i > 2) && n_found); i--) {
            Planar.Search(A, cycle, i, index, index);
        }
		for (var i = count; ((i > 2) && n_found); i--) {
		for(var k = 0; (k<A.length) && n_found; k++){
				Planar.Search(A, cycle, i, k, k);
			}
		}
    },
    Cond: function (A) {
        return A != 0;
    },
    M_Pow : function (A) {
        var index = 0;
        var max = A[0].length;
        for (var i = 1; i < A.length; i++) {
            var num = A[i].length;
            if (num > max) {
                max = num;
                index = i;
            }
        }
        return index;
    },
    Adding : function (A, cycle, Faces, result) {
		step = 0;
		var chains = new Array(0);
		var trees = new Array(0);
		do{
			do{
				Planar.Segm_Search(A,cycle,chains);
				if (chains.length != 0){
					var analysis = new Array(0);
					var sFaces = new Array(0);
					Planar.Segm_An(chains,Faces,analysis,sFaces);
					Planar.Segm_Ad(chains,Faces,analysis,cycle,result,sFaces);
					if (analysis[0] == -1) return false;
				}
			}
			while(chains.length > 0);
		Planar.Trees_Search(A,cycle,trees,Faces);	
		}
		while(segm);
		if (trees.length != 0){
			var trs = "Неконфликтующие сегменты:";
			result.push(trs);
			for (var k = 0; k < trees.length; k++){
				if (trees[k].length != 1){
					result.push(Planar.F_Str(trees[k]));
				}
			}
		}
		return true;
    },
    E_Del:  function (A, chain) {
        for (var i = 1; i < chain.length; i++)
            A[chain[i]][chain[i - 1]] = A[chain[i - 1]][chain[i]] = 0;
    },
	Segm_Search: function(A,cycle,chains){
		for (var i = 0; i < cycle.length; i++){
			do{
				var chain = new Array(0);
				segm_found = false;
				Planar.Chain(A,cycle,chain,cycle[i]);
				if (segm_found){
					Planar.E_Del(A,chain);
					chains.push(chain);
				}
			}
			while(segm_found)
		}
	},
    Chain:  function (A, cycle, chain, index) {
		chain.push(index);
		for (var i = 0; (i < A.length)&&(!segm_found);i++){
			if ((A[index][i] != 0)&&(chain.indexOf(i) == -1)){
				if (cycle.indexOf(i) != -1){
					chain.push(i);
					segm_found = true;
					return;
				}
				else{
					var t_chain = Planar.Copy(chain);
					Planar.Chain(A,cycle,t_chain,i);
					if (segm_found){
						for (var j = chain.length; j < t_chain.length; j++){
							chain.push(t_chain[j]);
						}
					}
				}
			}
		}
    },
	Segm_An: function(chains, Faces, analysis, sFaces){
		var fac_num = new Array(chains.length);
		for (var i = 0; i < fac_num.length; i++) fac_num[i] = 0;
		for (var i = 0; i < chains.length; i++){
			var a = chains[i][0];
			var b = chains[i][chains[i].length - 1];
			var sfc = new Array(0);
			for (var j = 0; j < Faces.length; j++){
				if ((Faces[j].indexOf(a) != -1) && (Faces[j].indexOf(b) != -1)){ 
					fac_num[i]++;
					sfc.push(j);
				}
			}
			sFaces.push(sfc);
		}
		for (var i = 0; i < fac_num.length; i++){
			if (fac_num[i] == 0){
				analysis.push(-1);
				analysis.push(i);
				return;
			}
		}
		for (var i = 0; i < fac_num.length; i++){
			if (fac_num[i] == 1){
				analysis.push(0);
				analysis.push(i);
				return;
			}
		}
		analysis.push(0);
		analysis.push(0);
		return;
	},
	Segm_Ad: function(chains,Faces,analysis,cycle,result,sFaces){
		var border = "";
		border = border.concat("\n-----------------------   ",String(++step),"   ------------------------------");
		result.push(border);
		Planar.F_Pr(Faces,result,chains,sFaces);
		var res = "";
		res = res.concat("Сегмент: ", Planar.F_Str(chains[analysis[1]]));
		result.push(res);
		if(analysis[0] == -1){
			var rs = "Подходящая грань не найдена";
			result.push(rs);
			return;
		}
		var chain = chains[analysis[1]];
		chains.splice(analysis[1],1);
		Planar.V_C(chain,cycle);
		var a = chain[0];
		var b = chain[chain.length - 1];
		var nf = sFaces[analysis[1]][0];
		var rs = "";
		rs = rs.concat("Подходящая грань под номером ", String(nf + 1));
		result.push(rs);
		var Cycle1 = new Array(0);
		var Cycle2 = new Array(0);
		Planar.F_Ch(a,b,Faces,nf,Cycle1,Cycle2,chain);
		frs = "";
		frs = frs.concat("Грань ",String(nf+1),"-> ",Planar.F_Str(Cycle1)," новая грань ->",Planar.F_Str(Cycle2));
		result.push(frs);
		Faces[nf] = Cycle1;
		Faces.push(Cycle2);
		var border = "-----------------------------------------------------------\n";
		result.push(border);
	},
	Trees_Search: function(A, cycle,trees,Faces){
		segm = false;
		for (var i = 0; i < cycle.length; i++){
			empty = false;
			do{
				var tree = new Array(0);
				Planar.Tree(A,tree,cycle[i]);
				if (tree.length == 1) empty = true;
				else{
					Planar.E_Del(A,tree);
					Planar.V_C(tree,cycle);
					cycle.push(tree[tree.length-1]);
					trees.push(tree);
					var lst = tree[tree.length - 1];
					var ilst = tree.length-1;
					var filst = tree.indexOf(lst);
					if (filst != ilst){
						var Cycle = new Array(0);
						for (var j = filst; j < tree.length - 1; j++) Cycle.push(tree[j]);
						Faces.push(Cycle);
						segm = true;
						return;
					}
				}
			}
			while(!empty);
		}
	},
	Tree: function(A,tree,index){
		tree.push(index);
		for (var i = 0; i < A[index].length; i++){
			if (A[index][i] != 0){
				if (Planar.Tree_Cond(tree,i)){
					if (tree.indexOf(i) == -1) {
						Planar.Tree(A,tree,i);
						return;
					}
					else {
						tree.push(i);
						return;
					}
				}
			}
		}
	},
    Tree_Cond: function (tree, i) {
        if (tree.length == 1)
            return true;
        return (i != tree[tree.length - 2]);
    },
	F_Pr: function(Faces,result,chains,sFaces){
		var fc = "Существующие грани:";
		result.push(fc);
		for (var i = 0; i < Faces.length; i++){
			var fac = "";
			fac = fac.concat(String(i+1),") ", Planar.F_Str(Faces[i]));
			result.push(fac);
		}
		var ch = "";
        ch = "Имеющиеся сегменты:";
        result.push(ch);
		for (var i = 0; i < chains.length; i++){
			var chn = "";
			chn = chn.concat(String(i+1),") ", Planar.F_Str(chains[i]),"\t","{ ",Planar.F_Suit(sFaces[i])," }");
			result.push(chn);
		}
	},
	F_Ch: function(a,b,Faces,nf,Cycle1,Cycle2,chain){
		var j;
		var ia = Faces[nf].indexOf(a);
		var ib = Faces[nf].indexOf(b);
		if (ia < ib) {
			for (j = 0; j < ia; j++)
				Cycle1.push(Faces[nf][j]);
			for (j = 0; j < chain.length; j++)
				Cycle1.push(chain[j]);
			for (j = ib + 1; j < Faces[nf].length; j++)
				Cycle1.push(Faces[nf][j]);
			for (j = ia + 1; j < ib; j++)
				Cycle2.push(Faces[nf][j]);
			for (j = chain.length - 1; j >= 0; j--)
				Cycle2.push(chain[j]);
		}
		else{
			for (j = 0; j < ib; j++)
				Cycle1.push(Faces[nf][j]);
			for (j = chain.length-1; j >=0; j--)
				Cycle1.push(chain[j]);
			for (j = ia + 1; j < Faces[nf].length; j++)
				Cycle1.push(Faces[nf][j]);
			for (j = ib + 1; j < ia; j++)
				Cycle2.push(Faces[nf][j]);
			for (j = 0; j < chain.length; j++)
			    Cycle2.push(chain[j]);
		}
	},
	F_Str: function(arr){
		var res = Planar.Copy(arr);
		for(var i = 0; i<arr.length; i++){
			res[i]++;
		}
		return res.join(" - ");
	},
	F_Suit: function(arr){
		var res = Planar.Copy(arr);
		for(var i = 0; i<arr.length; i++){
			res[i]++;
		}
		return res.join(", ");
	},
	V_C: function(chain,cycle){
		for (var i = 1; i< chain.length-1; i++){
			cycle.push(chain[i]);
		}
	}
};

function PLNR(graph, inputNodes) {
  var m = graph.matrix;
  return Planar.Planarity(m, m.length).join("\r\n");
}

window['plugins']['PLNR'] = PLNR;