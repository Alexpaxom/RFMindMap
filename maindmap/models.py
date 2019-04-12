from django.db import models

# Create your models here.

class ProjectsManager(models.Manager):
	def getProjectsList(self):
		projects_list = {}
		for proj in super(ProjectsManager, self).get_queryset().all():
			projects_list[proj.id] = {"name":proj.name}
		return projects_list
	def getProjectById(self, proj_id):
		project = {}
		proj = super(ProjectsManager, self).get_queryset().get(id=proj_id)
		project = {"id":proj.id, "name":proj.name, "data":proj.data}
		return project

	def getObjectByID(self, proj_id):
		return super(ProjectsManager, self).get_queryset().get(id=proj_id)

	def deleteById(self, proj_id):
		proj = super(ProjectsManager, self).get_queryset().get(id=proj_id)
		proj.delete()

class Progects(models.Model):
	name = models.CharField(max_length=100)
	data = models.TextField()
	manager = ProjectsManager()
