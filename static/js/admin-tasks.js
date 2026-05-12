function getPriorityClass(priority) {
  if (!priority) return '';
  const p = priority.toLowerCase();
  if (p === 'high') return 'highPriority';
  if (p === 'medium') return 'mediumPriority';
  if (p === 'low') return 'lowPriority';
  return '';
}

function getStatusClass(status) {
  if (!status) return 'statusPending';
  const s = status.toLowerCase();
  if (s === 'pending') return 'statusPending';
  if (s === 'in progress') return 'statusInProgress';
  if (s === 'completed') return 'statusCompleted';
  return 'statusPending';
}

function confirmDelete(taskId, deleteUrl) {
  const isConfirmed = confirm(`Are you sure you want to delete this task? This action cannot be undone.`);
  
  if (isConfirmed) {
    window.location.href = deleteUrl;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('Admin Tasks Page Loaded. Data is now handled by Django.');
});