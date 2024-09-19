# career_guidance/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'assessments',
    'recommendations',
    'skills',
    'career_paths',
]

# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    date_of_birth = models.DateField(null=True, blank=True)
    education_level = models.CharField(max_length=50, blank=True)
    current_occupation = models.CharField(max_length=100, blank=True)
    years_of_experience = models.IntegerField(default=0)
    industry = models.CharField(max_length=100, blank=True)

# assessments/models.py
from django.db import models
from users.models import User

class AssessmentCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

class Question(models.Model):
    category = models.ForeignKey(AssessmentCategory, on_delete=models.CASCADE)
    text = models.TextField()
    question_type = models.CharField(max_length=20)  # e.g., 'multiple_choice', 'likert_scale', 'open_ended'

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    response = models.JSONField()

class AssessmentResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(AssessmentCategory, on_delete=models.CASCADE)
    score = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

# skills/models.py
from django.db import models

class Skill(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)

# career_paths/models.py
from django.db import models
from skills.models import Skill

class CareerPath(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    required_skills = models.ManyToManyField(Skill, related_name='career_paths')
    average_salary = models.DecimalField(max_digits=10, decimal_places=2)
    job_outlook = models.TextField()

# recommendations/models.py
from django.db import models
from users.models import User
from career_paths.models import CareerPath

class CareerRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    career_path = models.ForeignKey(CareerPath, on_delete=models.CASCADE)
    confidence_score = models.FloatField()
    reasoning = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

# assessments/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Question, Answer, AssessmentResult
from .serializers import QuestionSerializer, AnswerSerializer, AssessmentResultSerializer

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    @action(detail=False, methods=['POST'])
    def submit_assessment(self, request):
        user = request.user
        answers_data = request.data.get('answers', [])
        
        for answer_data in answers_data:
            question = Question.objects.get(id=answer_data['question_id'])
            Answer.objects.create(user=user, question=question, response=answer_data['response'])
        
        # Process answers and create AssessmentResult
        # This is where you'd call your ML model to generate results
        
        return Response({'status': 'Assessment submitted successfully'})

# recommendations/views.py
from rest_framework import viewsets
from .models import CareerRecommendation
from .serializers import CareerRecommendationSerializer

class RecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CareerRecommendationSerializer

    def get_queryset(self):
        return CareerRecommendation.objects.filter(user=self.request.user).order_by('-confidence_score')
