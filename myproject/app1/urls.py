from django.urls import path
from . import views

urlpatterns = [
    path("tasks/", views.get_tasks),
    path("tasks/create/", views.create_task),
    path("tasks/<int:id>/", views.get_task),
    path("tasks/<int:id>/update/", views.update_task),
    path("tasks/<int:id>/delete/", views.delete_task),      
    path("tasks/<int:id>/complete/", views.complete_task), 
]