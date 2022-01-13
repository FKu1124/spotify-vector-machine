install.packages("doParallel")
library(ggplot2)
library(tidyverse)
library(tsne)
library(mlbench)
library(doParallel)
library(foreach)
parallel::detectCores()

TRACKS_FILE_PATH = file.path(dirname(rstudioapi::getSourceEditorContext()$path), "tracks.csv")

tracks = as.data.frame(readr::read_csv(TRACKS_FILE_PATH))
tracks = tracks %>% 
            select(-...1)

tracks_principalComponents = prcomp(tracks, scale. = T)

tracks_principalComponents_sdev = tracks_principalComponents$sdev
tracks_principalComponents_var = tracks_principalComponents_sdev^2

cumsum(tracks_principalComponents_var/sum(tracks_principalComponents_var))

tracks_principalComponents


tracks_selected = tracks %>% 
                    select(-key, -mode, -time_signature)


tracks_selected_principalComponents = prcomp(tracks_selected, scale. = T)

tracks_selected_principalComponents_sdev = tracks_selected_principalComponents$sdev
tracks_selected_principalComponents_var = tracks_selected_principalComponents_sdev^2

cumsum(tracks_selected_principalComponents_var/sum(tracks_selected_principalComponents_var))

tracks_selected_principalComponents


set.seed(42L)
t_sne_result = tsne(tracks_selected[1:10000,], epoch = 10, max_iter = 150)
t_sne_result = as.data.frame(t_sne_result)
ggplot(t_sne_result, aes(V1, V2)) + geom_point()


registerDoParallel(cores=8)
km = foreach(i=2:126) %dopar% {
  kmeans(tracks_selected, centers = i, nstart = 25, iter.max = 500, algorithm = "Lloyd")
}
km

clu = km[1][[1]]
clu$tot.withinss

WCSS = function(x){
  wcss = c()
  for(i in 1:length(x)){
    cl = x[i][[1]]
    wcss = c(wcss, cl$tot.withinss)
  }
  return(wcss)
}

wcss = WCSS(km)
wcss = as.data.frame(wcss)
wcss$x = 1:length(km)

ggplot(wcss, aes(x, wcss)) + geom_line()












