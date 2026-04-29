from django.db import models

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=255)
    desc = models.TextField()

    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='low'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    assignedToId = models.IntegerField(null=True, blank=True)
    createdBy = models.CharField(max_length=100, default='Admin')
    date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title