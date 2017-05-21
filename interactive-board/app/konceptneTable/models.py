from django.db import models
from datetime import datetime
import os


class ConceptTable(models.Model):
    name = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    author = models.CharField(max_length=250)
    copyright = models.CharField(max_length=300)
    copyright_en = models.CharField(max_length=300)
    description = models.CharField(max_length=300)
    description_en = models.CharField(max_length=300)
    contentSlots = models.PositiveIntegerField(default=4)

    def reorder_content_pieces(self):
        slot = 0
        for piece in self.contentpiece_set.all():
            piece.slot = slot
            piece.save()
            slot += 1

from django.conf import settings
class ContentPiece(models.Model):
    CONTENT_TYPE = (
        (True, 'Slika/Fotografija'),
        (False, 'Video'),
    )

    conceptTable = models.ForeignKey(ConceptTable, on_delete=models.CASCADE)
    description = models.CharField(max_length=250, null=True)
    description_en = models.CharField(max_length=250, null=True)
    filename = models.CharField(max_length=100, null=True, default="")
    file = models.FileField(max_length=500, upload_to=settings.BASE_DIR + '/konceptneTable/static/konceptneTable/media/content/', null=True)
    slot = models.IntegerField(default=0)
    newSlot = models.IntegerField(default=0)
    isImage = models.BooleanField(default=True, choices=CONTENT_TYPE) # if it's not image, its a video
    autoplay = models.BooleanField(default=False) # whetheror not video autoplay is on

    @property
    def file_name(self):
        return os.path.basename(self.file.name)

    class Meta:
        ordering = ['slot']

class Comment(models.Model):
    conceptTable = models.ForeignKey(ConceptTable, on_delete=models.CASCADE, null=True)
    content = models.CharField(max_length=250, blank=False)
    published = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        ordering = ['-published']