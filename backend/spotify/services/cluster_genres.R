library(ggplot2)
library(tidyverse)
library(tsne)
library(mlbench)
library(doParallel)
library(foreach)
library(dbscan)

c25 <- c("#1CE6FF","#FF34FF","#FF4A46","#008941","#006FA6","#A30059","#7A4900","#0000A6","#63FFAC","#B79762",
         "#004D43","#8FB0FF","#997D87","#5A0007","#809693","#1B4400","#4FC601","#3B5DFF","#4A3B53","#FF2F80",
         "#61615A","#BA0900","#6B7900","#00C2A0","#000035","#7B4F4B","#A1C299","#300018","#0AA6D8","#013349","#00846F","#372101","#FFB500","#C2FFED","#A079BF","#CC0744","#C0B9B2","#C2FF99","#001E09","#00489C","#6F0062","#0CBD66","#EEC3FF","#456D75","#B77B68","#7A87A1","#788D66","#885578","#FAD09F","#FF8A9A","#D157A0","#BEC459","#456648","#0086ED","#886F4C","#34362D","#B4A8BD","#00A6AA","#452C2C","#636375","#A3C8C9","#FF913F","#938A81","#575329","#00FECF","#B05B6F","#8CD0FF","#3B9700","#04F757","#C8A1A1","#1E6E00","#7900D7","#A77500","#6367A9","#A05837","#6B002C","#772600","#D790FF","#9B9700","#549E79","#FFF69F","#201625","#72418F","#BC23FF","#99ADC0","#3A2465","#922329","#5B4534","#FDE8DC","#404E55","#0089A3","#CB7E98","#A4E804","#324E72","#6A3A4C","#83AB58","#001C1E","#D1F7CE","#004B28","#C8D0F6","#A3A489","#806C66","#222800","#BF5650","#E83000","#66796D","#DA007C","#FF1A59","#8ADBB4","#1E0200","#5B4E51","#C895C5","#320033","#FF6832","#66E1D3","#CFCDAC","#D0AC94","#7ED379","#012C58","#7A7BFF","#D68E01","#353339","#78AFA1","#FEB2C6","#75797C","#837393","#943A4D","#B5F4FF","#D2DCD5","#9556BD","#6A714A","#001325","#02525F","#0AA3F7","#E98176","#DBD5DD","#5EBCD1","#3D4F44","#7E6405","#02684E","#962B75","#8D8546","#9695C5","#E773CE","#D86A78","#3E89BE","#CA834E","#518A87","#5B113C","#55813B","#E704C4","#00005F","#A97399","#4B8160","#59738A","#FF5DA7","#F7C9BF","#643127","#513A01","#6B94AA","#51A058","#A45B02","#1D1702","#E20027","#E7AB63","#4C6001","#9C6966","#64547B","#97979E","#006A66","#391406","#F4D749","#0045D2","#006C31","#DDB6D0","#7C6571","#9FB2A4","#00D891","#15A08A","#BC65E9","#FFFFFE","#C6DC99","#203B3C","#671190","#6B3A64","#F5E1FF","#FFA0F2","#CCAA35","#374527","#8BB400","#797868","#C6005A","#3B000A","#C86240","#29607C","#402334","#7D5A44","#CCB87C","#B88183","#AA5199","#B5D6C3","#A38469","#9F94F0","#A74571","#B894A6","#71BB8C","#00B433","#789EC9","#6D80BA","#953F00","#5EFF03","#E4FFFC","#1BE177","#BCB1E5","#76912F","#003109","#0060CD","#D20096","#895563","#29201D","#5B3213","#A76F42","#89412E","#1A3A2A","#494B5A","#A88C85","#F4ABAA","#A3F3AB","#00C6C8","#EA8B66","#958A9F","#BDC9D2","#9FA064","#BE4700","#658188","#83A485","#453C23","#47675D","#3A3F00","#061203","#DFFB71","#868E7E","#98D058","#6C8F7D","#D7BFC2","#3C3E6E","#D83D66","#2F5D9B","#6C5E46","#D25B88","#5B656C","#00B57F","#545C46","#866097","#365D25","#252F99","#00CCFF","#674E60","#FC009C","#92896B")

min_max_norm <- function(x) {
  (x - min(x)) / (max(x) - min(x))
}

WCSS = function(x){
  wcss = c()
  for(i in 1:length(x)){
    cl = x[i][[1]]
    wcss = c(wcss, cl$tot.withinss)
  }
  return(wcss)
}

FILE_PATH = dirname(rstudioapi::getSourceEditorContext()$path)
PLOT_PATH = file.path(FILE_PATH, "cluster-plots")
TRACKS_FILE_PATH = file.path(FILE_PATH, "enao.csv")
genres = as.data.frame(readr::read_csv(TRACKS_FILE_PATH))
genres = genres %>% arrange(y_value)
#genres$x_value = min_max_norm(genres$x_value)
#genres$y_value = min_max_norm(genres$y_value)
#genres$color_R = genres$color_R/255
#genres$color_G = genres$color_G/255
#genres$color_B = genres$color_B/255

plt_all_genre = ggplot(genres, aes(x_value, y_value, color = color_hex, size=font_size)) +
                      geom_point() +
                      scale_colour_manual(values = genres$color_hex) +
                      theme_minimal() +
                      ggtitle("All Genres from everynoise.com") +
                      theme(plot.title = element_text(hjust = 0.5),
                            legend.position="none",
                            axis.text.x = element_blank(),
                            axis.text.y = element_blank(),
                            axis.title.x = element_blank(),
                            axis.title.y = element_blank())
plt_all_genre
ggsave(filename = file.path(PLOT_PATH, "all_genres.png"), plot = plt_all_genre, width = 5, height = 10)

genre_font_sizes = genres %>%
                      group_by(font_size) %>%
                      summarise(count=n())

genre_font_sizes[15:34,]
font_size_threshold = 118

genres_cluster_centers = genres %>% filter(font_size >= font_size_threshold)
genres_without_cluster_centers = genres %>% filter(font_size < font_size_threshold)

cluster_center_plot = ggplot(genres_cluster_centers, aes(x_value, y_value, size = font_size, color = color_hex, label = genre)) +
                            geom_point() +
                            geom_text(vjust=1.8, size = 4) +
                            scale_colour_manual(values=genres_cluster_centers$color_hex) +
                            theme_minimal() +
                            ggtitle("Biggest 36 Genres from everynoise.com as Cluster Centers") +
                            theme(plot.title = element_text(hjust = 0.5),
                                  legend.position="none",
                                  axis.text.x = element_blank(),
                                  axis.text.y = element_blank(),
                                  axis.title.x = element_blank(),
                                  axis.title.y = element_blank())
  
cluster_center_plot
ggsave(filename = file.path(PLOT_PATH, "cluster_centers.png"), plot = cluster_center_plot, width = 5, height = 10)

cluster_centers = genres_cluster_centers %>% select(color_R, color_G, color_B)
genre_data = genres_without_cluster_centers %>% select(color_R, color_G, color_B)

genres_without_cluster_centers$cluster = dbscan::kNN(x=cluster_centers, k=1, query=genre_data)$id[,1]
genres_without_cluster_centers$cluster_color = genres_cluster_centers$color_hex[genres_without_cluster_centers$cluster]
genres_without_cluster_centers = genres_without_cluster_centers %>% arrange(cluster)

genres_cluster_centers$cluster = genres_cluster_centers$genre
genres_cluster_centers$cluster_color = genres_cluster_centers$color_hex
genres_without_cluster_centers$cluster = genres_cluster_centers$cluster[genres_without_cluster_centers$cluster]

genres = rbind(genres_cluster_centers, genres_without_cluster_centers)
genres = genres %>% arrange(cluster)


genres_clustered_plot = ggplot(genres_without_cluster_centers, aes(x_value, y_value, color = cluster_color)) +
            geom_point(size = 1.2) +
            geom_point(data=genres_cluster_centers, aes(color = color_hex), size=8, stroke = 1.5, shape=10) +
            #scale_colour_manual(values=genres_cluster_centers$color_hex, labels = genres_cluster_centers$genre)
            scale_colour_manual(values=c25[1:nrow(genres_cluster_centers)], labels = genres_cluster_centers$genre) +
            theme_minimal() +
            ggtitle("All Genres clustered") +
            theme(plot.title = element_text(hjust = 0.5),
                  legend.title = element_blank(),
                  axis.text.x = element_blank(),
                  axis.text.y = element_blank(),
                  axis.title.x = element_blank(),
                  axis.title.y = element_blank())
  
genres_clustered_plot
ggsave(filename = file.path(PLOT_PATH, "clustered_genres.png"), plot = genres_clustered_plot, width = 8, height = 10)



readr::write_delim(genres, TRACKS_FILE_PATH, delim = ",")
###########################
# conventional clustering #
###########################
genres_data = genres %>% select(color_R, color_G, color_B)

k_neighbors = 4

k_dist = dbscan::kNN(x=genres_data, k=k_neighbors)$dist
k_dist = unlist(k_dist)
k_dist = sort(k_dist, decreasing = TRUE)
k_dist = as.data.frame(k_dist)
k_dist$x = c(1:nrow(k_dist))
k_dist_plot = ggplot(k_dist[1:1000,], aes(x, k_dist)) + 
                    geom_line() +
                    theme_minimal() +
                    ggtitle("First 1000 ordered pairwise distances of each point to 4 neighbours") +
                    ylab("distance")+
                    theme(plot.title = element_text(hjust = 0.5),
                          legend.title = element_blank(),
                          axis.title.x = element_blank())
k_dist_plot
ggsave(filename = file.path(PLOT_PATH, "dbscan_k_distances.png"), plot = k_dist_plot, width = 10, height = 10)

genres$dbscan_cluster = as.factor(dbscan(genres_data, eps=21, minPts = k_neighbors)$cluster)

dbscan_plot = ggplot(genres, aes(x_value, y_value, color = dbscan_cluster)) +
            geom_point() +
            scale_colour_manual(values=c25[1:nrow(genres)]) +
            theme_minimal() +
            ggtitle("All Genres clustered") +
            theme(plot.title = element_text(hjust = 0.5),
                  legend.title = element_blank(),
                  axis.text.x = element_blank(),
                  axis.text.y = element_blank(),
                  axis.title.x = element_blank(),
                  axis.title.y = element_blank())

dbscan_plot


min_cluster = 2
max_cluster = 100

registerDoParallel(cores=parallel::detectCores())
km = foreach(i=min_cluster:max_cluster) %dopar% {
  kmeans(genres_data, centers = i, nstart = 25, iter.max = 500, algorithm = "Lloyd")
}
km

clu = km[1][[1]]
clu$tot.withinss

wcss = WCSS(km)
wcss = as.data.frame(wcss)
wcss$cluster = min_cluster:max_cluster

wcss_plot = ggplot(wcss, aes(cluster, wcss)) + 
                  geom_line() +
                  theme_minimal() +
                  ggtitle("Within cluster sum of squares of k-means clustering") +
                  ylab("wcss")+
                  theme(plot.title = element_text(hjust = 0.5),
                        legend.title = element_blank(),
                        axis.title.x = element_blank())
wcss_plot

ggsave(filename = file.path(PLOT_PATH, "k-means-wcss.png"), plot = wcss_plot, width = 10, height = 10)
