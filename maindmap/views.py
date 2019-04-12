from django.shortcuts import render
# from django.http import HttpResponse
from django.http import JsonResponse


#TODO Progects -> Projects
from .models import Progects
# Create your views here.



#Шаблон для выбора пользователем проектов
def projects_list(request):
	return render(request, 'maindmap/projects_select.html')

# API для получения списка проектов или самих проектов
def getAjaxApi(request):

	response = {}

	# Запрос на получение списка поектов
	# Возвращает назавния проектов и их идентификаторы
	if "projects_list" in request.GET:
		response["projects_list"] = Progects.manager.getProjectsList();
	# Запрос на получение проекта с указанным идентификатором
	# Возвращает все данные по проекту
	elif "project" in request.GET:
		response["project"] = Progects.manager.getProjectById(request.GET["id"])
	elif "update" in request.GET:
		pr = Progects.manager.getObjectByID(request.GET["id"])
		pr.id=request.GET["id"]
		if "data" in request.GET:
			pr.data=request.GET["data"]
		if "name" in request.GET:
			pr.name=request.GET["name"]
		pr.save()
	elif "create" in request.GET:
		pr = Progects(name=request.GET["name"], data='{"data":{"0":{"parent":null, "name":"Нода_0"}}, "meta":{"next_id":1}}')
		pr.save()
		response["id"] = pr.id
	elif "delete" in request.GET:
		pr = Progects.manager.deleteById(request.GET["id"])

	return JsonResponse(response)

def projectView(request):
	return render(request, 'maindmap/project.html')