from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Task
import json


@csrf_exempt
def create_task(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            task = Task.objects.create(
                title=data["title"],
                desc=data["desc"],
                priority=data["priority"],
                assignedToId=data["assignedToId"],
                createdBy=data["createdBy"],
                date=data["date"],
                status=data.get("status", "pending"),
            )
            return JsonResponse({"id": task.id, "message": "Task created successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def update_task(request, id):
    if request.method in ["POST", "PUT"]:
        try:
            data = json.loads(request.body)
            task = get_object_or_404(Task, id=id)
            task.title = data.get("title", task.title)
            task.desc = data.get("desc", task.desc)
            task.priority = data.get("priority", task.priority)
            task.assignedToId = data.get("assignedToId", task.assignedToId)
            task.createdBy = data.get("createdBy", task.createdBy)
            task.date = data.get("date", task.date)
            task.status = data.get("status", task.status)
            task.save()
            return JsonResponse({"id": task.id, "message": "Task updated successfully"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def delete_task(request, id):
    if request.method == "DELETE":
        try:
            task = get_object_or_404(Task, id=id)
            task.delete()
            return JsonResponse({"message": "Task deleted successfully"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def complete_task(request, id):
    if request.method == "POST":
        try:
            task = get_object_or_404(Task, id=id)
            task.status = "completed"
            task.save()
            return JsonResponse({"id": task.id, "message": "Task marked as completed"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Method not allowed"}, status=405)


def get_tasks(request):
    tasks = Task.objects.all().order_by('-id')
    data = []
    for t in tasks:
        data.append({
            "id": t.id,
            "title": t.title,
            "desc": t.desc,
            "priority": t.priority,
            "status": t.status,
            "assignedToId": t.assignedToId,
            "createdBy": t.createdBy,
            "date": str(t.date),
        })
    return JsonResponse(data, safe=False)


def get_task(request, id):
    task = get_object_or_404(Task, id=id)
    return JsonResponse({
        "id": task.id,
        "title": task.title,
        "desc": task.desc,
        "priority": task.priority,
        "status": task.status,
        "assignedToId": task.assignedToId,
        "createdBy": task.createdBy,
        "date": str(task.date),
    })