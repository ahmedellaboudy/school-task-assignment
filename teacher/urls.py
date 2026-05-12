from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.teacher_dashboard, name='teacher_dashboard'),
    path('tasks/', views.teacher_tasks, name='teacher_tasks'),
    path('tasks/completed/', views.completed_tasks, name='completed_tasks'),
    path('tasks/<int:task_id>/', views.task_details, name='task_details'),
    path('tasks/<int:task_id>/complete/', views.mark_task_complete, name='mark_task_complete'),
]