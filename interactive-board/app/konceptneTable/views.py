import sys
from os import listdir
from os.path import isfile, join
from django.template import RequestContext
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect, HttpResponse
from django.conf import settings
from django.template.loader import render_to_string
from datetime import datetime
from . import models
from . import forms
import urllib.request
import urllib.parse

def authenticateUser(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return redirect('index')
    else:
        messages.error(request, 'Neveljaven poskus prijave. Prosimo, poskusite znova.')

def index(request):
    tables = models.ConceptTable.objects.all()
    return render(request, 'konceptneTable/index.html', {"concept_tables" : tables })

def showConceptTable(request, table_id):
    # Common content for all concept tables
    # Fix this
    common_images_path = join(settings.BASE_DIR, "konceptneTable", "static", "konceptneTable", "media", "commonImages")
    common_images = [f for f in listdir(common_images_path) if isfile(join(common_images_path, f))]

    # Content specific to a certain content table
    table = models.ConceptTable.objects.get(pk=table_id)
    content = table.contentpiece_set.all().order_by('slot') # Sort according to preferred position in content

    commentForm = forms.CommentForm()

    return render(request, 'konceptneTable/table.html', {"comment_form": commentForm, "common_images" : common_images, "content" : content, "table" : table})

@login_required
def showConceptTableEditForm(request, table_id):
    currentTable = models.ConceptTable.objects.get(pk=table_id)
    tableForm = forms.ConceptTableForm(instance=currentTable)
    return render(request, 'konceptneTable/editTable.html', {"form" : tableForm, "table" : currentTable, "contentForm" : forms.ContentPieceForm(), "contentEditForm" : forms.ContentPieceEditForm()})

@login_required
def saveConceptTable(request, table_id):
    instance = models.ConceptTable.objects.get(id=table_id)
    form = forms.ConceptTableForm(request.POST, instance=instance)
    if form.is_valid():
        form.save()
        messages.success(request, 'Konceptna tabla "' + instance.name + '" uspešno posodobljena')
        return redirect('index')

    tableForm = forms.ConceptTableForm(instance=instance)
    messages.error(request, 'Prišlo je do napake pri posodabljanju konceptne table')
    return render(request, 'konceptneTable/editTable.html', {"form" : tableForm, "table" : instance, "contentForm" : forms.ContentPieceForm()})

@login_required
def reorderContent(request, table_id):
    table = models.ConceptTable.objects.get(pk=table_id)
    table_content = table.contentpiece_set.all()
    ordering = request.POST

    for key in ordering:
        try:
            print("key = " + key + ", val = " + ordering.get(key))
            piece = table_content.get(slot=int(key))
            piece.newSlot = int(ordering.get(key))
            piece.save()
        except Exception as e:
            print(str(e))

    for piece in table_content:
        piece.slot = piece.newSlot
        piece.save()

    return redirect('editConceptTable', table_id)

@login_required
def deleteConceptTable(request, table_id):
    table = models.ConceptTable.objects.get(pk=table_id)
    table.delete()
    return redirect('index')

@login_required
def deleteContentPiece(request, table_id, piece_id):
    instance = models.ConceptTable.objects.get(id=table_id)
    piece = models.ContentPiece.objects.get(id=piece_id)
    piece.delete()
    instance.reorder_content_pieces()
    instance.save()
    tableForm = forms.ConceptTableForm(instance=instance)
    return redirect('editConceptTable', table_id)

@login_required
def addContentPiece(request, table_id):
    table = models.ConceptTable.objects.get(id=table_id)
    form = forms.ContentPieceForm(request.POST, request.FILES)
    if form.is_valid():
        slot = table.contentpiece_set.all().count()
        piece = form.save(commit=False)
        piece.conceptTable = table
        piece.slot = slot
        piece.save()
        return redirect('editConceptTable', table_id)

    messages.error(request, "Prišlo je do napake pri dodajanju novega elementa")
    return redirect('editConceptTable', table_id)

def saveComment(request, table_id):
    form = forms.CommentForm(request.POST)
    results = "NE DELA"

    if form.is_valid():
        print("success")
        comment = form.save()
        comment.conceptTable = models.ConceptTable.objects.get(pk=table_id)
        comment.save()
        table = models.ConceptTable.objects.get(pk=table_id)
        results = render_to_string('konceptneTable/comments.html', {"table": table})
    else:
        print("form not valid")
        print(str(form.errors))

    return HttpResponse(results)

def deleteComment(request, comment_id):
    comment = models.Comment.objects.get(id=comment_id)
    table = comment.conceptTable
    comment.delete()
    return redirect('showTableComments', table.id)


@login_required
def editContentPiece(request, table_id, piece_id):
    piece = models.ContentPiece.objects.get(id=piece_id)
    form = forms.ContentPieceEditForm(instance=piece)
    content = render_to_string('konceptneTable/contentPieceEditForm.html', {"form": form, "piece": piece}, RequestContext(request))
    return HttpResponse(content)

@login_required
def updateContentPiece(request, piece_id):
    piece = models.ContentPiece.objects.get(id=piece_id)
    form = forms.ContentPieceEditForm(request.POST, instance=piece)
    if form.is_valid():
        form.save()
    else:
        print(form.errors)
    return redirect('editConceptTable', piece.conceptTable.id)

def showTableComments(request, table_id):
    table = models.ConceptTable.objects.get(pk=table_id)
    comments_by_day =  dict()
    from django.utils.formats import get_format
    from django.utils.dateformat import DateFormat, time_format

    for comment in table.comment_set.all():
        df = DateFormat(comment.published)
        date = df.format('d.m.Y')
        time = str(comment.published.time().hour) +  ":" + str(comment.published.time().minute)
        if date not in comments_by_day:
            comments_by_day[date] = [[time, comment]]
        else:
            comments_by_day[date].append([time, comment])

    return render(request, 'konceptneTable/tableComments.html', {"table": table, "comments_by_day" : comments_by_day})

def query(request, table_id):
    query = request.POST["query"]
    print("query = " + query)


    params = urllib.parse.urlencode({'q': query.encode('utf-8'),
                                     'num': 5,
                                     'start': 0})
    imageParams = urllib.parse.urlencode({ 'q' : query.encode('utf-8'),
                                           'tbm' : 'isch'})

    url = 'https://www.google.com/search?%s' % (params)
    urlImages  = 'https://www.google.com/search?%s' % (imageParams)
    print("web search url = " + url)
    print("image search url = " + urlImages)

    headers = {'User-Agent': "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.27 Safari/537.17"}

    # Text results
    req = urllib.request.Request(url, headers=headers)
    resp = urllib.request.urlopen(req)
    respData = resp.read().decode(resp.headers.get_content_charset())
    page = str(respData)

    # Image results
    req = urllib.request.Request(urlImages, headers=headers)
    resp = urllib.request.urlopen(req)
    respData = resp.read().decode(resp.headers.get_content_charset())
    imagesPage = str(respData)

    from bs4 import BeautifulSoup
    import json  # or `import simplejson as json` if on Python < 2.6

    queryResults = {}
    queryImageResults = []
    try:
        # Parse text results
        soup = BeautifulSoup(page, 'html.parser')
        for h3 in soup.find_all('h3', attrs={"class": "r"}):
           title = h3.a.string
           link = h3.a['href']
           queryResults[title] = link

        # Parse image results
        imageSoup = BeautifulSoup(imagesPage, 'html.parser')
        for metaDiv in imageSoup.find_all('div', attrs={"class": "rg_meta"}):
            obj = json.loads(metaDiv.get_text())
            queryImageResults.append(obj['ou'])

    except Exception as e:
        print("Exception caught: " + str(e))

    results = render_to_string('konceptneTable/queryResults.html', {"query": query, "data": queryResults, "images": queryImageResults})

    return HttpResponse(results)
