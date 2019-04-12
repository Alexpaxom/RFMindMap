jQuery(document).ready(function(){
	getProjects() 

	jQuery("body").on("click", "select[name='fanctions']", function(event){
		event.stopPropagation();
	});

	jQuery("body").on("change", "select[name='fanctions']", function(event){
		event.stopPropagation();
		proj = jQuery(this).parent();
		if(jQuery(this).val() == "rename")
			renameProject(proj.attr("project_id"), proj.children(".name").html());
		else if(jQuery(this).val() == "remove") {
			request = { "delete":"", "id":proj.attr("project_id") };
			jQuery.ajax({
			 		"type": "GET",
					"dataType":"json",
					"url": "get",
					"data":request,
					"success": function(data){
						 proj.remove();
					}

			});
		}
	});

	jQuery(".func_list>.new").on("click", function(){
		createProject();
	});

	jQuery("body").on("click", ".project_list>.project", function(){
		var id = jQuery(this).attr("project_id");
		document.location.replace( location.href+"project?id=" + id);
	});

	jQuery(".popap").on("click", "button[name='cancel']", function(){
		jQuery(".popap").hide();
	});

	jQuery(".popap").on("click", "button[name='createProjet']", function(){
		jQuery(".popap").hide();
		request = { "create":"", "name":jQuery(".popap textarea").val() };
		jQuery.ajax({
		 		"type": "GET",
				"dataType":"json",
				"url": "get",
				"data":request,
				"success": function(data){
					 document.location.replace( location.href+"project?id="+ data["id"]);
				}

		});
	});

	jQuery(".popap").on("click", "button[name='renameProject']", function(){
		jQuery(".popap").hide();
		var project_id = jQuery(this).attr("project_id");
		var project_name = jQuery(".popap textarea").val()

		request = { "update":"", "name":project_name , "id":project_id };
		jQuery.ajax({
		 		"type": "GET",
				"dataType":"json",
				"url": "get",
				"data":request,
				"success": function(data){
					jQuery( ".project[project_id='"+ project_id +"'] .name").html(project_name);
				}

		});
	});
});

function getProjects(){
	request = { "projects_list":"" };
	jQuery.ajax({
	 		"type": "GET",
			"dataType":"json",
			"url": "get",
			"data":request,
			"success": function(data){
				printPrjects(data["projects_list"]);
			}

	});
}

function printPrjects(projects){
	var project_list = jQuery(".project_list");

	for( proj_id in projects){
		project_list.append(createHtmlProject(projects[proj_id], proj_id));
	}
}

function createHtmlProject(proj_data, id){
	var resProj = jQuery("<li />").addClass("project").attr("project_id", id);
	var img =  jQuery("<img />").attr("src", "static/maindmap/images/no_image.png");
	var name = jQuery("<div />").addClass("name").html(proj_data["name"]);
	// var deleteButton = jQuery("<button />").addClass("delete").html("Удалить");
	var func = jQuery("<select />").attr("name","fanctions").html("<option selected='selected' hidden='hidden'></option><option value='rename'>Переименовать</option><option value='remove'>Удалить</option>");
	resProj.append(img).append(name).append(func);

	return resProj;
}

function createProject(){
	
	jQuery(".popap .inner").empty()
	var textarea = jQuery("<textarea />").attr("name", "editor");

	var popapButtons = jQuery("<div />").addClass("buttons");
	popapButtons.append(jQuery("<button />").attr("name", "createProjet").html("Сохранить"));
	popapButtons.append(jQuery("<button />").attr("name", "cancel").html("Отменить"));

	jQuery(".popap .inner").append(popapButtons).append(textarea);
	jQuery(".popap").show()


}

function renameProject(proj_id, old_name){
	
	jQuery(".popap .inner").empty()
	var textarea = jQuery("<textarea />").attr("name", "editor").val(old_name);

	var popapButtons = jQuery("<div />").addClass("buttons");
	popapButtons.append(jQuery("<button />").attr("name", "renameProject").attr("project_id", proj_id).html("Сохранить"));
	popapButtons.append(jQuery("<button />").attr("name", "cancel").html("Отменить"));

	jQuery(".popap .inner").append(popapButtons).append(textarea);
	jQuery(".popap").show()


}