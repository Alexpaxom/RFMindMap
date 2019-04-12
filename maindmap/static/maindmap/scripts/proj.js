jQuery(document).ready(function(){

	window["mapData"] = {}
	getProject(get("id"));

	// var window["mapData"] = JSON.parse(`
	// {
	// 	"data":{
	// 		"0":{"parent":null, "name":"Нода_0"},
	// 		"1":{"parent":0, "name":"Нода_1"},
	// 		"2":{"parent":0, "name":"Нода_2"},
	// 		"3":{"parent":0, "name":"Нода_3"},
	// 		"4":{"parent":0, "name":"Нода_4"},
	// 		"5":{"parent":1, "name":"Нода_1_1"},
	// 		"6":{"parent":5, "name":"Нода_1_1_1"},
	// 		"7":{"parent":5, "name":"Нода_1_1_2"},
	// 		"8":{"parent":5, "name":"Нода_1_1_3"},
	// 		"9":{"parent":1, "name":"Нода_1_2"},
	// 		"10":{"parent":1, "name":"Нода_1_3"},
	// 		"11":{"parent":1, "name":"Нода_1_4"},
	// 		"12":{"parent":2, "name":"Нода_2_1"},
	// 		"13":{"parent":2, "name":"Нода_2_2"},
	// 		"14":{"parent":3, "name":"Нода_3_1"},
	// 		"15":{"parent":3, "name":"Нода_3_2"},
	// 		"16":{"parent":3, "name":"Нода_3_3"},
	// 		"17":{"parent":3, "name":"Нода_3_4"},
	// 		"18":{"parent":4, "name":"Нода_4_1"}
	// 	},

	// 	"meta":{
	// 		"next_id":19,
	// 		"project_id":0
	// 	}

	// }
	// `);

	

	jQuery("body").on("click", ".nodeView", function(event){
		jQuery('.node.selected .nodeView select').remove()
		jQuery('.node.selected').removeClass("selected");

		jQuery(this).parent().addClass("selected");
		addSelectToHtml(jQuery(this));
	});

	jQuery("body").on("click", "select[name='node_action']", function(event){
		event.stopPropagation();
	});

	jQuery("body").on("change", "select[name='node_action']", function(event){
		event.stopPropagation();
		node = jQuery(this).parent().parent();
		console.log(jQuery(this).val());
		if(jQuery(this).val() == "edit")
			editDescriptionNode(node.attr("node_id"));
		else if(jQuery(this).val() == "remove"){
			if(window["mapData"]["data"][node.attr("node_id")]["parent"] !== null){
				removeNode(node.attr("node_id"), window["mapData"]["data"]);
				node.remove()
			}
		}
		else if(jQuery(this).val() == "add"){
			var new_node = {"parent":Number(node.attr("node_id")), "name":"Новая нода"};
			var node_html = createHtmlNode(new_node, window["mapData"]["meta"]["next_id"]);
			window["mapData"]["data"][window["mapData"]["meta"]["next_id"]] = new_node;
			window["mapData"]["meta"]["next_id"]++;
			if(window["mapData"]["data"][node.attr("node_id")]["parent"] === null)
				if((window["mapData"]["meta"]["next_id"]-1) % 2 === 0)
					jQuery(".left > .childs").append(node_html)
				else
					jQuery(".right > .childs").append(node_html)
			else
				jQuery(".node[node_id='"+ node.attr("node_id") +"'] > .childs").append(node_html)
			
		}
		else if(jQuery(this).val() == "note")
			editNoteNode(node.attr("node_id"), window["mapData"]["data"]);
	});

	jQuery(".popap").on("click", "button[name='cancel']", function(){
		jQuery(".popap").hide();
	});

	jQuery(".popap").on("click", "button[name='changeDescr']", function(){
		var node_id = jQuery(this).attr("node_id");
		var text = CKEDITOR.instances['editor'].getData();
		jQuery(".node[node_id='"+ node_id +"'] > .nodeView .description").html(text);
		window["mapData"]["data"][node_id]["name"] = text;
		console.log(window["mapData"]["data"]);
		jQuery(".popap").hide();
	});

	jQuery(".popap").on("click", "button[name='changeNote']", function(){
		var node_id = jQuery(this).attr("node_id");
		var text = CKEDITOR.instances['editor'].getData();
		//jQuery(".node[node_id='"+ node_id +"'] > .nodeView .note").html(text);
		window["mapData"]["data"][node_id]["note"] = text;
		console.log(window["mapData"]["data"]);
		jQuery(".popap").hide();
	});

	jQuery("#save").on("click", function(){saveProject();});
});

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

function getProject(id_proj){
	request = { "project":"", "id":id_proj };
	jQuery.ajax({
	 		"type": "GET",
			"dataType":"json",
			"url": "get",
			"data":request,
			"success": function(data){
				console.log(data)
				window["mapMeta"] = {"id":data["project"]["id"], "name":data["project"]["name"]}
				window["mapData"] = JSON.parse(data["project"]["data"]);
				console.log(window["mapData"])
				createTeree(window["mapData"]["data"]);
			}

	});
}


function createEmptyTree(){
	var map = jQuery(".map")
	map.empty().html(
	`
		<div class="root node selected">
			<div class="left tree">
				<div class="childs">
				</div>
			</div>
			<div class="nodeView"></div>
			<div class="right tree">
				<div class="childs">
				</div>
			</div>
		</div>
	`
	)
}

function createTeree(nodes){
	//console.log(nodes);
	createEmptyTree()
	nodes = sortNodesByParent(nodes)

	rootNodeId = null
	for(key in nodes){
		if(nodes[key][1]["parent"] === null){
			jQuery(".root").attr("node_id", nodes[key][0]);
			jQuery(".root > .nodeView").append(jQuery("<div />").addClass("description").html(nodes[key][1]["name"]));
			rootNodeId = nodes[key][0]
		}
		else if(nodes[key][1]["parent"] == rootNodeId){
			node = createHtmlNode(nodes[key][1], nodes[key][0]);
			if(key % 2 === 0)
				jQuery(".root .left > .childs").append(node);
			else
				jQuery(".root .right > .childs").append(node);
		}
		else
		{
			node = createHtmlNode(nodes[key][1], nodes[key][0]);
			jQuery(".node[node_id='"+ nodes[key][1]["parent"] +"'] > .childs").append(node)
		}
	}
	
}

function sortNodesByParent(nodes){
	var items = Object.keys(nodes).map(function(key) {
	    return [key, nodes[key]];
	});

	items.sort(function(first, second) {
	    if(first[1]["parent"] < second[1]["parent"])
	    	return -1;
	    else if(first[1]["parent"] > second[1]["parent"])
	    	return 1;
	    else
	    	return 0;
	});
	return items
}

function addNodesToTree(nodeParams, parentId){
	
}

function createHtmlNode(node, id){
	var resultNode = jQuery("<div />").addClass("node").attr("node_id", id);
	var view = jQuery("<div />").addClass("nodeView").append(jQuery("<div />").addClass("description").html(node["name"]));
	resultNode.append(view);
	var childs = jQuery("<div />").addClass("childs");
	resultNode.append(childs);
	return resultNode;
}

function createHtmlMap(rootNode, htmlTurget){
}

function addSelectToHtml(htmlTurget){
	selectParams = {"edit":"Редактировать", "remove":"Удалить", "add":"Создать дочерний", "note":"Добавить описание"}
	var select = jQuery("<select />").attr("name", "node_action");
	for(paramName in selectParams){
		var option = jQuery("<option />").attr("value", paramName).html(selectParams[paramName]);
		select.append(option)
	}
	var option = jQuery("<option />").attr("selected", "").attr("hidden","").html("");
	select.append(option)

	htmlTurget.append(select)

}

function editDescriptionNode(node_id){
	
	jQuery(".popap .inner").empty()
	var textarea = jQuery("<textarea />").attr("name", "editor");

	var popapButtons = jQuery("<div />").addClass("buttons");
	popapButtons.append(jQuery("<button />").attr("name", "changeDescr").attr("node_id", node_id).html("Сохранить"));
	popapButtons.append(jQuery("<button />").attr("name", "cancel").html("Отменить"));

	jQuery(".popap .inner").append(popapButtons).append(textarea);
	CKEDITOR.replace( 'editor' );
	CKEDITOR.instances["editor"].setData(jQuery(".node[node_id='"+ node_id +"'] > .nodeView .description").html());
	CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
	jQuery(".popap").show()


}

function editNoteNode(node_id, data){
	
	jQuery(".popap .inner").empty()
	var textarea = jQuery("<textarea />").attr("name", "editor");

	var popapButtons = jQuery("<div />").addClass("buttons");
	popapButtons.append(jQuery("<button />").attr("name", "changeNote").attr("node_id", node_id).html("Сохранить"));
	popapButtons.append(jQuery("<button />").attr("name", "cancel").html("Отменить"));

	jQuery(".popap .inner").append(popapButtons).append(textarea);
	CKEDITOR.replace( 'editor' );
	CKEDITOR.instances["editor"].setData(data[node_id]["note"]/*jQuery(".node[node_id='"+ node_id +"'] > .nodeView .note").html()*/);
	//CKEDITOR.config.enterMode = CKEDITOR.ENTER_BR;
	jQuery(".popap").show()


}

function removeNode(node_id, nodes){
	var sortedNodes = sortNodesByParent(nodes);
	let nodesForRemove = new Set();
	nodesForRemove.add(Number(node_id));
	delete nodes[node_id]
	for(nodeKey in sortedNodes)
		if(nodesForRemove.has(sortedNodes[nodeKey][1]["parent"])){
			nodesForRemove.add(Number(sortedNodes[nodeKey][0]));
			delete nodes[sortedNodes[nodeKey][0]]
		}
}

function saveProject(){
	request = { "update":"", "id":window["mapMeta"]["id"], "data":JSON.stringify(window["mapData"]) };
	jQuery.ajax({
	 		"type": "GET",
			"dataType":"json",
			"url": "get",
			"data":request,
			"success": function(data){
				alert("Данные успешно сохранены!");
			}

	});
}