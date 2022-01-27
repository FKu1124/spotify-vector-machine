library(ggplot2)
library(tidyverse)
library(RColorBrewer)
library(ggsci)

TRACKS_FILE_PATH = file.path(dirname(rstudioapi::getSourceEditorContext()$path), "tracks.csv")
tracks = as.data.frame(readr::read_csv(TRACKS_FILE_PATH))

plt = ggplot(tracks, aes(valence, energy, color = genre)) 
plt = plt + geom_point()
plt


tracks_aggregated = tracks
tracks_aggregated = tracks_aggregated %>%
                          group_by(genre) %>%
                          summarise_at(c("valence", "energy"), mean)%>%
                          arrange(valence, energy)

data = cbind(tracks_aggregated$valence, tracks_aggregated$energy)
tracks_aggregated$cluster = as.factor(kmeans(data, centers = 10, nstart = 25, iter.max = 250)$cluster)

#tracks_aggregated$myColors = seq(from=0, to =1, length.out=nrow(tracks_aggregated))
#tracks_aggregated$myColors = tracks_aggregated$valence * tracks_aggregated$energy 


colourCount = length(unique(tracks_aggregated$cluster))
getPalette = colorRampPalette(brewer.pal(9, "Set1"))

  
plt = ggplot(tracks_aggregated, aes(valence, energy, color = cluster, label=genre))
plt = plt + geom_point()
plt = plt + scale_colour_brewer('My groups', palette = 'Set2')
plt = plt + geom_text(vjust=1.5)
plt


