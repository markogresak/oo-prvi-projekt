from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^tables/(?P<table_id>[0-9]+)/sendQuery/$', views.query, name='query'),
    url(r'^tables/(?P<table_id>[0-9]+)/$', views.showConceptTable, name='showConceptTable'),
    url(r'^tables/(?P<table_id>[0-9]+)/edit/$', views.showConceptTableEditForm, name='editConceptTable'),
    url(r'^tables/(?P<table_id>[0-9]+)/edit/(?P<piece_id>[0-9]+)/delete/$', views.deleteContentPiece, name='deleteContentPiece'),
    url(r'^tables/(?P<table_id>[0-9]+)/edit/(?P<piece_id>[0-9]+)/edit/$', views.editContentPiece, name='editContentPiece'),
    url(r'^pieces/(?P<piece_id>[0-9]+)/update/$', views.updateContentPiece, name='updateContentPiece'),
    url(r'^tables/(?P<table_id>[0-9]+)/edit/newPiece/$', views.addContentPiece, name='addContentPiece'),
    url(r'^tables/(?P<table_id>[0-9]+)/delete/$', views.deleteConceptTable, name='deleteConceptTable'),
    url(r'^tables/(?P<table_id>[0-9]+)/save/$', views.saveConceptTable, name='saveConceptTable'),
    url(r'^tables/(?P<table_id>[0-9]+)/reorder/$', views.reorderContent, name='reorderContent'),
    url(r'^tables/(?P<table_id>[0-9]+)/showComments/$', views.showTableComments, name='showTableComments'),
    url(r'^tables/(?P<table_id>[0-9]+)/postComment/$', views.saveComment, name='saveComment'),
    url(r'^comments/(?P<comment_id>[0-9]+)/delete$', views.deleteComment, name='deleteComment'),
]