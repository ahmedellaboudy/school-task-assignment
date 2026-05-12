import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from .models import Profile

def signup_page(request):
    return render(request, 'signup.html')

def index(request):
    return render(request, 'index.html')

def login_page(request):
    return render(request, 'login.html')

@csrf_exempt
def signup_api(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        role = data.get('role', '').strip()

        if not username: return JsonResponse({'success': False, 'field': 'username', 'message': 'Username is required'})
        if not email: return JsonResponse({'success': False, 'field': 'email', 'message': 'Email is required'})
        if '@' not in email: return JsonResponse({'success': False, 'field': 'email', 'message': 'Email must contain @'})
        if not password: return JsonResponse({'success': False, 'field': 'password', 'message': 'Password is required'})
        if len(password) < 6: return JsonResponse({'success': False, 'field': 'password', 'message': 'Password must be at least 6 characters'})
        if password != confirm_password: return JsonResponse({'success': False, 'field': 'confirm_password', 'message': 'Passwords do not match'})
        if role not in ['admin', 'teacher']: return JsonResponse({'success': False, 'field': 'role', 'message': 'Please select a valid role'})

        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'field': 'username', 'message': 'Username already exists'})
        if User.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'field': 'email', 'message': 'Email already registered'})

        user = User.objects.create_user(username=username, email=email, password=password)
        Profile.objects.create(user=user, is_admin=(role == 'admin'))

        return JsonResponse({'success': True, 'message': 'Account created successfully', 'redirect': '/login/'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@csrf_exempt
def login_api(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        password = data.get('password', '')

        try:
            user_obj = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'field': 'password', 'message': 'Invalid email or password'})

        user = authenticate(request, username=user_obj.username, password=password)
        if user is None:
            return JsonResponse({'success': False, 'field': 'password', 'message': 'Invalid email or password'})

        login(request, user)
        profile, _ = Profile.objects.get_or_create(user=user)
        role = 'admin' if profile.is_admin else 'teacher'
        redirect_url = '/admin-panel/dashboard/' if profile.is_admin else '/teacher/dashboard/'

        return JsonResponse({
            'success': True, 
            'redirect': redirect_url,
            'user': {'username': user.username, 'role': role}
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@csrf_exempt
def logout_api(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def me_api(request):
    if request.user.is_authenticated:
        is_admin = hasattr(request.user, 'profile') and request.user.profile.is_admin
        return JsonResponse({
            'is_authenticated': True,
            'username': request.user.username,
            'role': 'admin' if is_admin else 'teacher'
        })
    return JsonResponse({'is_authenticated': False})