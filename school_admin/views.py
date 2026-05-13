from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Task
from accounts.models import Profile 

def is_admin(user):
    return user.is_authenticated and hasattr(user, 'profile') and user.profile.is_admin

@login_required
def admin_dashboard(request):
    if not is_admin(request.user):
        return redirect('login_page')

    my_tasks = Task.objects.filter(created_by=request.user)
    
    total_count = my_tasks.count()
    completed_count = my_tasks.filter(is_completed=True).count()
    pending_count = my_tasks.filter(is_completed=False).count()

    return render(request, 'admin/admin-dashboard.html', {
        'total_count': total_count,
        'completed_count': completed_count,
        'pending_count': pending_count,
    })

@login_required
def admin_tasks(request):
    if not is_admin(request.user):
        return redirect('login_page')

    tasks = Task.objects.filter(created_by=request.user).order_by('-created_at')
    
    return render(request, 'admin/admin-tasks.html', {'tasks': tasks})

@login_required
def add_task(request):
    if not is_admin(request.user):
        return redirect('login_page')

    teachers = User.objects.filter(profile__is_admin=False)
    
    last_task = Task.objects.all().order_by('id').last()
    if last_task and last_task.task_id.startswith('TASK-'):
        last_id_number = int(last_task.task_id.split('-')[1])
        new_id_number = last_id_number + 1
        next_task_id = f"TASK-{new_id_number:03d}"
    else:
        next_task_id = "TASK-001"
    
    if request.method == 'POST':
        title = request.POST.get('taskTitle')
        subject = request.POST.get('subject')
        description = request.POST.get('taskDescription')
        priority = request.POST.get('taskPriority')
        deadline = request.POST.get('deadlineDate')
        teacher_id = request.POST.get('teacherName')
        
        assigned_to = get_object_or_404(User, id=teacher_id)
        
        Task.objects.create(
            title=title,
            subject=subject,
            description=description,
            priority=priority,
            deadline=deadline,
            assigned_to=assigned_to,
            created_by=request.user
        )
        return redirect('admin_tasks')
        
    return render(request, 'admin/add-task.html', {
        'teachers': teachers, 
        'next_task_id': next_task_id
    })

@login_required
def edit_task(request, pk):
    if not is_admin(request.user):
        return redirect('login_page')
        
    task = get_object_or_404(Task, pk=pk)
    teachers = User.objects.filter(profile__is_admin=False)
    
    if request.method == 'POST':
        task.title = request.POST.get('taskTitle')
        task.subject = request.POST.get('subject')
        task.description = request.POST.get('taskDescription')
        task.priority = request.POST.get('taskPriority')
        task.deadline = request.POST.get('deadlineDate')
        teacher_id = request.POST.get('teacherName')
        
        task.assigned_to = get_object_or_404(User, id=teacher_id)
        task.save()
        return redirect('admin_tasks')
        
    return render(request, 'admin/edit-task.html', {'task': task, 'teachers': teachers})

@login_required
def delete_task(request, pk):
    if not is_admin(request.user):
        return redirect('login_page')
    if request.method == 'POST':
        task = get_object_or_404(Task, pk=pk, created_by=request.user)
        task.delete()
    return redirect('admin_tasks')

@login_required
def admin_search(request):
    if not is_admin(request.user):
        return redirect('login_page')
        
    query = request.GET.get('q', '').strip()
    tasks = []  
    
    if query:
        tasks = Task.objects.filter(
            Q(created_by=request.user),
            Q(task_id__icontains=query) | 
            Q(title__icontains=query) | 
            Q(assigned_to__username__icontains=query)
        ).order_by('-created_at').distinct()
        
    return render(request, 'admin/admin-search.html', {'tasks': tasks, 'query': query})
