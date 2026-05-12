from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from school_admin.models import Task

def is_teacher(user):
    return user.is_authenticated and hasattr(user, 'profile') and not user.profile.is_admin

@login_required
def teacher_dashboard(request):
    if not is_teacher(request.user):
        return redirect('login_page')
    
    my_tasks = Task.objects.filter(assigned_to=request.user)
    pending_count = my_tasks.filter(is_completed=False).count()
    completed_count = my_tasks.filter(is_completed=True).count()
    
    return render(request, 'teacher/teacher-dashboard.html', {
        'pending_count': pending_count,
        'completed_count': completed_count
    })

@login_required
def teacher_tasks(request):
    if not is_teacher(request.user):
        return redirect('login_page')
    
    tasks = Task.objects.filter(assigned_to=request.user, is_completed=False).order_by('deadline')
    
    priority_filter = request.GET.get('priority-filter', 'all')
    if priority_filter != 'all':
        tasks = tasks.filter(priority=priority_filter)
        
    return render(request, 'teacher/teacher-tasks.html', {'tasks': tasks, 'current_filter': priority_filter})

@login_required
def completed_tasks(request):
    if not is_teacher(request.user):
        return redirect('login_page')
        
    tasks = Task.objects.filter(assigned_to=request.user, is_completed=True).order_by('-created_at')
    
    priority_filter = request.GET.get('priority-filter', 'all')
    if priority_filter != 'all':
        tasks = tasks.filter(priority=priority_filter)
        
    return render(request, 'teacher/completed-tasks.html', {'tasks': tasks, 'current_filter': priority_filter})

@login_required
def task_details(request, task_id):
    if not is_teacher(request.user):
        return redirect('login_page')
        
    task = get_object_or_404(Task, id=task_id, assigned_to=request.user)
    return render(request, 'teacher/task-details.html', {'task': task})

@login_required
def mark_task_complete(request, task_id):
    if not is_teacher(request.user):
        return redirect('login_page')
        
    if request.method == 'POST':
        task = get_object_or_404(Task, id=task_id, assigned_to=request.user)
        task.is_completed = True
        task.save()
    return redirect('completed_tasks')