from django import forms
from django.forms import ModelForm, Textarea
from .models import Comment, ContentPiece, ConceptTable

class CommentForm(ModelForm):
    class Meta:
        model = Comment
        fields = ['content']

class ContentPieceForm(ModelForm):
    class Meta:
        model = ContentPiece
        exclude = ['conceptTable', 'slot', 'filename', 'newSlot']
        labels = {
            'file' : 'Izberi datoteko',
            'isImage' : 'Tip vsebine',
            'autoplay' : 'Samodejno predvajanje',
        },
        widgets = {
            'description': Textarea(attrs={'rows': 4, 'placeholder': "Slovenski opis"}),
            'description_en': Textarea(attrs={'rows': 4, 'placeholder': "Angleški opis"}),
        }

class ContentPieceEditForm(ModelForm):
    class Meta:
        model = ContentPiece
        fields = ['description', 'description_en', 'autoplay']
        labels = {
             'autoplay': 'Samodejno predvajanje',
         },
        widgets = {
            'description': Textarea(attrs={'rows': 4, 'placeholder': "Slovenski opis"}),
            'description_en': Textarea(attrs={'rows': 4, 'placeholder': "Angleški opis"}),
        }

class ConceptTableForm(ModelForm):

    class Meta:
        model = ConceptTable
        fields = ['author', 'copyright', 'copyright_en', 'name', 'name_en', 'description', 'description_en']
        labels = {
            'name' : 'Ime table',
            'name_en' : 'Ime table (angleško)',
            'author' : 'Avtor',
            'copyright' : 'Avtorske pravice',
            'copyright_en' : 'Avtorske pravice (angleško)',
            'description' : 'Opis table',
            'description_en' : 'Opis table (angleški)',
        }
        widgets = {
            'description' : Textarea(attrs={'rows':6}),
            'description_en' : Textarea(attrs={'rows':6}),
            'copyright' : Textarea(attrs={'rows':3}),
            'copyright_en': Textarea(attrs={'rows': 3}),
        }
