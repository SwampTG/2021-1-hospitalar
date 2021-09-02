from django.conf.urls import url
from hospital import views




urlpatterns = [
    url(r'^item$',views.itemApi),
    url(r'^item/([0-9]+)$', views.itemApi)


]