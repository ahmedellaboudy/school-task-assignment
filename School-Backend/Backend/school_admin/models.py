from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    task_id = models.CharField(max_length=20, unique=True, blank=True) 
    title = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    deadline = models.DateField()
    
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.task_id:
            last_task = Task.objects.all().order_by('id').last()
            
            if last_task and last_task.task_id.startswith('TASK-'):
                last_id_number = int(last_task.task_id.split('-')[1])
                new_id_number = last_id_number + 1
                self.task_id = f"TASK-{new_id_number:03d}"
            else:
                self.task_id = "TASK-001"
                
        super(Task, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.task_id} - {self.title}"